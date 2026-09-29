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

/***/ "./src/combine.ts"
/*!************************!*\
  !*** ./src/combine.ts ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   combineState: () => (/* binding */ combineState),
/* harmony export */   combineTemplates: () => (/* binding */ combineTemplates)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./src/consts.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./src/state.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./html */ "./src/html.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./index */ "./src/index.ts");





function combineTemplates(combineCb, templateId) {
    const parentBindings = {};
    const inject = injectTemplate.bind(null, parentBindings, templateId);
    const markupStr = combineCb.call(null, inject);
    return [(0,_html__WEBPACK_IMPORTED_MODULE_3__.cloneHTMLMarkup)(markupStr), parentBindings];
}
function injectTemplate(parentBindings, templateId, template, value) {
    const [createComponent, isAnonymous] = getCreateFunction(template, templateId);
    const id = Object.keys(parentBindings).length;
    const name = `${_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.CHILDREN}${id}`;
    const computeFn = (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.isFunction)(value) && value;
    const dependencies = (computeFn && (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.getParamNames)(value)) || [];
    parentBindings[name] = {
        createComponent,
        values: {
            [_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.VALUE]: {
                value: !computeFn && normalizeValue(value),
                computeFn,
                dependencies,
            },
        },
        dependants: {},
        children: [],
        isRendered: false,
        isAnonymous,
        isFastApply: false,
        el: {},
        isParent: true,
    };
    return `<span ${_consts__WEBPACK_IMPORTED_MODULE_0__.BINDING_SIGN.COMPONENT}${name}></span>`;
}
function combineState(state, parentBindings) {
    Object.assign(state.bindings, parentBindings);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.forEach)(parentBindings, (parentName, parentBinding) => {
        const { dependencies, computeFn, value } = parentBinding.values[_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.VALUE];
        dependencies.forEach((name) => {
            (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.set)(state.bindings, [name, _consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.DEPENDANTS, parentName], [_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.VALUE]);
        });
        const newComputeFn = computeFn &&
            function (dependencies, state) {
                const computedValue = computeFn.apply(null, (0,_state__WEBPACK_IMPORTED_MODULE_1__.getArguments)(dependencies, state));
                if (!computedValue) {
                    return [];
                }
                return normalizeValue(computedValue);
            };
        parentBinding.values[_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.VALUE].computeFn = newComputeFn;
        parentBinding.values[_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS.VALUE].value = newComputeFn
            ? newComputeFn(dependencies, state)
            : value;
    });
}
function getCreateFunction(template, templateId) {
    if (template.markup) {
        return [template, false];
    }
    return [
        (0,_index__WEBPACK_IMPORTED_MODULE_4__["default"])(template, {}, "", templateId),
        true,
    ];
}
function normalizeValue(value) {
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_2__.isArray)(value)
        ? value[0] && !(0,_helpers__WEBPACK_IMPORTED_MODULE_2__.isArray)(value[0])
            ? value.map((v) => [v])
            : value
        : [[value || {}]];
}


/***/ },

/***/ "./src/consts.ts"
/*!***********************!*\
  !*** ./src/consts.ts ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BINDING_SIGN: () => (/* binding */ BINDING_SIGN),
/* harmony export */   CHILDREN_LIST_OPERATIONS: () => (/* binding */ CHILDREN_LIST_OPERATIONS),
/* harmony export */   DESTROY_OP: () => (/* binding */ DESTROY_OP),
/* harmony export */   EMPTY_FN: () => (/* binding */ EMPTY_FN),
/* harmony export */   FORM_TAGS: () => (/* binding */ FORM_TAGS),
/* harmony export */   NO_EVENT_TYPES: () => (/* binding */ NO_EVENT_TYPES),
/* harmony export */   REACTIVE_TYPES: () => (/* binding */ REACTIVE_TYPES),
/* harmony export */   STATE_BEHAVIOUR_DELIMITER: () => (/* binding */ STATE_BEHAVIOUR_DELIMITER),
/* harmony export */   UTIL_KEYS: () => (/* binding */ UTIL_KEYS)
/* harmony export */ });
const STATE_BEHAVIOUR_DELIMITER = "_";
const BINDING_SIGN = {
    BEHAVIOR: "@",
    CLASS: ".",
    COMPONENT: "&",
};
const UTIL_KEYS = {
    VALUE: STATE_BEHAVIOUR_DELIMITER,
    DEPENDANTS: "dependants",
    CHILDREN: "children",
    VALUES: "values",
    MARKUP: "el",
    ON_MESSAGE: "onMessage",
    ON_CHANGE: "onChange",
};
const DESTROY_OP = "destroy";
const REACTIVE_TYPES = [
    "html",
    "value",
    "style",
    "text",
    "attrs",
    "class",
    UTIL_KEYS.VALUE,
    undefined,
];
const NO_EVENT_TYPES = REACTIVE_TYPES.concat([UTIL_KEYS.ON_CHANGE]);
const EMPTY_FN = () => { };
const CHILDREN_LIST_OPERATIONS = [DESTROY_OP, "set", "insert", "push"];
const FORM_TAGS = ["INPUT", "SELECT", "TEXTAREA"];


