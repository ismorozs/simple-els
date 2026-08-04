import { BINDING_SIGN, COMPONENT_PREFIX, UTIL_KEYS } from "./consts";
import { forEach, getParamNames, isFunction } from "./helpers";
import { cloneHTMLMarkup } from "./html";

export function combineTemplates(combineCb) {
  const childrenState = {};
  const inject = (template, value) => injectTemplate(childrenState, template, value);
  const markupStr = combineCb.call(null, inject);
  return [cloneHTMLMarkup(markupStr), childrenState];
}

function injectTemplate (childrenState, template, value = {}) {
  const id = Object.keys(childrenState).length;
  const isReactive = isFunction(value);
  const dependencies = isReactive && getParamNames(value) || []; 
  childrenState[`${UTIL_KEYS.CHILDREN}${id}`] = {
    template,
    isReactive,
    isComponent: true,
    [UTIL_KEYS.ON_CHANGE]: [],
    [UTIL_KEYS.DEPENDANTS]: [],
    [UTIL_KEYS.VALUE]: {
      value: Array.isArray(value) ? value : [value],
      computeFn: isReactive && function (...args) {
        const result = value.apply(null, args);
        return Array.isArray(result) ? result : [result];
      },
      dependencies,
    },
  };
  return `<div ${BINDING_SIGN.COMPONENT}${UTIL_KEYS.CHILDREN}${id}></div>`;
}

export function combineState (state, childrenState) {
  Object.assign(state, childrenState);
  forEach(childrenState, (templateName, template) => {
    const { dependencies} = template[UTIL_KEYS.VALUE];
    dependencies.forEach((name) => state[name][UTIL_KEYS.DEPENDANTS][templateName] = [UTIL_KEYS.VALUE]);
  })
}