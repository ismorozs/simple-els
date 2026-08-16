import { forEach, isHTMLString, toDashCase, addEnding, isNumber } from "./helpers";
import { BINDING_SIGN, UTIL_KEYS } from "./consts";
import { throwIllegalBindingNameError } from "./error";

export const MARKUP_ACTIONS = {
  value: ({ el }, value) => (el.value = value),
  text: ({ el }, value) => (el.textContent = value),
  html: ({ el }, value) => (el.innerHTML = value),
  attrs: ({ el, attrs }, value) => changeAttributes(el, { ...attrs, ...value, class: el.className}),
  style: ({ el }, value) => changeStyles(el, value),
  class: ({ el, classes, templateId }, value) => 
    changeClasses(el, value.map((cls) => `${templateId}${cls}`).concat(classes)),
};

export function cloneHTMLMarkup(markup) {
  const markupStr = isHTMLString(markup.trim())
    ? markup
    : document.querySelector(markup).innerHTML;
  return convertStringToHTML(markupStr);
}

function convertStringToHTML(markupString) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(markupString, "text/html");
  return parsedDocument.body.firstElementChild;
}
export function gatherBindings(componentHTML, templateId, dontRemove) {
  const bindings = {};

  walkNodes(componentHTML, (HTMLNode) => {
    const { name, el, classes, attrs, isComponent } = extractBinding(HTMLNode, templateId, dontRemove);
    if (name) {
      bindings[name] = { el, classes, attrs, isComponent, templateId };
    }
  });

  return bindings;
}

function extractBinding(el, templateId, dontRemove) {
  let binding = {};
  const attrs = {};
  const classes = []

  const attributes = el.getAttributeNames();
  for (const attr of attributes) {
    if (attr.startsWith(BINDING_SIGN.CLASS)) {
      (dontRemove && (attrs[attr] = true)) || el.removeAttribute(attr);
      handleClassBinding(
        el,
        templateId,
        attr.slice(BINDING_SIGN.CLASS.length),
        classes
      );
      continue;
    }

    if (attr.startsWith(BINDING_SIGN.BEHAVIOR)) {
      const name = attr.slice(BINDING_SIGN.BEHAVIOR.length);
      if (Object.values(UTIL_KEYS).includes(name)) {
        throwIllegalBindingNameError(name);
      }
      (dontRemove && (attrs[attr] = true)) || el.removeAttribute(attr);
      binding = { name, el };
      handleClassBinding(el, templateId, name, classes);
      continue;
    }

    if (attr.startsWith(BINDING_SIGN.COMPONENT)) {
      (dontRemove && (attrs[attr] = true)) || el.removeAttribute(attr);
      binding = { name: attr.slice(BINDING_SIGN.COMPONENT.length), el, isComponent: true };
      handleClassBinding(
        el,
        templateId,
        attr.slice(BINDING_SIGN.COMPONENT.length),
        classes,
      );
      continue;
    }

    attrs[attr] = el.getAttribute(attr);
  }

  return { ...binding, classes, attrs };
}

function handleClassBinding (el, templateId, classesString, classes) {
  const className = classesString
    .split(BINDING_SIGN.CLASS)
    .map((cls) => `${templateId}${cls}`);
  const cls = el.classList;

  cls.add.apply(cls, className);
  classes.push.apply(classes, className);
}

export function walkNodes(node, cb) {
  cb(node);

  Array.prototype.slice.call(node.children).forEach((el) => walkNodes(el, cb));
}

export function applyToMarkup(elData, type, value) {
  if (Object.keys(UTIL_KEYS).includes(type)) {
    return;
  }

  const markupAction = MARKUP_ACTIONS[type];
  if (markupAction) {
    markupAction(elData, value);
  }
}

function changeAttributes (el, newAttrs) {
  for (const name of el.getAttributeNames()) {
    if (!newAttrs[name]) {
      el.removeAttribute(name);
    }
  }
  Object.entries(newAttrs).forEach(([k, v]) => el.setAttribute(k, v));
}

function changeStyles (el, styles) {
  forEach(styles, (k, v) => {
    el.style[toDashCase(k)] = addEnding(v, "px", isNumber(v));
  });
}

function changeClasses (el, classes) {
  el.classList.value = classes.join(" ");
}

export function setupEventListener (el, type, cb, stateMutator) {
  const fn = (e) => cb(e, stateMutator);

  el.addEventListener(type, fn);
}