/***/ },

/***/ "./src/error.ts"
/*!**********************!*\
  !*** ./src/error.ts ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   throwIllegalBindingNameError: () => (/* binding */ throwIllegalBindingNameError),
/* harmony export */   throwNoDeclaredDependencyError: () => (/* binding */ throwNoDeclaredDependencyError)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "./src/consts.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");


function throwIllegalBindingNameError(name) {
    throwError(`Binding @${name} can't be added in the markup, because this name is reserved by the library.\nOther reserved names: ${(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.map)(_consts__WEBPACK_IMPORTED_MODULE_0__.UTIL_KEYS, (_, v) => v)}`);
}
function throwNoDeclaredDependencyError(name, dependant) {
    throwError(`Dependency '${name}' is used for '${dependant}', but is not declared as a state value of the component.`);
}
function throwError(text) {
    throw new Error(text);
}


/***/ },

/***/ "./src/helpers.ts"
/*!************************!*\
  !*** ./src/helpers.ts ***!
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
/* harmony export */   getFilteredKeys: () => (/* binding */ getFilteredKeys),
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
/* harmony export */   toCamelCase: () => (/* binding */ toCamelCase),
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
function toCamelCase(str) {
    return str.replace(/-([a-z])/gi, (all, letter) => letter.toUpperCase());
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
    return !!obj && typeof obj.tagName !== "undefined";
}
function isUndefined(obj) {
    return typeof obj === "undefined";
}
function isArray(obj) {
    return getObjectType(obj) === "[object Array]";
}
function forEach(obj, cb) {
    Object.entries(obj || {}).forEach(([k, v]) => cb(k, v));
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
        }
        else {
            dest = dest[path[i]];
        }
    }
    if (isObject(value)) {
        dest[path[i]] = dest[path[i]] || {};
        Object.assign(dest[path[i]], value);
    }
    else {
        dest[path[i]] = value;
    }
    return obj;
}
function filter(obj, cb) {
    return Object.fromEntries(Object.entries(obj || {}).filter(([k, v]) => cb(k, v) === true));
}
function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
function get(obj, path, def) {
    let value = obj;
    for (let i = 0; i < path.length; i++) {
        try {
            value = value[path[i]];
        }
        catch {
            return def;
        }
    }
    return !isUndefined(value) ? value : def;
}
function getFilteredKeys(obj, cb) {
    return map(filter(obj, (k, v) => cb(k, v)), (k) => k);
}


/***/ },

/***/ "./src/html.ts"
/*!*********************!*\
  !*** ./src/html.ts ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MARKUP_ACTIONS: () => (/* binding */ MARKUP_ACTIONS),
/* harmony export */   addChildMarkup: () => (/* binding */ addChildMarkup),
/* harmony export */   applyToMarkup: () => (/* binding */ applyToMarkup),
/* harmony export */   cloneHTMLMarkup: () => (/* binding */ cloneHTMLMarkup),
/* harmony export */   gatherBindings: () => (/* binding */ gatherBindings),
/* harmony export */   removeChildMarkup: () => (/* binding */ removeChildMarkup),
/* harmony export */   setupEventListener: () => (/* binding */ setupEventListener),
/* harmony export */   walkNodes: () => (/* binding */ walkNodes)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consts */ "./src/consts.ts");
/* harmony import */ var _popup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./popup */ "./src/popup.ts");
/* harmony import */ var _error__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./error */ "./src/error.ts");




