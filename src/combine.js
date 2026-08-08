import { BINDING_SIGN, COMPONENT_PREFIX, DEFAULT_CONTAINER, UTIL_KEYS } from "./consts";
import { forEach, getParamNames, isFunction, isString } from "./helpers";
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
  const [wrapper, templateObj, value] = args;
  const { tag, classes } = getContainerOptions(wrapper, templateId);
  const [name, template] = getTemplateOptions(templateObj);
  const id = Object.keys(childrenState).length;
  const templateName = name || `${UTIL_KEYS.CHILDREN}${id}`;
  const computeFn =
    isFunction(value) &&
    function (...args) {
      const result = value.apply(null, args);
      return Array.isArray(result) ? result : [result];
    };
  const dependencies = computeFn && getParamNames(value) || []; 
  childrenState[`${templateName}`] = {
    template,
    [UTIL_KEYS.CHILDREN]: [],
    [UTIL_KEYS.ON_CHANGE]: [],
    [UTIL_KEYS.DEPENDANTS]: [],
    [UTIL_KEYS.VALUE]: {
      value: !value && [{}] || Array.isArray(value) ? value : [value],
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
    const { dependencies } = template[UTIL_KEYS.VALUE];
    dependencies.forEach((name) => state[name][UTIL_KEYS.DEPENDANTS][templateName] = [UTIL_KEYS.VALUE]);
  })
}

function getContainerOptions(str, classPrefix) {
  const segments = str.split(BINDING_SIGN.CLASS);
  return {
    tag: segments[0] || DEFAULT_CONTAINER,
    classes: segments
      .slice(1)
      .map((cls) => `${classPrefix}${cls}`)
      .join(" "),
  };
}

function getTemplateOptions(templateObj) {
  const keys = Object.keys(templateObj);
  if (keys.length === 1) {
    return Object.entries(templateObj)[0];
  }

  return [false, templateObj];
}