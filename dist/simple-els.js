(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SimpleEls"] = factory();
	else
		root["SimpleEls"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/combine.js"
/*!************************!*\
  !*** ./src/combine.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   combineState: () => (/* binding */ combineState),
/* harmony export */   combineTemplates: () => (/* binding */ combineTemplates)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./src/consts.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./src/state.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./html */ "./src/html.js");





function combineTemplates(combineCb, templateId) {
  const childrenState = {};
  const inject = injectTemplate.bind(null, childrenState, templateId);
  const markupStr = combineCb.call(null, inject);
  return [(0,_html__WEBPACK_IMPORTED_MODULE_3__.cloneHTMLMarkup)(markupStr), childrenState];
}

function injectTemplate (childrenState, templateId, ...args) {
  if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_2__.isString)(args[0])) {
    args.unshift(_consts__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_CONTAINER);
  }

  const [wrapper, template, value] = args;

  const [tag, classes] = getContainerOptions(wrapper, templateId);
  const [name, createComponent] = getTemplateOptions(template);
  const id = Object.keys(childrenState).length;
  const templateName = name || `${_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.CHILDREN}${id}`;
  const computeFn =
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.isFunction)(value) &&
    function (...args) {
      return normalizeValue(value.apply(null, args));
    };
  const dependencies = computeFn && (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.getParamNames)(value) || [];
  childrenState[`${templateName}`] = {
    createComponent,
    [_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.CHILDREN]: [],
    [_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.ON_CHANGE]: [],
    [_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.DEPENDANTS]: [],
    [_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.ON_CHANGE]: [],
    [_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.IS_RENDERED]: false,
    [_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.VALUE]: {
      value: !(0,_helpers__WEBPACK_IMPORTED_MODULE_2__.isFunction)(value) && normalizeValue(value),
      computeFn,
      dependencies,
    },
  };
  const classAttr = `class="${classes}"`;
  return `<${tag} ${classes ? classAttr : ""} ${_consts__WEBPACK_IMPORTED_MODULE_0__.BINDING_SIGN.COMPONENT}${templateName}></${tag}>`;
}

function combineState (state, childrenState) {
  Object.assign(state, childrenState);
  (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.forEach)(childrenState, (templateName, template) => {
    const { dependencies, computeFn, value } = template[_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.VALUE];
    dependencies.forEach((name) => state[name][_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.DEPENDANTS][templateName] = [_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.VALUE]);
    template[_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.VALUE].value = computeFn
      ? computeFn.apply(null, (0,_state__WEBPACK_IMPORTED_MODULE_1__.getArguments)(dependencies, state))
      : value;
  })
}

function getContainerOptions(str, classPrefix) {
  const segments = str.split(_consts__WEBPACK_IMPORTED_MODULE_0__.BINDING_SIGN.CLASS);
  return [
    segments[0] || _consts__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_CONTAINER,
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
  return (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.isArray)(value) ? (value[0] && !(0,_helpers__WEBPACK_IMPORTED_MODULE_2__.isArray)(value[0])) ? value.map((v) => [v]): value : [[value || {}]]
} 

/***/ },

/***/ "./src/consts.js"
/*!***********************!*\
  !*** ./src/consts.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BINDING_SIGN: () => (/* binding */ BINDING_SIGN),
/* harmony export */   CHILDREN_LIST_OPERATIONS: () => (/* binding */ CHILDREN_LIST_OPERATIONS),
/* harmony export */   COMPONENT_PREFIX: () => (/* binding */ COMPONENT_PREFIX),
/* harmony export */   DEFAULT_CONTAINER: () => (/* binding */ DEFAULT_CONTAINER),
/* harmony export */   DESTROY_OP: () => (/* binding */ DESTROY_OP),
/* harmony export */   EMPTY_FN: () => (/* binding */ EMPTY_FN),
/* harmony export */   NOT_BINDING_PREFIX: () => (/* binding */ NOT_BINDING_PREFIX),
/* harmony export */   REACTIVE_TYPES: () => (/* binding */ REACTIVE_TYPES),
/* harmony export */   STATE_BEHAVIOUR_DELIMITER: () => (/* binding */ STATE_BEHAVIOUR_DELIMITER),
/* harmony export */   UTIL_KEYS: () => (/* binding */ UTIL_KEYS)
/* harmony export */ });
const STATE_BEHAVIOUR_DELIMITER = "_";
const NOT_BINDING_PREFIX = " ";
const BINDING_SIGN = {
  BEHAVIOR: "@",
  CLASS: ".",
  COMPONENT: "&",
};
const UTIL_KEYS = {
  VALUE: STATE_BEHAVIOUR_DELIMITER,
  DEPENDENCIES: "dependencies",
  DEPENDANTS: "dependants",
  ON_CHANGE: "onChange",
  LISTENERS: "listeners",
  MARKUP: "el",
  EVENT_LISTENERS: "eventListeners",
  CHILDREN: "children",
  TEMPLATE: "template",
  IS_RENDERED: "isRendered",
  ON_MESSAGE: "onMessage",
  ON_MESSAGE_COMPONENT: NOT_BINDING_PREFIX + "onMessage",
  PARENT_STATE: NOT_BINDING_PREFIX + "parentState",
  ON_CHANGE_COMPONENT: NOT_BINDING_PREFIX + "onChange",
  CHILDREN_DATA: NOT_BINDING_PREFIX + "childrenData",
  MARKUP_COMPONENT: NOT_BINDING_PREFIX + "el",
  IS_RENDERED_COMPONENT: NOT_BINDING_PREFIX + "isRendered",
};

