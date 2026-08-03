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

/***/ "./src/consts.js"
/*!***********************!*\
  !*** ./src/consts.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BINDING_SIGN: () => (/* binding */ BINDING_SIGN),
/* harmony export */   REACTIVE_TYPES: () => (/* binding */ REACTIVE_TYPES),
/* harmony export */   STATE_BEHAVIOUR_DELIMITER: () => (/* binding */ STATE_BEHAVIOUR_DELIMITER),
/* harmony export */   UTIL_KEYS: () => (/* binding */ UTIL_KEYS)
/* harmony export */ });
const STATE_BEHAVIOUR_DELIMITER = "_";
const BINDING_SIGN = {
  BEHAVIOR: "@",
  CLASS: "."
};
const UTIL_KEYS = {
  VALUE: STATE_BEHAVIOUR_DELIMITER,
  DEPENDENCIES: "dependencies",
  DEPENDANTS: "dependants",
  ON_CHANGE: "onChange",
  LISTENERS: "listeners",
  MARKUP: "el",
  EVENT_LISTENERS: "eventListeners",
};

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
/* harmony export */   getParamNames: () => (/* binding */ getParamNames),
/* harmony export */   isDOMElement: () => (/* binding */ isDOMElement),
/* harmony export */   isFunction: () => (/* binding */ isFunction),
/* harmony export */   isHTMLString: () => (/* binding */ isHTMLString),
/* harmony export */   isNumber: () => (/* binding */ isNumber),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isString: () => (/* binding */ isString),
/* harmony export */   map: () => (/* binding */ map),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   toDashCase: () => (/* binding */ toDashCase)
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
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => cb(k, v)));
}

function toDashCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function addEnding (str, ending, condition) {
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

function filter (obj, cb) {
  return Object.fromEntries(Object.entries(obj).filter(([k,v]) => cb(k,v) === true));
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



const MARKUP_ACTIONS = {
  value: ({ el }, value) => (el.value = value),
  text: ({ el }, value) => (el.textContent = value),
  html: ({ el }, value) => (el.innerHTML = value),
  attrs: ({ el, attrs }, value) => changeAttributes(el, { ...attrs, ...value }),
  style: ({ el }, value) => changeStyles(el, value),
  class: ({ el, classes }, value) => changeClasses(el, value.concat(classes)),
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
function gatherBindings(componentHTML, dontRemove) {
  const bindings = {};

  walkNodes(componentHTML, (HTMLNode) => {
    const { name, el, classes, attrs } = extractBinding(HTMLNode, dontRemove);
    if (name) {
      bindings[name] = { el, classes, attrs };
    }
  });

  return bindings;
}

function extractBinding(el, dontRemove) {
  let binding = {};
  const attrs = {};
  const classes = []

  const attributes = el.getAttributeNames();
  for (const attr of attributes) {
    if (attr.startsWith(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.CLASS)) {
      !dontRemove && el.removeAttribute(attr);
      const className = attr
        .slice(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.CLASS.length)
        .split(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.CLASS);
      const cls = el.classList;
      cls.add.apply(cls, className);
      if (dontRemove) {
        attrs[attr] = true;
      }
      classes.push.apply(classes, className);
      continue;
    }

    if (attr.startsWith(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.BEHAVIOR)) {
      !dontRemove && el.removeAttribute(attr);
      binding = { name: attr.slice(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.BEHAVIOR.length), el };
      if (dontRemove) {
        attrs[attr] = true;
      }
      continue;
    }

    attrs[attr] = el.getAttribute(attr);
  }

  return { ...binding, classes, attrs };
}

function walkNodes(node, cb) {
  cb(node);

  Array.prototype.slice.call(node.children).forEach((el) => walkNodes(el, cb));
}

function applyToMarkup(elData, type, value, stateMutator) {
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
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");


const AXIS = {
  left: "X",
  top: "Y",
};

const DIRECTIONS = ["left", "top", "bottom", "right"];

function addPopupLogic (markup, options) {
  const { handle, closeButton } = options;

  markup.parentNode
    .querySelector(closeButton)
    ?.addEventListener("click", () => markup.parentNode.removeChild(markup));
  markup.parentNode
    .querySelector(handle)
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
  let { left, top, bottom, right } = options;
  const style = ["position: fixed"];

  if (!left && !right) {
    options.left = "center";
  }

  if (!top && !bottom) {
    options.top = "center";
  }

  (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.forEach)(options, (dir, dist) => {
    if (DIRECTIONS.includes(dir)) {
      if (dist === "center") {
        return style.push(`${dir}: 50%`, `transform: translate${AXIS[dir]}(-50%)`);
      }
      style.push(`${dir}: ${(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.addEnding)(dist, 'px', (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isNumber)(dist))}`);
    }
  });

  options.left === "center" &&
    options.top === "center" &&
    style.push("transform: translate(-50%, -50%)");

  markup.style = `${markup.style}; ${style.join(";")}`;
}

/***/ },

/***/ "./src/state.js"
/*!**********************!*\
  !*** ./src/state.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prepareState: () => (/* binding */ prepareState),
/* harmony export */   prepareStateSettings: () => (/* binding */ prepareStateSettings)
/* harmony export */ });
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./html */ "./src/html.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./consts */ "./src/consts.js");




