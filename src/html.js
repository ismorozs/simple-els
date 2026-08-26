import { forEach, isHTMLString, toDashCase, addEnding, isNumber } from "./helpers";
import { BINDING_SIGN, UTIL_KEYS } from "./consts";
import { addPopupLogic } from "./popup";
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
    const { name, el, classes, attrs, isComponent, placeholder } = extractBinding(HTMLNode, templateId, dontRemove);
    if (name) {
      bindings[name] = { el, classes, attrs, isComponent, placeholder, templateId };
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
      binding = { name: attr.slice(BINDING_SIGN.COMPONENT.length), el, placeholder: el, isComponent: true };
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
  MARKUP_ACTIONS[type] && MARKUP_ACTIONS[type](elData, value);
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

export function removeChildMarkup (state, idx) {
  const { children, [UTIL_KEYS.MARKUP]: el } = state[UTIL_KEYS.CHILDREN_DATA];
  const markup = state[UTIL_KEYS.MARKUP_COMPONENT];
  
  if (children.length === 1) {
    markup.parentNode.replaceChild(el.placeholder, markup);
    el.el = el.placeholder;
    return;
  }

  if (idx === 0) {
    el.el = markup.nextSibling;
  }

  markup.parentNode.removeChild(markup); 
}

export function addChildMarkup(parentNode, component, options) {
  const { markup, styles, id } = component;
  const { isNoShadow, nextNode, placeholder, isPopup } = options;

  let el;

  if (isNoShadow) {
    el = markup;
  } else {
    el = document.createElement("div");
    const host = el.attachShadow({ mode: "open" });
    host.adoptedStyleSheets = styles;
    host.appendChild(markup);
  }

  if (placeholder) {
    parentNode.replaceChild(el, placeholder);
  } else if (nextNode) {
    parentNode.insertBefore(el, nextNode);
  } else {
    parentNode.appendChild(el);
  }

  if (isPopup) {
    addPopupLogic(markup, { ...options, id });
  }
}