const COMPONENT_PREFIX = "component";
const DESTROY_OP = "destroy";

const REACTIVE_TYPES = [
  "html",
  "value",
  "style",
  "text",
  "attrs",
  "class",
  "onChange",
  UTIL_KEYS.VALUE,
];

const DEFAULT_CONTAINER = "div";

const EMPTY_FN = () => {};

const CHILDREN_LIST_OPERATIONS = [DESTROY_OP, "set", "insert", "push"];

/***/ },

/***/ "./src/error.js"
/*!**********************!*\
  !*** ./src/error.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   throwIllegalBindingNameError: () => (/* binding */ throwIllegalBindingNameError),
/* harmony export */   throwNoDefinedBehaviorError: () => (/* binding */ throwNoDefinedBehaviorError)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./src/consts.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");



function throwNoDefinedBehaviorError (name) {
  throwError(
    `Binding @${name} added to the markup, but its behavior is not defined.`,
  );
}

function throwIllegalBindingNameError (name) {
  throwError(
    `Binding @${name} can't be added in the markup, because this name is reserved by the library.\nOther reserved names: ${(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.map)(_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS, (_, v) => v)}`,
  );
}

function throwError (text) {
  throw new Error (text)
}

/***/ },

/***/ "./src/helpers.js"
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addEnding: () => (/* binding */ addEnding),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   filter: () => (/* binding */ filter),
/* harmony export */   forEach: () => (/* binding */ forEach),
/* harmony export */   get: () => (/* binding */ get),
/* harmony export */   getParamNames: () => (/* binding */ getParamNames),
/* harmony export */   isArray: () => (/* binding */ isArray),
/* harmony export */   isDOMElement: () => (/* binding */ isDOMElement),
/* harmony export */   isFunction: () => (/* binding */ isFunction),
/* harmony export */   isHTMLString: () => (/* binding */ isHTMLString),
/* harmony export */   isNumber: () => (/* binding */ isNumber),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isString: () => (/* binding */ isString),
/* harmony export */   isUndefined: () => (/* binding */ isUndefined),
/* harmony export */   map: () => (/* binding */ map),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   toDashCase: () => (/* binding */ toDashCase),
/* harmony export */   uid: () => (/* binding */ uid)
/* harmony export */ });
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;

function isHTMLString(obj) {
  return isString(obj) && obj.indexOf("<") === 0;
}

function isString(obj) {
  return getObjectType(obj) === "[object String]";
}

function isFunction(obj) {
  return getObjectType(obj) === "[object Function]";
}

function isObject(obj) {
  return getObjectType(obj) === "[object Object]";
}

function getObjectType(obj) {
  return Object.prototype.toString.call(obj);
}

function getParamNames(fn) {
  const fnStr = fn.toString().replace(STRIP_COMMENTS, "").split("=>")[0];

  const names = fnStr
    .slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
    .match(ARGUMENT_NAMES);

  if (names === null) {
    return [];
  }

  return names;
}

function map(obj, cb) {
  const res = Object.entries(obj).map(([k, v]) => cb(k, v));
  if (res[0]?.length === 2) {
    return Object.fromEntries(res);
  }

  return res;
}

function toDashCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function addEnding(str, ending, condition) {
  return `${str}${(condition && ending) || ""}`;
}

