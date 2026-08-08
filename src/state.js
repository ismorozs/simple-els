import { applyToMarkup, setupEventListener } from "./html";
import { getParamNames, isObject, isFunction, map, forEach, set, filter, capitalize } from "./helpers";
import { STATE_BEHAVIOUR_DELIMITER, REACTIVE_TYPES, UTIL_KEYS, NOT_BINDING_PREFIX } from "./consts";

export function prepareStateSettings (stateBehaviour) {
  const state = {
    [UTIL_KEYS.ON_MESSAGE_COMPONENT]: stateBehaviour[UTIL_KEYS.ON_MESSAGE] || (() => {}),
    [UTIL_KEYS.ON_CHANGE_COMPONENT]: stateBehaviour[UTIL_KEYS.ON_CHANGE] || (() => {}),
  };
  delete stateBehaviour[UTIL_KEYS.ON_MESSAGE];
  delete stateBehaviour[UTIL_KEYS.ON_CHANGE];
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
      return forEach(userValue, (type, value) => {
        state[name][type] = prepareValue(name, type, value, state);
      });
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
  forEach(markupPointers, (name, elData) => state[name].el = elData);

  setValues(state, args);

  forEach(getStateBindings(state), (name, binding) => {
    const { el } = binding;

    if (binding.template) {
      binding[UTIL_KEYS.PARENT_STATE] = state;
      return;
    }

    const eventListeners = filter(binding, (type, value) => isEventListener(type, value.value));
    forEach(eventListeners, (event, cb) => setupEventListener(el.el, event, cb.value, createStateApi(state)));
  });

  return createStateApi(state);
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
      (isReactive && value(...getArguments(dependencies, state))) ||
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
  return map(
    getStateBindings(state),
    (k, v) => [k, v[UTIL_KEYS.VALUE]?.value],
  );
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
    const { [UTIL_KEYS.MARKUP]: el, [UTIL_KEYS.ON_CHANGE]: listeners, children, template } = binding;

    if (template && children) {
      const values = change[UTIL_KEYS.VALUE].newValue;
      const childrenApi = createChildrenApi(binding);
      values.forEach((value, idx) => {
        if (!children[idx]) {
          return childrenApi.push(value);
        }
        childrenApi.set(value, idx);
      });
      for (let i = values.length; i < children.length; i++) {
        childrenApi.destroy(i);
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
            createStateApi(state),
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
      const newValue = computeFn(...getArguments(dependencies, state));

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

function sendMessage (state, data) {
  let parent = state[UTIL_KEYS.PARENT_STATE];
  const childrenData = state[UTIL_KEYS.CHILDREN_DATA];
  const index = childrenData.children.findIndex((api) => api.state === state);
  const stop = () => parent = {};

  while (parent) {
    parent[UTIL_KEYS.ON_MESSAGE_COMPONENT](
      data,
      {
        stop,
        ...createStateApi(parent),
      },
      {
        index,
        ...createChildrenApi(childrenData),
      },
    );

    parent = parent[UTIL_KEYS.PARENT_STATE];
  }
}

function createStateApi (state) {
  return {
    get: getValues.bind(null, state),
    set: setValues.bind(null, state),
    children: getStateChildren.bind(null, state),
    send: sendMessage.bind(null, state),
    onChange: addStateListener.bind(null, state),
    removeListener: removeStateListener.bind(null, state),
  }
}

function getStateBindings (state) {
  return filter(state, (k, v) => !k.startsWith(NOT_BINDING_PREFIX));
}

function createChildrenApi (childrenBinding) {
  const { el, template, [UTIL_KEYS.PARENT_STATE]: parentState } = childrenBinding;

  const createComponent = (value) =>
    template(value, el.el, {
      isNoShadow: true,
      [UTIL_KEYS.CHILDREN_DATA]: childrenBinding,
      [UTIL_KEYS.PARENT_STATE]: parentState,
    });

  return {
    destroy: (idx) => {
      const children = childrenBinding[UTIL_KEYS.CHILDREN];
      children[idx].destroy();
      children.splice(idx, 1);
    },
    push: (value) => {
      const children = childrenBinding[UTIL_KEYS.CHILDREN];
      const idx = children.length;
      children.push(createComponent(value));
    },
    set: (values, idx) => {
      const children = childrenBinding[UTIL_KEYS.CHILDREN];

      if (idx || idx === 0) {
        return children[idx].set(values);
      }

      children.forEach(({ set }) => set(values));
    },
    get: (idx) => {
      const children = childrenBinding[UTIL_KEYS.CHILDREN];
      if (idx || idx === 0) {
        return children[idx].get();
      }

      return children.map(({ get }) => get());
    },
    forEach: (cb) => childrenBinding[UTIL_KEYS.CHILDREN].forEach(cb),
    filter: (cb) => childrenBinding[UTIL_KEYS.CHILDREN].filter(({ get }) => !!cb(get())),
  };
}

function getStateChildren (state, name) {
  return map(filter(state, (k, v) => !!v?.[UTIL_KEYS.CHILDREN]), (k, v) => [k, createChildrenApi(v)]);
}