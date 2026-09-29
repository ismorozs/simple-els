import {
  forEach,
  isHTMLString,
  toDashCase,
  addEnding,
  isNumber,
} from "./helpers";
import { BINDING_SIGN, UTIL_KEYS, FORM_TAGS } from "./consts";
import { addPopupLogic } from "./popup";
import { throwIllegalBindingNameError } from "./error";

export const MARKUP_ACTIONS = {
  [UTIL_KEYS.VALUE]: ({ el, isFastApply }: IMarkupPointer, value: string) =>
    isFastApply && fastApply(el as HTMLElement, value),
  value: ({ el }: IMarkupPointer, value: string) =>
    ((el as HTMLInputElement).value = value),
  text: ({ el }: IMarkupPointer, value: string) => (el.textContent = value),
  html: ({ el }: IMarkupPointer, value: string) =>
    ((el as HTMLElement).innerHTML = value),
  attrs: ({ el, attrs }: IMarkupPointer, value: Record<string, string>) =>
    changeAttributes(el as HTMLElement, {
      ...attrs,
      ...value,
      class: (el as HTMLElement).className,
    }),
  style: ({ el }: IMarkupPointer, value: Record<string, string>) =>
    changeStyles(el as HTMLElement, value),
  class: ({ el, classes, templateId }: IMarkupPointer, value: string[]) =>
    changeClasses(
      el as HTMLElement,
      value.map((cls) => `${templateId}${cls}`).concat(classes as string[]),
    ),
};

export function cloneHTMLMarkup(markup: string) {
  const markupStr = isHTMLString(markup.trim())
    ? markup
    : document.querySelector(markup)?.innerHTML;
  return convertStringToHTML(markupStr as string);
}

function convertStringToHTML(markupString: string) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(markupString, "text/html");
  return parsedDocument.body.firstElementChild;
}
export function gatherBindings(
  componentHTML: Element,
  templateId: string,
  dontRemove?: boolean,
) {
  const bindings: IMarkupPointers = {};

  walkNodes(componentHTML, (HTMLNode: Element) => {
    const { name, el, classes, attrs, isComponent, placeholder } =
      extractBinding(HTMLNode, templateId, dontRemove);
    if (name) {
      bindings[name] = {
        el,
        classes,
        attrs,
        isComponent,
        placeholder,
        templateId,
      };
    }
  });

  return bindings;
}

function extractBinding(
  el: Element,
  templateId: string,
  dontRemove?: boolean,
): IMarkupPointer {
  let binding = {};
  const attrs: Record<string, string | boolean | null> = {};
  const classes: string[] = [];

  const attributes = el.getAttributeNames();
  for (const attr of attributes) {
    if (attr.startsWith(BINDING_SIGN.CLASS)) {
      (dontRemove && (attrs[attr] = true)) || el.removeAttribute(attr);
      handleClassBinding(
        el,
        templateId,
        attr.slice(BINDING_SIGN.CLASS.length),
        classes,
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
      binding = {
        name: attr.slice(BINDING_SIGN.COMPONENT.length),
        el,
        placeholder: el,
        isComponent: true,
      };
      continue;
    }

    attrs[attr] = el.getAttribute(attr);
  }

  return { ...binding, classes, attrs } as IMarkupPointer;
}

function handleClassBinding(
  el: Element,
  templateId: string,
  classesString: string,
  classes: string[],
) {
  const className = classesString
    .split(BINDING_SIGN.CLASS)
    .map((cls) => `${templateId}${cls}`);
  const cls = el.classList;

  cls.add.apply(cls, className);
  classes.push.apply(classes, className);
}

export function walkNodes(node: Element, cb: (node: Element) => void) {
  cb(node);

  Array.prototype.slice.call(node.children).forEach((el) => walkNodes(el, cb));
}

export function applyToMarkup(
  elData: IMarkupPointer,
  type: string,
  value: any,
) {
  elData && MARKUP_ACTIONS[type] && MARKUP_ACTIONS[type](elData, value);
}

function changeAttributes(el: Element, newAttrs: Record<string, string>) {
  for (const name of el.getAttributeNames()) {
    if (!newAttrs[name]) {
      el.removeAttribute(name);
    }
  }
  Object.entries(newAttrs).forEach(([k, v]) => el.setAttribute(k, v));
}

function changeStyles(el: HTMLElement, styles: Record<string, string>) {
  forEach(styles, (k, v) => {
    el.style.setProperty(toDashCase(k), addEnding(v, "px", isNumber(v)));
  });
}

function changeClasses(el: HTMLElement, classes: string[]) {
  el.classList.value = classes.join(" ");
}

export function setupEventListener(
  el: HTMLElement,
  type: string,
  cb: (e: Event, state: IStateAPI) => void,
  stateMutator: IStateAPI,
) {
  const fn = (e: Event) => cb(e, stateMutator);

  el.addEventListener(type, fn);
}

export function removeChildMarkup(state: IState, idx: number) {
  const { children, el } = state.parentBinding as IBinding;
  const markup = state.el;

  if (children.length === 1 && el) {
    markup?.parentNode?.replaceChild(el.placeholder as Node, markup);
    el.el = el.placeholder as Node;
    return;
  }

  if (idx === 0) {
    el.el = markup?.nextSibling as Node;
  }

  markup?.parentNode?.removeChild(markup);
}

export function addChildMarkup(
  parentNode: Element,
  component: IComponentWithState,
  options: IComponentCreateOptions,
) {
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
    addPopupLogic(markup as HTMLElement, { ...options, id });
  }
}

function fastApply(el: HTMLElement | HTMLInputElement, value = "") {
  if (FORM_TAGS.includes(el.tagName)) {
    (el as HTMLInputElement).value = value;
  } else {
    el.textContent = value;
  }
}