function isNumber(obj) {
  return getObjectType(obj) === "[object Number]" && obj === obj;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (copy);

function copy(destination, source) {
  if (!destination) {
    return copy({}, source);
  }

  for (let key in source) {
    if (isUndefined(source[key])) {
      continue;
    }

    if (source.hasOwnProperty(key) && isObject(source[key])) {
      if (!destination[key]) {
        destination[key] = {};
      }
      copy(destination[key], source[key]);
      continue;
    }

    if (isArray(source[key])) {
      if (!destination[key]) {
        destination[key] = [];
      }
      copyArray(destination[key], source[key]);
      continue;
    }

    if (isDOMElement(source[key])) {
      destination[key] = source[key].cloneNode(true);
      continue;
    }

    destination[key] = source[key];
  }

  return destination;
}

function copyArray(destination, source) {
  for (let i = 0; i < source.length; i++) {
    if (isObject(source[i])) {
      destination[i] = destination[i] || {};
      copy(destination[i], source[i]);
      continue;
    }

    if (isArray(source[i])) {
      destination[i] = destination[i] || [];
      copyArray(destination[i], source[i]);
      continue;
    }

    destination[i] = source[i];
  }

  return destination;
}

function isDOMElement(obj) {
  return obj && typeof obj.tagName !== "undefined";
}

function isUndefined(obj) {
  return typeof obj === "undefined";
}

function isArray(obj) {
  return getObjectType(obj) === "[object Array]";
}

function forEach(obj, cb) {
  Object.entries(obj).forEach(([k, v]) => cb(k, v));
}

function set(obj, path, value) {
  if (!path.length) {
    if (isObject(value)) {
      return Object.assign(obj, value);
    }
    return (obj = value);
  }

  let dest = obj;
  for (var i = 0; i < path.length - 1; i++) {
    if (!dest[path[i]]) {
      dest = dest[path[i]] = {};
    } else {
      dest = dest[path[i]];
    }
  }

  if (isObject(value)) {
    dest[path[i]] = dest[path[i]] || {};
    Object.assign(dest[path[i]], value);
  } else {
    dest[path[i]] = value;
  }

  return obj;
}

function filter(obj, cb) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => cb(k, v) === true),
  );
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function get(obj, path, def) {
  let value = obj;
  for (let i = 0; i < path.length; i++) {
    value = value[path[i]];
  }

  return !isUndefined(value) && value || def;
}


/***/ },

/***/ "./src/html.js"
/*!*********************!*\
  !*** ./src/html.js ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MARKUP_ACTIONS: () => (/* binding */ MARKUP_ACTIONS),
/* harmony export */   applyToMarkup: () => (/* binding */ applyToMarkup),
/* harmony export */   cloneHTMLMarkup: () => (/* binding */ cloneHTMLMarkup),
/* harmony export */   gatherBindings: () => (/* binding */ gatherBindings),
/* harmony export */   setupEventListener: () => (/* binding */ setupEventListener),
/* harmony export */   walkNodes: () => (/* binding */ walkNodes)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consts */ "./src/consts.js");
/* harmony import */ var _error__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./error */ "./src/error.js");




const MARKUP_ACTIONS = {
  value: ({ el }, value) => (el.value = value),
  text: ({ el }, value) => (el.textContent = value),
  html: ({ el }, value) => (el.innerHTML = value),
  attrs: ({ el, attrs }, value) => changeAttributes(el, { ...attrs, ...value, class: el.className}),
  style: ({ el }, value) => changeStyles(el, value),
  class: ({ el, classes, templateId }, value) => 
    changeClasses(el, value.map((cls) => `${templateId}${cls}`).concat(classes)),
};

function cloneHTMLMarkup(markup) {
  const markupStr = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isHTMLString)(markup.trim())
    ? markup
    : document.querySelector(markup).innerHTML;
  return convertStringToHTML(markupStr);
}