const MARKUP_ACTIONS = {
    [_consts__WEBPACK_IMPORTED_MODULE_1__.UTIL_KEYS.VALUE]: ({ el, isFastApply }, value) => isFastApply && fastApply(el, value),
    value: ({ el }, value) => (el.value = value),
    text: ({ el }, value) => (el.textContent = value),
    html: ({ el }, value) => (el.innerHTML = value),
    attrs: ({ el, attrs }, value) => changeAttributes(el, {
        ...attrs,
        ...value,
        class: el.className,
    }),
    style: ({ el }, value) => changeStyles(el, value),
    class: ({ el, classes, templateId }, value) => changeClasses(el, value.map((cls) => `${templateId}${cls}`).concat(classes)),
};
function cloneHTMLMarkup(markup) {
    const markupStr = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isHTMLString)(markup.trim())
        ? markup
        : document.querySelector(markup)?.innerHTML;
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
        const { name, el, classes, attrs, isComponent, placeholder } = extractBinding(HTMLNode, templateId, dontRemove);
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
function extractBinding(el, templateId, dontRemove) {
    let binding = {};
    const attrs = {};
    const classes = [];
    const attributes = el.getAttributeNames();
    for (const attr of attributes) {
        if (attr.startsWith(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.CLASS)) {
            (dontRemove && (attrs[attr] = true)) || el.removeAttribute(attr);
            handleClassBinding(el, templateId, attr.slice(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.CLASS.length), classes);
            continue;
        }
        if (attr.startsWith(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.BEHAVIOR)) {
            const name = attr.slice(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.BEHAVIOR.length);
            if (Object.values(_consts__WEBPACK_IMPORTED_MODULE_1__.UTIL_KEYS).includes(name)) {
                (0,_error__WEBPACK_IMPORTED_MODULE_3__.throwIllegalBindingNameError)(name);
            }
            (dontRemove && (attrs[attr] = true)) || el.removeAttribute(attr);
            binding = { name, el };
            handleClassBinding(el, templateId, name, classes);
            continue;
        }
        if (attr.startsWith(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.COMPONENT)) {
            (dontRemove && (attrs[attr] = true)) || el.removeAttribute(attr);
            binding = {
                name: attr.slice(_consts__WEBPACK_IMPORTED_MODULE_1__.BINDING_SIGN.COMPONENT.length),
                el,
                placeholder: el,
                isComponent: true,
            };
            continue;
        }
        attrs[attr] = el.getAttribute(attr);
    }
    return { ...binding, classes, attrs };
}
function handleClassBinding(el, templateId, classesString, classes) {
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
    elData && MARKUP_ACTIONS[type] && MARKUP_ACTIONS[type](elData, value);
}
function changeAttributes(el, newAttrs) {
    for (const name of el.getAttributeNames()) {
        if (!newAttrs[name]) {
            el.removeAttribute(name);
        }
    }
    Object.entries(newAttrs).forEach(([k, v]) => el.setAttribute(k, v));
}
function changeStyles(el, styles) {
    (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.forEach)(styles, (k, v) => {
        el.style.setProperty((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.toDashCase)(k), (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.addEnding)(v, "px", (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isNumber)(v)));
    });
}
function changeClasses(el, classes) {
    el.classList.value = classes.join(" ");
}
function setupEventListener(el, type, cb, stateMutator) {
    const fn = (e) => cb(e, stateMutator);
    el.addEventListener(type, fn);
}
function removeChildMarkup(state, idx) {
    const { children, el } = state.parentBinding;
    const markup = state.el;
    if (children.length === 1 && el) {
        markup?.parentNode?.replaceChild(el.placeholder, markup);
        el.el = el.placeholder;
        return;
    }
    if (idx === 0) {
        el.el = markup?.nextSibling;
    }
    markup?.parentNode?.removeChild(markup);
}
function addChildMarkup(parentNode, component, options) {
    const { markup, styles, id } = component;
    const { isNoShadow, nextNode, placeholder, isPopup } = options;
    let el;
    if (isNoShadow) {
        el = markup;
    }
    else {
        el = document.createElement("div");
        const host = el.attachShadow({ mode: "open" });
        host.adoptedStyleSheets = styles;
        host.appendChild(markup);
    }
    if (placeholder) {
        parentNode.replaceChild(el, placeholder);
    }
    else if (nextNode) {
        parentNode.insertBefore(el, nextNode);
    }
    else {
        parentNode.appendChild(el);
    }
    if (isPopup) {
        (0,_popup__WEBPACK_IMPORTED_MODULE_2__.addPopupLogic)(markup, { ...options, id });
    }
}
function fastApply(el, value = "") {
    if (_consts__WEBPACK_IMPORTED_MODULE_1__.FORM_TAGS.includes(el.tagName)) {
        el.value = value;
    }
    else {
        el.textContent = value;
    }
}


