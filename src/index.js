import {
  prepareStateSettings,
  updateTemplateMarkup,
  setupComponentMarkup,
} from "./state";
import { cloneHTMLMarkup, gatherBindings } from "./html";
import { prepareStyles } from "./styles";
import { addPopupLogic } from './popup';
import { isObject, copy, isDOMElement, isFunction, map } from "./helpers";
import { combineState, combineTemplates } from "./combine";
import { UTIL_KEYS } from "./consts";


function createTemplate (markupStr, stateBehaviour, styleSheets) {
  const [markup, childrenState] = isFunction(markupStr)
    ? combineTemplates(markupStr)
    : [cloneHTMLMarkup(markupStr), {}];
  const [state, styles] = isObject(stateBehaviour)
    ? [prepareStateSettings(stateBehaviour), prepareStyles(styleSheets)]
    : [{}, prepareStyles(stateBehaviour)];

  combineState(state, childrenState);

  const boundElements = gatherBindings(markup, true);
  updateTemplateMarkup(boundElements, state);

  const allStyles = Object.values(
    map(childrenState, (k, v) => [k, v.template.styles]),
  ).reduce((a, v) => a.concat(v), [])
   .concat(styles);

  const template = { markup, state, styles: allStyles };

  return Object.assign((...args) => createComponent(template, ...args), {
    ...template,
    asPopup: (options) => createComponent(template, {}, document.body, { ...options, isPopup: true })
  });
}

function createComponent (template, ...args) {
  isDOMElement(args[0]) && args.unshift({})
  const [stateValues, target, options] = args;

  const markup = template.markup.cloneNode(true);
  const state = copy({}, template.state);
  const boundElements = gatherBindings(markup);
  const api = state && setupComponentMarkup(boundElements, state, stateValues);

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

  let el;

  if (options.isNoShadow) {
    el = markup;
  } else {
    el = document.createElement("div");
    const host = el.attachShadow({ mode: "open" });
    host.adoptedStyleSheets = styles;
    host.appendChild(markup);
  }

  target.appendChild(el);

  if (options.isPopup) {
    addPopupLogic(markup, options);
  }

  return {
    ...api,
    append: () => append(target, component),
    destroy: () => target.removeChild(el),
  };
}


export default createTemplate;