function convertStringToHTML(markupString) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(markupString, "text/html");
  return parsedDocument.body.firstElementChild;
}
function gatherBindings(componentHTML, templateId, dontRemove) {
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
    if (attr.startsWith(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.CLASS)) {
      (dontRemove && (attrs[attr] = true)) || el.removeAttribute(attr);
      handleClassBinding(
        el,
        templateId,
        attr.slice(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.CLASS.length),
        classes
      );
      continue;
    }

    if (attr.startsWith(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.BEHAVIOR)) {
      const name = attr.slice(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.BEHAVIOR.length);
      if (Object.values(_consts__WEBPACK_IMPORTED_MODULE_1__.UTIL_KEYS).includes(name)) {
        (0,_error__WEBPACK_IMPORTED_MODULE_2__.throwIllegalBindingNameError)(name);
      }
      (dontRemove && (attrs[attr] = true)) || el.removeAttribute(attr);
      binding = { name, el };
      handleClassBinding(el, templateId, name, classes);
      continue;
    }

    if (attr.startsWith(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.COMPONENT)) {
      (dontRemove && (attrs[attr] = true)) || el.removeAttribute(attr);
      binding = { name: attr.slice(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.COMPONENT.length), el, isComponent: true };
      handleClassBinding(
        el,
        templateId,
        attr.slice(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.COMPONENT.length),
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
    .split(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.CLASS)
    .map((cls) => `${templateId}${cls}`);
  const cls = el.classList;

  cls.add.apply(cls, className);
  classes.push.apply(classes, className);
}

function walkNodes(node, cb) {
  cb(node);

  Array.prototype.slice.call(node.children).forEach((el) => walkNodes(el, cb));
}

function applyToMarkup(elData, type, value) {
  if (Object.keys(_consts__WEBPACK_IMPORTED_MODULE_1__.UTIL_KEYS).includes(type)) {
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
  (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.forEach)(styles, (k, v) => {
    el.style[(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.toDashCase)(k)] = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.addEnding)(v, "px", (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isNumber)(v));
  });
}

function changeClasses (el, classes) {
  el.classList.value = classes.join(" ");
}

function setupEventListener (el, type, cb, stateMutator) {
  const fn = (e) => cb(e, stateMutator);

  el.addEventListener(type, fn);
}

/***/ },

/***/ "./src/popup.js"
/*!**********************!*\
  !*** ./src/popup.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addPopupLogic: () => (/* binding */ addPopupLogic)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./src/consts.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles */ "./src/styles.js");




const AXIS = {
  left: "X",
  top: "Y",
};

const DIRECTIONS = ["left", "top", "bottom", "right"];

function addPopupLogic (markup, options) {
  const { handle, closeButton, id } = options;

  closeButton && markup.parentNode
    .querySelector((0,_styles__WEBPACK_IMPORTED_MODULE_2__.addClassPrefix)(closeButton, id))
    ?.addEventListener("click", () => markup.parentNode.removeChild(markup));
  handle && markup.parentNode
    .querySelector((0,_styles__WEBPACK_IMPORTED_MODULE_2__.addClassPrefix)(handle, id))
    ?.addEventListener("mousedown", (e) => {
      const el = e.target;
      const shiftX = e.clientX - markup.getBoundingClientRect().left;
      const shiftY = e.clientY - markup.getBoundingClientRect().top;

      function onMouseMove(e) {
        requestAnimationFrame(() => {
          markup.style.left = e.clientX - shiftX + "px";
          markup.style.top = e.clientY - shiftY + "px";
          markup.style.transform = "none";
        });
      }

      function onMouseUp(e) {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        el.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mouseup", onMouseUp);
      el.addEventListener("mouseup", onMouseUp);

      document.addEventListener("mousemove", onMouseMove);
    });

  positionPopup(markup, options);
}

function positionPopup (markup, options) {
  const { left, top, bottom, right } = options;
  markup.style.position = "fixed";
  const { width, height } = markup.getBoundingClientRect();
  

  if (!left && !right) {
    options.left = "center";
  }

  if (!top && !bottom) {
    options.top = "center";
  }

  if (right && !left) {
    delete options.right;
    options.left = document.body.clientWidth - width - right;
  }

  if (bottom && !top) {
    delete options.bottom;
    options.top = window.innerHeight - height - bottom;
  }

  const style = [];
  (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(options, (dir, dist) => {
    if (DIRECTIONS.includes(dir)) {
      if (dist === "center") {
        return style.push(`${dir}: 50%`, `transform: translate${AXIS[dir]}(-50%)`);
      }
      style.push(`${dir}: ${(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.addEnding)(dist, 'px', (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.isNumber)(dist))}`);
    }
  });

  options.left === "center" &&
    options.top === "center" &&
    style.push("transform: translate(-50%, -50%)");

  markup.style = `${markup.style.cssText}; ${style.join(";")}`;
}

/***/ },

/***/ "./src/state.js"
/*!**********************!*\
  !*** ./src/state.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createStateApi: () => (/* binding */ createStateApi),
/* harmony export */   getArguments: () => (/* binding */ getArguments),
/* harmony export */   getStateBindings: () => (/* binding */ getStateBindings),
/* harmony export */   prepareStateSettings: () => (/* binding */ prepareStateSettings),
/* harmony export */   setupComponentMarkup: () => (/* binding */ setupComponentMarkup),
/* harmony export */   updateTemplateMarkup: () => (/* binding */ updateTemplateMarkup)
/* harmony export */ });
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./html */ "./src/html.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./consts */ "./src/consts.js");
/* harmony import */ var _error__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./error */ "./src/error.js");





