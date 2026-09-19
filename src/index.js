import {
  prepareStateSettings,
  updateTemplateMarkup,
  setupComponentMarkup,
  getValues,
} from "./state";
import { addChildMarkup, cloneHTMLMarkup, gatherBindings } from "./html";
import { prepareStyles } from "./styles";
import { isObject, copy, isDOMElement, isFunction, map, uid, filter, forEach } from "./helpers";
import { combineState, combineTemplates } from "./combine";
import { UTIL_KEYS } from "./consts";
import { runStateChangeListeners } from "./lifecycle";


function createTemplate (markupStr, stateBehaviour, styleSheets, parentId) {
  const id = parentId || uid();
  const [markup, childrenState] = isFunction(markupStr)
    ? combineTemplates(markupStr, id)
    : [cloneHTMLMarkup(markupStr), {}];

  const [state, styles] = isObject(stateBehaviour)
    ? [prepareStateSettings(stateBehaviour), prepareStyles(id, styleSheets)]
    : [{}, prepareStyles(id, stateBehaviour)];

  const isStateless = !Object.keys(state).length || !!parentId;

  combineState(state, childrenState);

  const boundElements = gatherBindings(markup, id, true);
  updateTemplateMarkup(boundElements, state);

  const allStyles = map(childrenState, (_, v) => v)
    .map((v) => v.createComponent.styles)
    .reduce((a, v) => a.concat(v), [])
    .concat(styles);

  const template = {
    id,
    markup,
    state,
    styles: allStyles,
    [UTIL_KEYS.IS_STATELESS]: isStateless,
    [UTIL_KEYS.IS_ANONYMOUS]: isStateless,
  };

  return Object.assign((...args) => createComponent(template, ...args), {
    ...template,
    asPopup: (options) => createComponent(template, {}, document.body, { ...options, isPopup: true })
  });
}

function createComponent (template, ...args) {
  isDOMElement(args[0]) && args.unshift({})
  const [stateValues, target, options] = args;

  if (template[UTIL_KEYS.IS_STATELESS]) {
    Object.assign(template.state, prepareStateSettings(stateValues, true));
    template[UTIL_KEYS.IS_STATELESS] = false;
  }

  const markup = template.markup.cloneNode(true);
  const state = copy({}, template.state);
  state[UTIL_KEYS.PARENT_STATE] = options?.[UTIL_KEYS.PARENT_STATE];
  state[UTIL_KEYS.CHILDREN_DATA] = options?.[UTIL_KEYS.CHILDREN_DATA];
  state[UTIL_KEYS.MARKUP_COMPONENT] = markup;

  const boundElements = gatherBindings(markup, template.id);
  const api =
    state &&
    setupComponentMarkup(
      boundElements,
      state,
      template[UTIL_KEYS.IS_ANONYMOUS]
        ? getValues(prepareStateSettings(stateValues))
        : stateValues,
    );

  const component = { api, ...template, markup, state };

  if (target) {
    return append(target, component, options);
  }

  return Object.assign((target, options) => append(target, component, options), {
    asPopup: (options) =>
      append(document.body, component, { ...options, isPopup: true }),
  });
}

export function append (parentNode, component, options = {}) {
  addChildMarkup(parentNode, component, options);

  const { state } = component;
  state[UTIL_KEYS.IS_RENDERED_COMPONENT] = true;

  return runStateChangeListeners(true, state);;
}


export default createTemplate;