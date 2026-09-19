import { BINDING_SIGN, UTIL_KEYS } from "./consts";
import { getArguments } from './state';
import { forEach, getParamNames, isFunction, isArray, set } from "./helpers";
import { cloneHTMLMarkup } from "./html";
import createTemplate from '.';

export function combineTemplates(combineCb, templateId) {
  const childrenState = {};
  const inject = injectTemplate.bind(null, childrenState, templateId);
  const markupStr = combineCb.call(null, inject);
  return [cloneHTMLMarkup(markupStr), childrenState];
}

function injectTemplate (childrenState, templateId, ...args) {
  const [template, value] = args;
  const [createComponent, isAnonymous] = getCreateFunction(template, templateId);
  const id = Object.keys(childrenState).length;
  const templateName = `${UTIL_KEYS.CHILDREN}${id}`;
  const computeFn = isFunction(value) && value;
  const dependencies = computeFn && getParamNames(value) || [];
  childrenState[`${templateName}`] = {
    createComponent,
    [UTIL_KEYS.CHILDREN]: [],
    [UTIL_KEYS.ON_CHANGE]: [],
    [UTIL_KEYS.DEPENDANTS]: [],
    [UTIL_KEYS.ON_CHANGE]: [],
    [UTIL_KEYS.IS_RENDERED]: false,
    [UTIL_KEYS.IS_ANONYMOUS]: isAnonymous,
    [UTIL_KEYS.VALUE]: {
      value: !computeFn && normalizeValue(value),
      computeFn,
      dependencies,
    },
  };

  return `<span ${BINDING_SIGN.COMPONENT}${templateName}></span>`;
}

export function combineState (state, childrenState) {
  Object.assign(state, childrenState);
  forEach(childrenState, (templateName, template) => {
    const { dependencies, computeFn, value } = template[UTIL_KEYS.VALUE];
    dependencies.forEach((name) => {
      set(state, [name, UTIL_KEYS.DEPENDANTS, templateName], [UTIL_KEYS.VALUE]);
    });
    state[UTIL_KEYS.HAS_ANONYMOUS_CHILDREN] =
      template.createComponent[UTIL_KEYS.IS_ANONYMOUS];

    const newComputeFn = computeFn && function (dependencies, state) {
      const computedValue = computeFn.apply(
        null,
        getArguments(dependencies, state),
      );

      if (!computedValue) {
        return [];
      }

      return normalizeValue(computedValue);
    }
    template[UTIL_KEYS.VALUE].computeFn = newComputeFn;
    template[UTIL_KEYS.VALUE].value = newComputeFn ? newComputeFn(dependencies, state) : value;
  })
}

function getCreateFunction(template, templateId) {
  if (template.markup) {
    return [template, false];
  }

  return [createTemplate(template, {}, undefined, templateId), true];
}

function normalizeValue (value) {
  return isArray(value) ? (value[0] && !isArray(value[0])) ? value.map((v) => [v]): value : [[value || {}]]
} 