/***/ },

/***/ "./src/index.ts"
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   append: () => (/* binding */ append),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ "./src/state.ts");
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./html */ "./src/html.ts");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles */ "./src/styles.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");
/* harmony import */ var _combine__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./combine */ "./src/combine.ts");
/* harmony import */ var _lifecycle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lifecycle */ "./src/lifecycle.ts");






function createTemplate(markupStr, stateBehaviour, styleSheets, parentId) {
    const id = parentId || (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.uid)();
    const [markup, childrenState] = (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.isFunction)(markupStr)
        ? (0,_combine__WEBPACK_IMPORTED_MODULE_4__.combineTemplates)(markupStr, id)
        : [(0,_html__WEBPACK_IMPORTED_MODULE_1__.cloneHTMLMarkup)(markupStr), {}];
    const [state, styles] = (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.isObject)(stateBehaviour)
        ? [(0,_state__WEBPACK_IMPORTED_MODULE_0__.prepareStateSettings)(stateBehaviour), (0,_styles__WEBPACK_IMPORTED_MODULE_2__.prepareStyles)(id, styleSheets)]
        : [{}, (0,_styles__WEBPACK_IMPORTED_MODULE_2__.prepareStyles)(id, stateBehaviour)];
    const isStateless = !Object.keys(state).length || !!parentId;
    (0,_combine__WEBPACK_IMPORTED_MODULE_4__.combineState)(state, childrenState);
    const boundElements = (0,_html__WEBPACK_IMPORTED_MODULE_1__.gatherBindings)(markup, id, true);
    (0,_state__WEBPACK_IMPORTED_MODULE_0__.updateTemplateMarkup)(boundElements, state);
    const allStyles = (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.map)(childrenState, (_, v) => v)
        .map((v) => v.createComponent?.styles)
        .reduce((allStyles, styles) => allStyles.concat(styles), [])
        .concat(styles);
    const template = {
        id,
        markup,
        state,
        styles: allStyles,
        isStateless,
        isAnonymous: isStateless,
    };
    return Object.assign((stateValues, target, options) => createComponent(template, stateValues, target, options), {
        ...template,
        asPopup: (options) => createComponent(template, {}, document.body, {
            ...options,
            isPopup: true,
        }),
    });
}
function createComponent(template, stateValues, target, options = {}) {
    if (template.isStateless) {
        (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.copy)(template.state, (0,_state__WEBPACK_IMPORTED_MODULE_0__.prepareStateSettings)(stateValues, true));
        template.isStateless = false;
    }
    const markup = template.markup?.cloneNode(true);
    const state = (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.copy)({}, template.state);
    state.parentState = options.parentState;
    state.parentBinding = options.parentBinding;
    state.el = markup;
    const boundElements = (0,_html__WEBPACK_IMPORTED_MODULE_1__.gatherBindings)(markup, template.id);
    const api = state &&
        (0,_state__WEBPACK_IMPORTED_MODULE_0__.setupComponentMarkup)(boundElements, state, template.isAnonymous
            ? (0,_state__WEBPACK_IMPORTED_MODULE_0__.getValues)((0,_state__WEBPACK_IMPORTED_MODULE_0__.prepareStateSettings)(stateValues))
            : stateValues);
    const component = { api, ...template, markup, state };
    if (target) {
        return append(target, component, options);
    }
}
function append(parentNode, component, options = {}) {
    (0,_html__WEBPACK_IMPORTED_MODULE_1__.addChildMarkup)(parentNode, component, options);
    const { state } = component;
    state.isRendered = true;
    return (0,_lifecycle__WEBPACK_IMPORTED_MODULE_5__.runStateChangeListeners)(true, state);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createTemplate);


/***/ },

