import { BINDING_SIGN, COMPONENT_PREFIX, DEFAULT_CONTAINER, UTIL_KEYS } from "./consts";
import { getArguments } from './state';
import { forEach, getParamNames, isFunction, isString, isArray } from "./helpers";
import { cloneHTMLMarkup } from "./html";

export function combineTemplates(combineCb, templateId) {
  const childrenState = {};
  const inject = injectTemplate.bind(null, childrenState, templateId);
  const markupStr = combineCb.call(null, inject);
  return [cloneHTMLMarkup(markupStr), childrenState];
}

function injectTemplate (childrenState, templateId, ...args) {
  if (!isString(args[0])) {
    args.unshift(DEFAULT_CONTAINER);
  }

  const [wrapper, template, value] = args;

  const [tag, classes] = getContainerOptions(wrapper, templateId);
  const [name, createComponent] = getTemplateOptions(template);
  const id = Object.keys(childrenState).length;
  const templateName = name || `${UTIL_KEYS.CHILDREN}${id}`;
  const computeFn =
    isFunction(value) &&
    function (...args) {
      return normalizeValue(value.apply(null, args));
    };
  const dependencies = computeFn && getParamNames(value) || [];
  childrenState[`${templateName}`] = {
    createComponent,
    [UTIL_KEYS.CHILDREN]: [],
    [UTIL_KEYS.ON_CHANGE]: [],
    [UTIL_KEYS.DEPENDANTS]: [],
    [UTIL_KEYS.ON_CHANGE]: [],
    [UTIL_KEYS.VALUE]: {
      value: !isFunction(value) && normalizeValue(value),
      computeFn,
      dependencies,
    },
  };
  const classAttr = `class="${classes}"`;
  return `<${tag} ${classes ? classAttr : ""} ${BINDING_SIGN.COMPONENT}${templateName}></${tag}>`;
}

export function combineState (state, childrenState) {
  Object.assign(state, childrenState);
  forEach(childrenState, (templateName, template) => {
    const { dependencies, computeFn, value } = template[UTIL_KEYS.VALUE];
    dependencies.forEach((name) => state[name][UTIL_KEYS.DEPENDANTS][templateName] = [UTIL_KEYS.VALUE]);
    template[UTIL_KEYS.VALUE].value = computeFn
      ? computeFn.apply(null, getArguments(dependencies, state))
      : value;
  })
}

function getContainerOptions(str, classPrefix) {
  const segments = str.split(BINDING_SIGN.CLASS);
  return [
    segments[0] || DEFAULT_CONTAINER,
    segments
      .slice(1)
      .map((cls) => `${classPrefix}${cls}`)
      .join(" "),
  ];
}

function getTemplateOptions(templateObj) {
  const keys = Object.keys(templateObj);
  if (keys.length === 1) {
    return Object.entries(templateObj)[0];
  }

  return [false, templateObj];
}

function normalizeValue (value) {
  return isArray(value) ? (value[0] && !isArray(value[0])) ? value.map((v) => [v]): value : [[value || {}]]
} 