function prepareStateSettings (stateBehaviour) {
  const state = {
    [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_MESSAGE_COMPONENT]: stateBehaviour[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_MESSAGE] || _consts__WEBPACK_IMPORTED_MODULE_2__.EMPTY_FN,
    [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_CHANGE_COMPONENT]: stateBehaviour[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_CHANGE] || _consts__WEBPACK_IMPORTED_MODULE_2__.EMPTY_FN,
  };
  (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.map)(_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS, (_, v) => v).forEach((v) => delete stateBehaviour[v]);

  (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(stateBehaviour, (stateKey, userValue) => {
    const [name, type] = splitStateKey(stateKey);

    if (!state[name]) {
      state[name] = {
        [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE]: {},
        [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.DEPENDANTS]: {},
        [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_CHANGE]: [],
      };
    }

    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_1__.isObject)(userValue)) {
      return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(userValue, (type, value) => {
        state[name][type] = prepareValue(name, type, value, state);
      });
    }

    state[name][type] = prepareValue(name, type, userValue, state);
  });

  return state;
}

function splitStateKey(key) {
  const segments = key.split(_consts__WEBPACK_IMPORTED_MODULE_2__.STATE_BEHAVIOUR_DELIMITER);
  if (segments.length === 1) {
    return [segments[0], _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE];
  }

  const name = segments.slice(0, -1).join(_consts__WEBPACK_IMPORTED_MODULE_2__.STATE_BEHAVIOUR_DELIMITER);
  const type = segments.slice(-1)[0];

  return [name, type];
}

function updateTemplateMarkup(markupPointers, state) {
  (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(markupPointers, (name, elData) => {
    if (!state[name]) {
      (0,_error__WEBPACK_IMPORTED_MODULE_3__.throwNoDefinedBehaviorError)(name);
    }
    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(state[name], (type, value) =>
      (0,_html__WEBPACK_IMPORTED_MODULE_0__.applyToMarkup)(elData, type, value?.value),
    );
  });
}

function setupComponentMarkup(markupPointers, state, args) {
  (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(markupPointers, (name, elData) => state[name].el = elData);

  setValues(state, args);

  (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(
    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.filter)(state, (k) => !k.startsWith(_consts__WEBPACK_IMPORTED_MODULE_2__.NOT_BINDING_PREFIX)),
    (name, binding) => {
      const { el, [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.IS_RENDERED]: isRendered, [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE]: { value } } = binding;

      if (binding.createComponent) {
        if (!isRendered) {
          const childrenApi = createChildrenApi(binding);
          const diffs = getChildrenDifference(value, []);
          for (let operation of _consts__WEBPACK_IMPORTED_MODULE_2__.CHILDREN_LIST_OPERATIONS) {
            diffs[operation].forEach((val) =>
              childrenApi[operation].apply(null, val),
            );
          }
        }

        binding[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.PARENT_STATE] = state;
        return;
      }

      const eventListeners = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.filter)(binding, (type, value) => isEventListener(type, value.value));
      (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(eventListeners, (event, cb) => (0,_html__WEBPACK_IMPORTED_MODULE_0__.setupEventListener)(el.el, event, cb.value, createStateApi(state)));
  });

  return createStateApi(state);
}

function prepareValue(name, type, value, state) {
  if (type === _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_CHANGE) {
    return [value];
  }

  const isReactive = isReactiveFunction(type, value);
  const dependencies = isReactive && (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.getParamNames)(value);

  if (dependencies) {
    dependencies.forEach((dependency) => {
      if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.get)(state, [dependency, _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.DEPENDANTS, name])) {
        (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.set)(state, [dependency, _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.DEPENDANTS, name], []);
      }
      state[dependency][_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.DEPENDANTS][name].push(type);
    });
  }

  return {
    value: isReactive ? value(...getArguments(dependencies, state)) : value,
    computeFn: isReactive && value,
    dependencies,
  };
}

function isReactiveFunction(type, value) {
  return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value) && _consts__WEBPACK_IMPORTED_MODULE_2__.REACTIVE_TYPES.includes(type);
}

function isEventListener (type, value) {
  return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value) && !_consts__WEBPACK_IMPORTED_MODULE_2__.REACTIVE_TYPES.includes(type);
}

function getArguments(names, state) {
  const values = getValues(state);
  return names.map((name) => values[name]);
}

function getValues(state) {
  return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.map)(
    getStateBindings(state),
    (k, v) => [k, v[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE]?.value],
  );
}

function setValues(state, changes) {
  const realChanges = {};

  for (let [k, v] of Object.entries(changes)) {
    setValue(k, v, state, realChanges, changes);
  }

  if (Object.keys(realChanges).length) {
    updateComponentAfterChange(state, realChanges);
  }
}