/***/ "./src/lifecycle.ts"
/*!**************************!*\
  !*** ./src/lifecycle.ts ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runStateChangeListeners: () => (/* binding */ runStateChangeListeners)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./src/state.ts");


function runStateChangeListeners(changes, state) {
    const { onChange, el } = state;
    const bindings = (0,_state__WEBPACK_IMPORTED_MODULE_1__.getStateBindings)(state);
    const componentApi = (0,_state__WEBPACK_IMPORTED_MODULE_1__.createStateApi)(state);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.forEach)(bindings, (name, binding) => {
        if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isArray)(changes) && !changes.includes(name)) {
            return;
        }
        const change = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isArray)(changes) ? [name] : changes;
        binding?.values?.onChange?.value?.(change, componentApi, binding.el?.el);
    });
    onChange(changes, componentApi, el);
    return componentApi;
}


/***/ },

/***/ "./src/popup.ts"
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addPopupLogic: () => (/* binding */ addPopupLogic)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles */ "./src/styles.ts");


const AXIS = {
    left: "X",
    top: "Y",
};
const DIRECTIONS = ["left", "top", "bottom", "right"];
function addPopupLogic(markup, options) {
    const { handle, closeButton, id } = options;
    closeButton &&
        markup?.parentNode
            ?.querySelector((0,_styles__WEBPACK_IMPORTED_MODULE_1__.addClassPrefix)(closeButton, id))
            ?.addEventListener("click", () => markup?.parentNode?.removeChild(markup));
    handle &&
        markup?.parentNode
            ?.querySelector((0,_styles__WEBPACK_IMPORTED_MODULE_1__.addClassPrefix)(handle, id))
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
            function onMouseUp() {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
                el?.removeEventListener("mouseup", onMouseUp);
            }
            document.addEventListener("mouseup", onMouseUp);
            el?.addEventListener("mouseup", onMouseUp);
            document.addEventListener("mousemove", onMouseMove);
        });
    positionPopup(markup, options);
}
function positionPopup(markup, options) {
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
    (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.forEach)(options, (dir, dist) => {
        if (DIRECTIONS.includes(dir)) {
            if (dist === "center") {
                return style.push(`${dir}: 50%`, `transform: translate${AXIS[dir]}(-50%)`);
            }
            style.push(`${dir}: ${(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.addEnding)(dist, "px", (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isNumber)(dist))}`);
        }
    });
    options.left === "center" &&
        options.top === "center" &&
        style.push("transform: translate(-50%, -50%)");
    markup.style = `${markup.style.cssText}; ${style.join(";")}`;
}


/***/ },

/***/ "./src/state.ts"
/*!**********************!*\
  !*** ./src/state.ts ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createChildrenApi: () => (/* binding */ createChildrenApi),
/* harmony export */   createStateApi: () => (/* binding */ createStateApi),
/* harmony export */   getArguments: () => (/* binding */ getArguments),
/* harmony export */   getStateBindings: () => (/* binding */ getStateBindings),
/* harmony export */   getValues: () => (/* binding */ getValues),
/* harmony export */   prepareStateSettings: () => (/* binding */ prepareStateSettings),
/* harmony export */   setupComponentMarkup: () => (/* binding */ setupComponentMarkup),
/* harmony export */   updateTemplateMarkup: () => (/* binding */ updateTemplateMarkup)
/* harmony export */ });
/* harmony import */ var _html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./html */ "./src/html.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./consts */ "./src/consts.ts");
/* harmony import */ var _lifecycle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lifecycle */ "./src/lifecycle.ts");




