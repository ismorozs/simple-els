import { prepareStateSettings, prepareState } from "./state";
import { cloneHTMLMarkup, gatherBindings } from "./html";
import { prepareStyles } from "./styles";
import { addPopupLogic } from './popup';
import { isObject, copy, isDOMElement } from "./helpers";

function createTemplate (markupStr, stateBehaviour, styleSheets) {
  const markup = cloneHTMLMarkup(markupStr);
  const [state, styles] = isObject(stateBehaviour)
    ? [prepareStateSettings(stateBehaviour), prepareStyles(styleSheets)]
    : [, prepareStyles(stateBehaviour)];

  const boundElements = gatherBindings(markup, true);
  state && prepareState(boundElements, state);

  const template = { markup, state, styles };

  return Object.assign((args) => createComponent(template, args), {
    asPopup: (options) => createComponent(template, {}, document.body, { ...options, isPopup: true })
  });
}

function createComponent (template, ...args) {
  isDOMElement(args[0]) && args.unshift({})
  const [stateValues, target, options] = args;

  const markup = template.markup.cloneNode(true);
  const state = copy({}, template.state);
  const boundElements = gatherBindings(markup);
  const api = state && prepareState(boundElements, state, stateValues);

  const component = { api, ...template, markup, state };

  if (target) {
    return append(target, component, options);
  }

  return Object.assign((target, options) => append(target, component, options), {
    asPopup: (options) =>
      append(document.body, component, { ...options, isPopup: true }),
  });
}

export function append (target, component, options = {}) {
  const { markup, styles, api } = component;

  const shadowContainer = document.createElement("div");
  const host = shadowContainer.attachShadow({ mode: "open" });
  host.adoptedStyleSheets = [styles];
  host.appendChild(markup);
  target.appendChild(shadowContainer);

  if (options.isPopup) {
    addPopupLogic(markup, options);
  }

  return {
    ...api,
    append: () => append(target, component),
    destroy: () => target.removeChild(shadowContainer),
  };
}


export default createTemplate;