function setValue(key, value, state, realChanges, changes) {
  const prevValue = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.get)(state, [key, _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE, 'value']);

  if (prevValue !== value) {
    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.set)(state, [key, _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE, 'value'], value);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.set)(realChanges, [key, _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE], { newValue: value, prevValue });

    updateDependencies(key, state, realChanges, changes);
  }
}

function updateDependencies(key, state, realChanges, changes) {
  const dependants = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.get)(state, [key, _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.DEPENDANTS], {});

  for (let [dependant, types] of Object.entries(dependants)) {
    types.forEach((type) => {
      const { computeFn, dependencies } = state[dependant][type];
      const realChangesKeys = Object.keys(realChanges);
      const changesKeys = Object.keys(changes);
      if (!dependencies.every((name) =>
        changesKeys.includes(name) && realChangesKeys.includes(name) || !changesKeys.includes(name)
      )) {
        return;
      }

      const prevValue = state[dependant][type].value;
      const newValue = computeFn(...getArguments(dependencies, state));

      if (prevValue !== newValue) {
        state[dependant][type].value = newValue;
        (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.set)(realChanges, [dependant, type], { newValue, prevValue });

        if (type === _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE) {
          updateDependencies(dependant, state, realChanges);
        }
      }
    })
  }
}

function updateComponentAfterChange (state, realChanges) {
  const {
    [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_CHANGE_COMPONENT]: onChange,
    [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.MARKUP_COMPONENT]: markup,
    [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.IS_RENDERED_COMPONENT]: isComponentRendered,
  } = state;

  (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(realChanges, (name, change) => {
    const binding = state[name];
    const { [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.MARKUP]: el, [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_CHANGE]: listeners, [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.CHILDREN]: children } = binding;

    if (children) {
      const { newValue, prevValue } = change[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE];
      const childrenApi = createChildrenApi(binding);
      const diffs = getChildrenDifference(newValue, prevValue);

      for (let operation of _consts__WEBPACK_IMPORTED_MODULE_2__.CHILDREN_LIST_OPERATIONS) {
        const values = diffs[operation];
        values.forEach((val) => {
          if (operation === _consts__WEBPACK_IMPORTED_MODULE_2__.DESTROY_OP && children.length) {
            const childState = children[val[0]].state;
            const childStateApi = createStateApi(childState);
            (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(getStateBindings(childState), (name, { [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_CHANGE]: listeners, el }) =>
              listeners.forEach((cb) => cb(false, childStateApi, el?.el)),
            );
            childState[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_CHANGE_COMPONENT](
              false,
              childStateApi,
              childState[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.MARKUP_COMPONENT],
            );
          }
          childrenApi[operation].apply(null, val);
        });
      }
      binding[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.IS_RENDERED] = true;
      return;
    }

    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(change, (type, value) => {
      (0,_html__WEBPACK_IMPORTED_MODULE_0__.applyToMarkup)(el, type, value.newValue);
      if (isComponentRendered && type === _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE) {
        listeners.forEach((cb) => cb([name], createStateApi(state), el?.el));
      }
    });
  });
  isComponentRendered && onChange(
    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.map)(
      (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.filter)(realChanges, (k, v) => !!v[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE] && !state[k][_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.CHILDREN]),
      (k) => k,
    ),
    createStateApi(state),
    markup,
  );
}

function addStateListener (state, keys, cb) {
  keys.forEach((key) => state[key][_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_CHANGE].push(cb));
}

function removeStateListener (state, keys, removeCb) {
  keys.forEach((key) => {
    const listeners = state[key][_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_CHANGE];
    const removeIdx = listeners.findIndex((cb) => cb === removeCb);
    listeners.splice(removeIdx, 1);
  });
}

function sendMessage (state, data) {
  let parent = state[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.PARENT_STATE];
  const childrenData = state[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.CHILDREN_DATA];
  const index = childrenData.children.findIndex((api) => api.state === state);
  const stop = () => parent = {};

  while (parent) {
    parent[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_MESSAGE_COMPONENT](
      data,
      {
        stop,
        ...createStateApi(parent),
      },
      {
        index,
        ...createChildrenApi(childrenData, true),
      },
    );

    parent = parent[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.PARENT_STATE];
  }
}

function createStateApi (state) {
  const el = state[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.MARKUP_COMPONENT];

  return {
    get: getValues.bind(null, state),
    set: setValues.bind(null, state),
    children: getStateChildren.bind(null, state),
    send: sendMessage.bind(null, state),
    onChange: addStateListener.bind(null, state),
    removeListener: removeStateListener.bind(null, state),
    [_consts__WEBPACK_IMPORTED_MODULE_2__.DESTROY_OP]: () => el.parentNode.removeChild(el),
    state,
  }
}

function getStateBindings (state) {
  return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.filter)(
    state,
    (k, v) => !!v?.[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE] && !v?.[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.CHILDREN],
  );
}