function prepareStateSettings (stateBehaviour) {
  const state = {};
  (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(stateBehaviour, (stateKey, userValue) => {
    const [name, type] = splitStateKey(stateKey);

    if (!state[name]) {
      state[name] = {
        [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.DEPENDANTS]: {},
        [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_CHANGE]: [],
      };
    }

    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_1__.isObject)(userValue)) {
      return Object.assign(
        state[name],
        (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.map)(userValue, (k, v) => [k, prepareValue(name, k, v, state)]),
      );
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

function prepareState(markupPointers, state, args) {
  const get = getValues.bind(null, state);
  const set = setValues.bind(null, state);
  const onChange = addStateListener.bind(null, state);
  const removeListener = removeStateListener.bind(null, state);

  (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(markupPointers, (name, elData) => state[name].el = elData);

  args && setValues(state, args);

  (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(state, (name, binding) => {
    const { el } = binding;
    const eventListeners = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.filter)(binding, (type, value) => isEventListener(type, value.value));

    if (args) {
      (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(eventListeners, (event, cb) => {
        (0,_html__WEBPACK_IMPORTED_MODULE_0__.setupEventListener)(el.el, event, cb.value, { get, set });
      });
      return;
    }

    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(binding, (type, value) => (0,_html__WEBPACK_IMPORTED_MODULE_0__.applyToMarkup)(el, type, value?.value));
  });

  return { get, set, onChange, removeListener };
}

function prepareValue(name, type, value, state) {
  if (type === _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_CHANGE) {
    return [value];
  }

  const isReactive = isReactiveFunction(type, value);
  const dependencies = isReactive && (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.getParamNames)(value);

  if (dependencies) {
    dependencies.forEach((dependency) => {
      if (!state[dependency][_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.DEPENDANTS][name]) {
        state[dependency][_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.DEPENDANTS][name] = [];
      }
      state[dependency][_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.DEPENDANTS][name].push(type);
    });
  }

  return {
    value:
      (isReactive && value.apply(null, getArguments(dependencies, state))) ||
      value,
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
  return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.map)(state, (k, v) => [k, v[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE]?.value]);
}

function setValues(state, changes) {
  for (let [k, v] of Object.entries(changes)) {
    setValue(k, v, state);
  }
}

function setValue(key, value, state) {
  const realChanges = {};

  const prevValue = state[key][_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE].value;

  if (prevValue !== value) {
    state[key][_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE].value = value;
    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.set)(realChanges, [key, _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE], { newValue: value, prevValue });

    updateDependencies(key, state, realChanges);
  }

  (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(realChanges, (name, change) => {
    const binding = state[name];
    const { [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.MARKUP]: el, [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.ON_CHANGE]: listeners } = binding;
    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(change, (type, value) => {
      (0,_html__WEBPACK_IMPORTED_MODULE_0__.applyToMarkup)(el, type, value.newValue);

      if (type === _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE) {
        listeners.forEach((cb) =>
          cb(
            value.newValue,
            el,
            {
              get: getValues.bind(null, state),
              set: setValues.bind(null, state),
            },
            value,
          ),
        );
      }
    });
  });
}

function updateDependencies(key, state, realChanges) {
  const dependants = state[key][_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.DEPENDANTS];

  for (let [dependant, types] of Object.entries(dependants)) {
    types.forEach((type) => {
      const { computeFn, dependencies } = state[dependant][type];
      const prevValue = state[dependant][type].value;
      const newValue = computeFn.apply(null, getArguments(dependencies, state));

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


/***/ },

/***/ "./src/styles.js"
/*!***********************!*\
  !*** ./src/styles.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prepareStyles: () => (/* binding */ prepareStyles)
/* harmony export */ });
function prepareStyles(styleStr) {
  const style = new CSSStyleSheet();
  style.replaceSync(styleStr);
  return style; 
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






function createTemplate (markupStr, stateBehaviour, styleSheets) {
  const markup = (0,_html__WEBPACK_IMPORTED_MODULE_1__.cloneHTMLMarkup)(markupStr);
  const [state, styles] = (0,_helpers__WEBPACK_IMPORTED_MODULE_4__.isObject)(stateBehaviour)
    ? [(0,_state__WEBPACK_IMPORTED_MODULE_0__.prepareStateSettings)(stateBehaviour), (0,_styles__WEBPACK_IMPORTED_MODULE_2__.prepareStyles)(styleSheets)]
    : [, (0,_styles__WEBPACK_IMPORTED_MODULE_2__.prepareStyles)(stateBehaviour)];

  const boundElements = (0,_html__WEBPACK_IMPORTED_MODULE_1__.gatherBindings)(markup, true);
  state && (0,_state__WEBPACK_IMPORTED_MODULE_0__.prepareState)(boundElements, state);

  const template = { markup, state, styles };

  return Object.assign((args) => createComponent(template, args), {
    asPopup: (options) => createComponent(template, {}, document.body, { ...options, isPopup: true })
  });
}

function createComponent (template, ...args) {
  (0,_helpers__WEBPACK_IMPORTED_MODULE_4__.isDOMElement)(args[0]) && args.unshift({})
  const [stateValues, target, options] = args;

  const markup = template.markup.cloneNode(true);
  const state = (0,_helpers__WEBPACK_IMPORTED_MODULE_4__.copy)({}, template.state);
  const boundElements = (0,_html__WEBPACK_IMPORTED_MODULE_1__.gatherBindings)(markup);
  const api = state && (0,_state__WEBPACK_IMPORTED_MODULE_0__.prepareState)(boundElements, state, stateValues);

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
  const { markup, styles, api } = component;

  const shadowContainer = document.createElement("div");
  const host = shadowContainer.attachShadow({ mode: "open" });
  host.adoptedStyleSheets = [styles];
  host.appendChild(markup);
  target.appendChild(shadowContainer);

  if (options.isPopup) {
    (0,_popup__WEBPACK_IMPORTED_MODULE_3__.addPopupLogic)(markup, options);
  }

  return {
    ...api,
    append: () => append(target, component),
    destroy: () => target.removeChild(shadowContainer),
  };
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createTemplate);
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});