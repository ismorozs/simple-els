const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;

export function isHTMLString(obj) {
  return isString(obj) && obj.indexOf("<") === 0;
}

export function isString(obj) {
  return getObjectType(obj) === "[object String]";
}

export function isFunction(obj) {
  return getObjectType(obj) === "[object Function]";
}

export function isObject(obj) {
  return getObjectType(obj) === "[object Object]";
}

function getObjectType(obj) {
  return Object.prototype.toString.call(obj);
}

export function getParamNames(fn) {
  const fnStr = fn.toString().replace(STRIP_COMMENTS, "").split("=>")[0];

  const names = fnStr
    .slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
    .match(ARGUMENT_NAMES);

  if (names === null) {
    return [];
  }

  return names;
}

export function map(obj, cb) {
  const res = Object.entries(obj).map(([k, v]) => cb(k, v));
  if (res[0]?.length === 2) {
    return Object.fromEntries(res);
  }

  return res;
}

export function toDashCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function toCamelCase(str) {
  return str.replace(/-([a-z])/gi, (all, letter) => letter.toUpperCase());
}

export function addEnding(str, ending, condition) {
  return `${str}${(condition && ending) || ""}`;
}

export function isNumber(obj) {
  return getObjectType(obj) === "[object Number]" && obj === obj;
}

export default copy;

export function copy(destination, source) {
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

export function isDOMElement(obj) {
  return obj && typeof obj.tagName !== "undefined";
}

export function isUndefined(obj) {
  return typeof obj === "undefined";
}

export function isArray(obj) {
  return getObjectType(obj) === "[object Array]";
}

export function forEach(obj, cb) {
  Object.entries(obj || {}).forEach(([k, v]) => cb(k, v));
}

export function set(obj, path, value) {
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

export function filter(obj, cb) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => cb(k, v) === true),
  );
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function get(obj, path, def) {
  let value = obj;
  for (let i = 0; i < path.length; i++) {
    try {
      value = value[path[i]];
    } catch {
      return def;
    }
  }

  return !isUndefined(value) ? value : def;
}

export function getFilteredKeys (obj, cb) {
  return map(
    filter(
      obj,
      (k, v) => cb(k, v),
    ),
    (k) => k,
  );
}