function createChildrenApi (childrenBinding, isManualUse) {
  const { el, createComponent, [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.PARENT_STATE]: parentState, [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.CHILDREN]: children, [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE]: value } = childrenBinding;

  const create = (value, nextNode) =>
    createComponent(value, el.el, {
      isNoShadow: true,
      nextNode,
      [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.CHILDREN_DATA]: childrenBinding,
      [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.PARENT_STATE]: parentState,
    });

  return {
    [_consts__WEBPACK_IMPORTED_MODULE_2__.DESTROY_OP]: (idx) => {
      children[idx][_consts__WEBPACK_IMPORTED_MODULE_2__.DESTROY_OP]();
      children.splice(idx, 1);
      if (isManualUse) {
        value.value.splice(idx, 1);
      }
    },
    push: (value) => {
      children.push(create(value));
      if (isManualUse) {
        value.value.push(value);
      }
    },
    insert: (value, idx = 0) => {
      const nextNode = children[idx].state[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.MARKUP_COMPONENT];
      children.splice(idx, 0, create(value, nextNode));
      if (isManualUse) {
        value.value.splice(idx, 0, value);
      }
    },
    set: (values, idx) => {
      if (idx || idx === 0) {
        return children[idx].set(values);
      }
    },
    get: (idx) => {
      if (idx || idx === 0) {
        return children[idx].get();
      }

      return children.map(({ get }) => get());
    },
    forEach: (cb) => children.forEach(cb),
  };
}

function getStateChildren (state, name) {
  return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.map)((0,_helpers__WEBPACK_IMPORTED_MODULE_1__.filter)(state, (k, v) => !!v?.[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.CHILDREN]), (k, v) => [k, createChildrenApi(v)]);
}

function getChildrenDifference (news, prevs) {
  const destroy = [];
  const set = [];
  const insert = [];
  const push = [];
  const newsInPrevs = {};
  const foundSameUids = {};

  let removeCount = 0;
  prevs.forEach(([prev, uid], i) => {
    const prevFoundIndex = foundSameUids[uid] >= 0 ? foundSameUids[uid] + 1 : 0;
    const newIndex = news.slice(prevFoundIndex).findIndex(([neww, newUid]) => newUid === uid);
    const newPos = i - removeCount;
    if (newIndex === -1) {
      destroy.push([newPos]);
      removeCount++;
    } else {
      foundSameUids[uid] = prevFoundIndex + newIndex;
      set.push([news[foundSameUids[uid]][0], newPos]);
      newsInPrevs[foundSameUids[uid]] = newPos;
    }
  });

  let newCount = 0;
  let nextPos = 0;
  news.forEach(([neww], i) => {
    const newPos = newsInPrevs[i];

    if (newPos >= 0) {
      nextPos = newPos + 1 + newCount;
    } else if (nextPos >= prevs.length + newCount) {
      push.push([neww]);
    } else {
      insert.push([neww, nextPos]);
      nextPos++;
      newCount++;
    }
  });

  return { [_consts__WEBPACK_IMPORTED_MODULE_2__.DESTROY_OP]: destroy, set, insert, push };
}

/***/ },

/***/ "./src/styles.js"
/*!***********************!*\
  !*** ./src/styles.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addClassPrefix: () => (/* binding */ addClassPrefix),
/* harmony export */   prepareStyles: () => (/* binding */ prepareStyles)
/* harmony export */ });
function prepareStyles(prefix, styleStr) {
  const style = new CSSStyleSheet();
  style.replaceSync(styleStr);
  for (let i = 0; i, i < style.rules.length; i++) {
    const { selectorText } = style.rules[i];
    style.rules[i].selectorText = addClassPrefix(selectorText, prefix);
  }
  return [style]; 
}

function addClassPrefix (str, prefix) {
  return str.replaceAll(".", `.${prefix}`);
}

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   append: () => (/* binding */ append),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ "./src/state.js");
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./html */ "./src/html.js");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles */ "./src/styles.js");
/* harmony import */ var _popup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./popup */ "./src/popup.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
/* harmony import */ var _combine__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./combine */ "./src/combine.js");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./consts */ "./src/consts.js");









