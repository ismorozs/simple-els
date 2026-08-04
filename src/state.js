import { applyToMarkup, setupEventListener } from "./html";
import { getParamNames, isObject, isFunction, map, forEach, set, filter } from "./helpers";
import { STATE_BEHAVIOUR_DELIMITER, REACTIVE_TYPES, UTIL_KEYS } from "./consts";

export function prepareStateSettings (stateBehaviour) {
  const state = {};
  forEach(stateBehaviour, (stateKey, userValue) => {
    const [name, type] = splitStateKey(stateKey);

    if (!state[name]) {
      state[name] = {
        [UTIL_KEYS.VALUE]: {},
        [UTIL_KEYS.DEPENDANTS]: {},
        [UTIL_KEYS.ON_CHANGE]: [],
      };
    }

    if (isObject(userValue)) {
      return Object.assign(
        state[name],
        map(userValue, (k, v) => [k, prepareValue(name, k, v, state)]),
      );
    }

    state[name][type] = prepareValue(name, type, userValue, state);
  });

  return state;
}

function splitStateKey(key) {
  const segments = key.split(STATE_BEHAVIOUR_DELIMITER);
  if (segments.length === 1) {
    return [segments[0], UTIL_KEYS.VALUE];
  }

  const name = segments.slice(0, -1).join(STATE_BEHAVIOUR_DELIMITER);
  const type = segments.slice(-1)[0];

  return [name, type];
}

export function updateTemplateMarkup(markupPointers, state) {
  forEach(markupPointers, (name, elData) => {
    forEach(state[name], (type, value) =>
      applyToMarkup(elData, type, value?.value),
    );
  });
}

export function setupComponentMarkup(markupPointers, state, args) {
  const get = getValues.bind(null, state);
  const set = setValues.bind(null, state);
  const onChange = addStateListener.bind(null, state);
  const removeListener = removeStateListener.bind(null, state);

  forEach(markupPointers, (name, elData) => state[name].el = elData);

  setValues(state, args);

  forEach(state, (name, binding) => {
    const { el } = binding;

    if (binding.isComponent) {
      const { template, [UTIL_KEYS.VALUE]: { value, computeFn, dependencies }, isReactive } = binding;
      const result = isReactive ? computeFn.apply(null, getArguments(dependencies, state)) : value;
      const values = Array.isArray(result) ? result : [result];
      
      state[name][UTIL_KEYS.CHILDREN] = values.map((vals) =>
        template(vals, el.el, { isNoShadow: true }),
      );

      return;
    }

    const eventListeners = filter(binding, (type, value) => isEventListener(type, value.value));

    forEach(eventListeners, (event, cb) => setupEventListener(el.el, event, cb.value, { get, set }));
  });

  return { get, set, onChange, removeListener };
}

function prepareValue(name, type, value, state) {
  if (type === UTIL_KEYS.ON_CHANGE) {
    return [value];
  }

  const isReactive = isReactiveFunction(type, value);
  const dependencies = isReactive && getParamNames(value);

  if (dependencies) {
    dependencies.forEach((dependency) => {
      if (!state[dependency][UTIL_KEYS.DEPENDANTS][name]) {
        state[dependency][UTIL_KEYS.DEPENDANTS][name] = [];
      }
      state[dependency][UTIL_KEYS.DEPENDANTS][name].push(type);
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
  return isFunction(value) && REACTIVE_TYPES.includes(type);
}

function isEventListener (type, value) {
  return isFunction(value) && !REACTIVE_TYPES.includes(type);
}

function getArguments(names, state) {
  const values = getValues(state);
  return names.map((name) => values[name]);
}

function getValues(state) {
  return map(state, (k, v) => [k, v[UTIL_KEYS.VALUE]?.value]);
}

function setValues(state, changes) {
  for (let [k, v] of Object.entries(changes)) {
    setValue(k, v, state);
  }
}

function setValue(key, value, state) {
  const realChanges = {};

  const prevValue = state[key][UTIL_KEYS.VALUE].value;

  if (prevValue !== value) {
    state[key][UTIL_KEYS.VALUE].value = value;
    set(realChanges, [key, UTIL_KEYS.VALUE], { newValue: value, prevValue });

    updateDependencies(key, state, realChanges);
  }

  forEach(realChanges, (name, change) => {
    const binding = state[name];
    const { [UTIL_KEYS.MARKUP]: el, [UTIL_KEYS.ON_CHANGE]: listeners, isComponent, children, template } = binding;

    if (isComponent && children) {
      const values = change[UTIL_KEYS.VALUE].newValue;
      values.forEach((value, i) => {
        if (!children[i]) {
          return children.push(template(value, el.el, { isNoShadow: true }));
        }
        children[i].set(value);
      });
      for (let i = values.length; i < children.length; i++) {
        children[i].destroy();
        children.splice(i, 1);
      }
      return;
    }

    forEach(change, (type, value) => {
      applyToMarkup(el, type, value.newValue);

      if (type === UTIL_KEYS.VALUE) {
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
  const dependants = state[key][UTIL_KEYS.DEPENDANTS];

  for (let [dependant, types] of Object.entries(dependants)) {
    types.forEach((type) => {
      const { computeFn, dependencies } = state[dependant][type];
      const prevValue = state[dependant][type].value;
      const newValue = computeFn.apply(null, getArguments(dependencies, state));

      if (prevValue !== newValue) {
        state[dependant][type].value = newValue;
        set(realChanges, [dependant, type], { newValue, prevValue });

        if (type === UTIL_KEYS.VALUE) {
          updateDependencies(dependant, state, realChanges);
        }
      }
    })
  }
}

function addStateListener (state, keys, cb) {
  keys.forEach((key) => state[key][UTIL_KEYS.ON_CHANGE].push(cb));
}

function removeStateListener (state, keys, removeCb) {
  keys.forEach((key) => {
    const listeners = state[key][UTIL_KEYS.ON_CHANGE];
    const removeIdx = listeners.findIndex((cb) => cb === removeCb);
    listeners.splice(removeIdx, 1);
  });
}