function prepareStateSettings(stateBehaviour = {}, noValues) {
    const state = {
        onMessage: stateBehaviour.onMessage || _consts__WEBPACK_IMPORTED_MODULE_2__.EMPTY_FN,
        onChange: stateBehaviour.onChange || _consts__WEBPACK_IMPORTED_MODULE_2__.EMPTY_FN,
        bindings: {},
    };
    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.map)(_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS, (_, v) => v).forEach((v) => delete stateBehaviour[v]);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(stateBehaviour, (stateKey, userValue) => {
        const [name, type] = splitStateKey(stateKey);
        if (!state.bindings[name]) {
            state.bindings[name] = {
                values: { [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE]: {} },
                children: [],
                el: {},
                isFastApply: !type && !(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.isObject)(userValue),
                dependants: {},
            };
        }
        const binding = state.bindings[name];
        if ((0,_helpers__WEBPACK_IMPORTED_MODULE_1__.isObject)(userValue)) {
            return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(userValue, (type, value) => {
                binding.values[type] = prepareValue(name, type, value, state, noValues);
            });
        }
        binding.values[type || _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE] = prepareValue(name, type, userValue, state, noValues);
    });
    return state;
}
function splitStateKey(key) {
    const segments = key.split(_consts__WEBPACK_IMPORTED_MODULE_2__.STATE_BEHAVIOUR_DELIMITER);
    if (segments.length === 1) {
        return [segments[0]];
    }
    const name = segments.slice(0, -1).join(_consts__WEBPACK_IMPORTED_MODULE_2__.STATE_BEHAVIOUR_DELIMITER);
    const type = segments.slice(-1)[0];
    return [name, type];
}
function updateTemplateMarkup(markupPointers, state) {
    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(markupPointers, (name, elData) => {
        const binding = state.bindings[(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.toCamelCase)(name)];
        elData.isFastApply = binding?.isFastApply;
        binding &&
            (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(binding.values, (type, value) => (0,_html__WEBPACK_IMPORTED_MODULE_0__.applyToMarkup)(elData, type, value?.value));
    });
}
function setupComponentMarkup(markupPointers, state, args) {
    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(markupPointers, (name, elData) => {
        const binding = state.bindings[(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.toCamelCase)(name)];
        elData.isFastApply = !binding || binding?.isFastApply;
        (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.set)(state.bindings, [(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.toCamelCase)(name), _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.MARKUP], elData);
    });
    setValues(state, args);
    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(state.bindings, (name, binding) => {
        const { isParent, el, isRendered, values } = binding;
        const { [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE]: value } = values || {};
        if (isParent) {
            if (!isRendered) {
                const childrenApi = createChildrenApi(binding);
                const diffs = getChildrenDifference(value.value, []);
                for (let operation of _consts__WEBPACK_IMPORTED_MODULE_2__.CHILDREN_LIST_OPERATIONS) {
                    diffs[operation].forEach((val) => {
                        childrenApi[operation].apply(null, [val]);
                    });
                }
                updateAnonymousChildren(state);
            }
            binding.parentState = state;
            return;
        }
        const eventListeners = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.filter)(binding.values, (type, value) => isEventListener(type, value.value));
        (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(eventListeners, (event, cb) => (0,_html__WEBPACK_IMPORTED_MODULE_0__.setupEventListener)(el?.el, event, cb.value, createStateApi(state)));
    });
    return createStateApi(state);
}
function prepareValue(name, type, value, state, noValues) {
    const isReactive = isReactiveFunction(type, value);
    const dependencies = isReactive ? (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.getParamNames)(value) : [];
    if (dependencies) {
        dependencies.forEach((dependency) => {
            if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.get)(state.bindings, [dependency, _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.DEPENDANTS, name])) {
                (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.set)(state.bindings, [dependency, _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.DEPENDANTS, name], []);
            }
            state.bindings[dependency].dependants[name].push(type || _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE);
        });
    }
    const computeFn = isReactive &&
        function (dependencies, state) {
            return value.apply(null, getArguments(dependencies, state));
        };
    return {
        value: !noValues
            ? isReactive
                ? computeFn(dependencies, state)
                : value
            : undefined,
        computeFn,
        dependencies,
    };
}
function isReactiveFunction(type, value) {
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value) && _consts__WEBPACK_IMPORTED_MODULE_2__.REACTIVE_TYPES.includes(type);
}
function isEventListener(type, value) {
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value) && !_consts__WEBPACK_IMPORTED_MODULE_2__.NO_EVENT_TYPES.includes(type);
}
function getArguments(names, state) {
    const values = getValues(state);
    return names.map((name) => values[name]);
}
function getValues(state) {
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.map)(getStateBindings(state), (k, v) => [
        k,
        v.values._?.value,
    ]);
}
function setValues(state, changes) {
    const realChanges = {};
    for (let [k, v] of Object.entries(changes)) {
        setValue(k, v, state, realChanges, changes);
    }
    updateComponentAfterChange(state, realChanges);
}
function setValue(key, value, state, realChanges, changes) {
    const prevValue = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.get)(state.bindings, [
        key,
        _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUES,
        _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE,
        "value",
    ]);
    if (prevValue !== value) {
        (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.set)(state.bindings, [key, _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUES, _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE, "value"], value);
        (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.set)(realChanges, [key, _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE], { newValue: value, prevValue });
    }
    else {
        (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.set)(realChanges, [key, _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE], { isSame: true });
    }
    updateDependencies(key, state, realChanges, changes);
}
function updateDependencies(key, state, realChanges, changes) {
    const dependants = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.get)(state.bindings, [key, _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.DEPENDANTS], {});
    for (let [dependant, types] of Object.entries(dependants)) {
        types.forEach((type) => {
            const dependantBindingValue = state.bindings[dependant].values[type];
            const { computeFn, dependencies } = dependantBindingValue;
            const realChangesKeys = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.getFilteredKeys)(realChanges, (k, v) => !!v[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE]);
            const changesKeys = Object.keys(changes);
            const isUpdated = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.get)(realChanges, [dependant, type]);
            if (!dependencies.every((name) => (changesKeys.includes(name) && realChangesKeys.includes(name)) ||
                !changesKeys.includes(name)) ||
                isUpdated) {
                return;
            }
            const prevValue = dependantBindingValue.value;
            const newValue = computeFn(dependencies, state);
            if (prevValue !== newValue) {
                dependantBindingValue.value = newValue;
                (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.set)(realChanges, [dependant, type], { newValue, prevValue });
                if (type === _consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE) {
                    updateDependencies(dependant, state, realChanges, changes);
                }
            }
        });
    }
}
function updateComponentAfterChange(state, realChanges) {
    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(realChanges, (name, change) => {
        const binding = state.bindings[name];
        const { el, children, isParent } = binding;
        if (isParent) {
            const { newValue, prevValue } = change[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE];
            const childrenApi = createChildrenApi(binding);
            const diffs = getChildrenDifference(newValue, prevValue);
            for (let operation of _consts__WEBPACK_IMPORTED_MODULE_2__.CHILDREN_LIST_OPERATIONS) {
                const values = diffs[operation];
                values.forEach((val) => {
                    if (operation === _consts__WEBPACK_IMPORTED_MODULE_2__.DESTROY_OP && children.length) {
                        (0,_lifecycle__WEBPACK_IMPORTED_MODULE_3__.runStateChangeListeners)(false, children[val.index].state);
                    }
                    childrenApi[operation].apply(null, [val]);
                });
            }
            binding.isRendered = true;
            return;
        }
        (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(change, (type, value) => !value.isSame && (0,_html__WEBPACK_IMPORTED_MODULE_0__.applyToMarkup)(el, type, value.newValue));
    });
    updateAnonymousChildren(state);
    const changedKeys = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.getFilteredKeys)(realChanges, (k, v) => !!v[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE] &&
        !v[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE].isSame &&
        !state.bindings[k].isParent);
    state.isRendered &&
        changedKeys.length &&
        (0,_lifecycle__WEBPACK_IMPORTED_MODULE_3__.runStateChangeListeners)(changedKeys, state);
}
function sendMessage(state, data) {
    let parent = state.parentState;
    const parentBinding = state.parentBinding;
    const index = parentBinding.children.findIndex((api) => api.state === state);
    const stop = () => (parent = {});
    while (parent) {
        parent.onMessage(data, {
            stop,
            ...createStateApi(parent),
        }, {
            index,
            ...createChildrenApi(parentBinding, true),
        });
        parent = parent.parentState;
    }
}
function createStateApi(state) {
    return {
        get: getValues.bind(null, state),
        set: setValues.bind(null, state),
        send: sendMessage.bind(null, state),
        children: getStateChildren.bind(null, state),
        [_consts__WEBPACK_IMPORTED_MODULE_2__.DESTROY_OP]: _html__WEBPACK_IMPORTED_MODULE_0__.removeChildMarkup.bind(null, state),
        markup: getComponentMarkups(state),
        state,
    };
}
function getStateBindings(state) {
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.filter)(state.bindings, (k, v) => !!v?.values?.[_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE] && !v?.isParent);
}
function getStateChildren(state) {
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.map)((0,_helpers__WEBPACK_IMPORTED_MODULE_1__.filter)(state.bindings, (k, v) => !!v?.isParent), (k, v) => [k, createChildrenApi(v)]);
}
function getComponentMarkups(state) {
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.map)((0,_helpers__WEBPACK_IMPORTED_MODULE_1__.filter)(state.bindings, (k, v) => !!v?.el?.el && !v?.isParent), (k, v) => [k, v?.el?.el]);
}
function createChildrenApi(parentBinding, isManualUse) {
    const { createComponent, parentState, children, values: { [_consts__WEBPACK_IMPORTED_MODULE_2__.UTIL_KEYS.VALUE]: value }, } = parentBinding;
    const create = (value, nextNode, isFirst) => {
        const { el } = parentBinding;
        const componentApi = createComponent?.(value, el?.el.parentNode, {
            isNoShadow: true,
            placeholder: isFirst && el?.el,
            nextNode,
            parentBinding,
            parentState,
        });
        if (isFirst && el) {
            el.el = componentApi?.state.el;
        }
        return componentApi;
    };
    return {
        [_consts__WEBPACK_IMPORTED_MODULE_2__.DESTROY_OP]: ({ index }) => {
            children[index][_consts__WEBPACK_IMPORTED_MODULE_2__.DESTROY_OP](index);
            children.splice(index, 1);
            if (isManualUse) {
                value.value.splice(index, 1);
            }
        },
        push: ({ values }) => {
            const nextNode = children &&
                children.length &&
                children[children.length - 1].state.el?.nextSibling;
            children.push(create(values, nextNode, !children.length));
            if (isManualUse) {
                value.value.push(values);
            }
        },
        insert: ({ values, index = 0 }) => {
            const nextNode = children[index].state.el;
            children.splice(index, 0, create(values, nextNode));
            if (isManualUse) {
                value.value.splice(index, 0, value);
            }
        },
        set: ({ values, index }) => {
            if (index || index === 0) {
                return children[index].set(createComponent?.isAnonymous
                    ? getValues(prepareStateSettings(values))
                    : values);
            }
        },
        get: (index) => {
            if (index || index === 0) {
                return children[index].get();
            }
            return children.map(({ get }) => get());
        },
        forEach: (cb) => children.forEach(cb),
    };
}
function getChildrenDifference(news, prevs) {
    const destroy = [];
    const set = [];
    const insert = [];
    const push = [];
    const newsInPrevs = {};
    const foundSameUids = {};
    let removeCount = 0;
    prevs.forEach(([prev, uid], i) => {
        const prevFoundIndex = foundSameUids[uid] >= 0 ? foundSameUids[uid] + 1 : 0;
        const newIndex = news
            .slice(prevFoundIndex)
            .findIndex(([neww, newUid]) => newUid === uid);
        const newPos = i - removeCount;
        if (newIndex === -1) {
            destroy.push({ index: newPos, values: prev });
            removeCount++;
        }
        else {
            foundSameUids[uid] = prevFoundIndex + newIndex;
            set.push({ values: news[foundSameUids[uid]][0], index: newPos });
            newsInPrevs[foundSameUids[uid]] = newPos;
        }
    });
    let newCount = 0;
    let nextPos = 0;
    news.forEach(([neww], i) => {
        const newPos = newsInPrevs[i];
        if (newPos >= 0) {
            nextPos = newPos + 1 + newCount;
        }
        else if (nextPos >= prevs.length + newCount) {
            push.push({ values: neww, index: i });
        }
        else {
            insert.push({ values: neww, index: nextPos });
            nextPos++;
            newCount++;
        }
    });
    return { [_consts__WEBPACK_IMPORTED_MODULE_2__.DESTROY_OP]: destroy, set, insert, push };
}
function updateAnonymousChildren(state) {
    (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.forEach)(state.bindings, (_, childrenBinding) => {
        if (childrenBinding?.isAnonymous) {
            const childrenApi = createChildrenApi(childrenBinding);
            childrenApi.forEach(({ set }) => set(getValues(state)));
        }
    });
}


/***/ },

/***/ "./src/styles.ts"
/*!***********************!*\
  !*** ./src/styles.ts ***!
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
    for (let i = 0; i < style.cssRules.length; i++) {
        const cssRule = style.cssRules[i];
        cssRule.selectorText = addClassPrefix(cssRule.selectorText, prefix);
    }
    return [style];
}
function addClassPrefix(str, prefix) {
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	let __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});