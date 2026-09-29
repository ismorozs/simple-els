const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;

export function isHTMLString(obj: unknown) {
  return isString(obj) && (obj as string).indexOf("<") === 0;
}

export function isString(obj: unknown) {
  return getObjectType(obj) === "[object String]";
}

export function isFunction(obj: unknown) {
  return getObjectType(obj) === "[object Function]";
}

export function isObject(obj: unknown) {
  return getObjectType(obj) === "[object Object]";
}

function getObjectType(obj: unknown) {
  return Object.prototype.toString.call(obj);
}

export function getParamNames(fn: () => {}) {
  const fnStr = fn.toString().replace(STRIP_COMMENTS, "").split("=>")[0];

  const names = fnStr
    .slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
    .match(ARGUMENT_NAMES);

  if (names === null) {
    return [];
  }

  return names;
}

export function map<T>(
  obj: Record<string, T>,
  cb: (key: string, value: T) => any,
) {
  const res = Object.entries(obj).map(([k, v]) => cb(k, v));
  if (res[0]?.length === 2) {
    return Object.fromEntries(res);
  }

  return res;
}

export function toDashCase(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function toCamelCase(str: string) {
  return str.replace(/-([a-z])/gi, (all, letter) => letter.toUpperCase());
}

export function addEnding(str: string, ending: string, condition: boolean) {
  return `${str}${(condition && ending) || ""}`;
}

export function isNumber(obj: unknown) {
  return getObjectType(obj) === "[object Number]" && obj === obj;
}

export default copy;

export function copy(
  destination: Record<string, unknown>,
  source: Record<string, unknown>,
) {
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
      copy(
        destination[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>,
      );
      continue;
    }

    if (isArray(source[key])) {
      if (!destination[key]) {
        destination[key] = [];
      }
      copyArray(
        destination[key] as Array<unknown>,
        source[key] as Array<unknown>,
      );
      continue;
    }

    if (isDOMElement(source[key])) {
      destination[key] = (source[key] as HTMLElement).cloneNode(true);
      continue;
    }

    destination[key] = source[key];
  }

  return destination;
}

function copyArray(destination: Array<unknown>, source: Array<unknown>) {
  for (let i = 0; i < source.length; i++) {
    if (isObject(source[i])) {
      destination[i] = destination[i] || {};
      copy(
        destination[i] as Record<string, unknown>,
        source[i] as Record<string, unknown>,
      );
      continue;
    }

    if (isArray(source[i])) {
      destination[i] = destination[i] || [];
      copyArray(destination[i] as Array<unknown>, source[i] as Array<unknown>);
      continue;
    }

    destination[i] = source[i];
  }

  return destination;
}

export function isDOMElement(obj: unknown) {
  return !!obj && typeof (obj as HTMLElement).tagName !== "undefined";
}

export function isUndefined(obj: unknown) {
  return typeof obj === "undefined";
}

export function isArray(obj: unknown) {
  return getObjectType(obj) === "[object Array]";
}

export function forEach<T>(
  obj: Record<string, T>,
  cb: (k: string, v: T) => void,
) {
  Object.entries(obj || {}).forEach(([k, v]) => cb(k, v));
}

export function set(
  obj: Record<string, unknown>,
  path: string[],
  value: unknown,
) {
  if (!path.length) {
    if (isObject(value)) {
      return Object.assign(obj, value);
    }
    return (obj = value as Record<string, unknown>);
  }

  let dest = obj;
  for (var i = 0; i < path.length - 1; i++) {
    if (!dest[path[i]]) {
      dest = dest[path[i]] = {};
    } else {
      dest = dest[path[i]] as Record<string, unknown>;
    }
  }

  if (isObject(value)) {
    dest[path[i]] = dest[path[i]] || {};
    Object.assign(dest[path[i]] as Record<string, unknown>, value);
  } else {
    dest[path[i]] = value;
  }

  return obj;
}

export function filter<T>(
  obj: Record<string, T>,
  cb: (k: string, v: T) => boolean,
) {
  return Object.fromEntries(
    Object.entries(obj || {}).filter(([k, v]) => cb(k, v) === true),
  );
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function get(obj: Record<string, unknown>, path: string[], def?: any) {
  let value = obj;
  for (let i = 0; i < path.length; i++) {
    try {
      value = value[path[i]] as Record<string, unknown>;
    } catch {
      return def;
    }
  }

  return !isUndefined(value) ? value : def;
}

export function getFilteredKeys<T>(
  obj: Record<string, T>,
  cb: (k: string, v: T) => boolean,
) {
  return map(
    filter(obj, (k, v) => cb(k, v)),
    (k) => k,
  ) as string[];
}