function createTemplate (markupStr, stateBehaviour, styleSheets) {
  const id = (0,_helpers__WEBPACK_IMPORTED_MODULE_4__.uid)();
  const [markup, childrenState] = (0,_helpers__WEBPACK_IMPORTED_MODULE_4__.isFunction)(markupStr)
    ? (0,_combine__WEBPACK_IMPORTED_MODULE_5__.combineTemplates)(markupStr, id)
    : [(0,_html__WEBPACK_IMPORTED_MODULE_1__.cloneHTMLMarkup)(markupStr), {}];

  const [state, styles] = (0,_helpers__WEBPACK_IMPORTED_MODULE_4__.isObject)(stateBehaviour)
    ? [(0,_state__WEBPACK_IMPORTED_MODULE_0__.prepareStateSettings)(stateBehaviour), (0,_styles__WEBPACK_IMPORTED_MODULE_2__.prepareStyles)(id, styleSheets)]
    : [{}, (0,_styles__WEBPACK_IMPORTED_MODULE_2__.prepareStyles)(id, stateBehaviour)];

  (0,_combine__WEBPACK_IMPORTED_MODULE_5__.combineState)(state, childrenState);

  const boundElements = (0,_html__WEBPACK_IMPORTED_MODULE_1__.gatherBindings)(markup, id, true);
  (0,_state__WEBPACK_IMPORTED_MODULE_0__.updateTemplateMarkup)(boundElements, state);

  const allStyles = (0,_helpers__WEBPACK_IMPORTED_MODULE_4__.map)(childrenState, (_, v) => v)
    .map((v) => v.createComponent.styles)
    .reduce((a, v) => a.concat(v), [])
    .concat(styles);

  const template = { id, markup, state, styles: allStyles };

  return Object.assign((...args) => createComponent(template, ...args), {
    ...template,
    asPopup: (options) => createComponent(template, {}, document.body, { ...options, isPopup: true })
  });
}

function createComponent (template, ...args) {
  (0,_helpers__WEBPACK_IMPORTED_MODULE_4__.isDOMElement)(args[0]) && args.unshift({})
  const [stateValues, target, options] = args;

  const markup = template.markup.cloneNode(true);
  const state = (0,_helpers__WEBPACK_IMPORTED_MODULE_4__.copy)({}, template.state);
  state[_consts__WEBPACK_IMPORTED_MODULE_6__.UTIL_KEYS.PARENT_STATE] = options?.[_consts__WEBPACK_IMPORTED_MODULE_6__.UTIL_KEYS.PARENT_STATE];
  state[_consts__WEBPACK_IMPORTED_MODULE_6__.UTIL_KEYS.CHILDREN_DATA] = options?.[_consts__WEBPACK_IMPORTED_MODULE_6__.UTIL_KEYS.CHILDREN_DATA];
  state[_consts__WEBPACK_IMPORTED_MODULE_6__.UTIL_KEYS.MARKUP_COMPONENT] = markup;

  const boundElements = (0,_html__WEBPACK_IMPORTED_MODULE_1__.gatherBindings)(markup, template.id);
  const api = state && (0,_state__WEBPACK_IMPORTED_MODULE_0__.setupComponentMarkup)(boundElements, state, stateValues);

  const component = { api, ...template, markup, state };

  if (target) {
    return append(target, component, options);
  }

  return Object.assign((target, options) => append(target, component, options), {
    asPopup: (options) =>
      append(document.body, component, { ...options, isPopup: true }),
  });
}

function append (target, component, options = {}) {
  const { markup, styles, api, id, state } = component;
  const { isNoShadow, nextNode, isPopup } = options;

  let el;

  if (isNoShadow) {
    el = markup;
  } else {
    el = document.createElement("div");
    const host = el.attachShadow({ mode: "open" });
    host.adoptedStyleSheets = styles;
    host.appendChild(markup);
  }

  if (nextNode) {
    target.insertBefore(el, nextNode)
  } else {
    target.appendChild(el);
  }

  if (isPopup) {
    (0,_popup__WEBPACK_IMPORTED_MODULE_3__.addPopupLogic)(markup, { ...options, id });
  }

  const bindings = (0,_state__WEBPACK_IMPORTED_MODULE_0__.getStateBindings)(state);
  const componentApi = (0,_state__WEBPACK_IMPORTED_MODULE_0__.createStateApi)(state);
  (0,_helpers__WEBPACK_IMPORTED_MODULE_4__.forEach)(bindings, (name, { [_consts__WEBPACK_IMPORTED_MODULE_6__.UTIL_KEYS.ON_CHANGE]: listeners, el }) =>
    listeners.forEach((cb) => cb(true, componentApi, el?.el)),
  );
  state[_consts__WEBPACK_IMPORTED_MODULE_6__.UTIL_KEYS.ON_CHANGE_COMPONENT](true, componentApi, markup);
  state[_consts__WEBPACK_IMPORTED_MODULE_6__.UTIL_KEYS.IS_RENDERED_COMPONENT] = true;

  return componentApi;
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createTemplate);
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});