import { applyToMarkup, setupEventListener, removeChildMarkup } from "./html";
import { getParamNames, isObject, isFunction, map, forEach, set, get, filter, toCamelCase, getFilteredKeys } from "./helpers";
import { STATE_BEHAVIOUR_DELIMITER, REACTIVE_TYPES, UTIL_KEYS, NOT_BINDING_PREFIX, DESTROY_OP, EMPTY_FN, CHILDREN_LIST_OPERATIONS } from "./consts";
import { runStateChangeListeners } from "./lifecycle";

export function prepareStateSettings (stateBehaviour) {
  const state = {
    [UTIL_KEYS.ON_MESSAGE_COMPONENT]: stateBehaviour[UTIL_KEYS.ON_MESSAGE] || EMPTY_FN,
    [UTIL_KEYS.ON_CHANGE_COMPONENT]: stateBehaviour[UTIL_KEYS.ON_CHANGE] || EMPTY_FN,
  };
  map(UTIL_KEYS, (_, v) => v).forEach((v) => delete stateBehaviour[v]);

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
    forEach(state[toCamelCase(name)], (type, value) =>
      applyToMarkup(elData, type, value?.value),
    );
  });
}

export function setupComponentMarkup(markupPointers, state, args) {
  forEach(
    markupPointers,
    (name, elData) => (set(state, [toCamelCase(name), UTIL_KEYS.MARKUP], elData))
  );

  setValues(state, args);

  forEach(
    filter(state, (k) => !k.startsWith(NOT_BINDING_PREFIX)),
    (name, binding) => {
      const { [UTIL_KEYS.MARKUP]: el, [UTIL_KEYS.IS_RENDERED]: isRendered, [UTIL_KEYS.VALUE]: value } = binding;

      if (binding.createComponent) {
        if (!isRendered) {
          const childrenApi = createChildrenApi(binding);
          const diffs = getChildrenDifference(value.value, []);
          for (let operation of CHILDREN_LIST_OPERATIONS) {
            diffs[operation].forEach((val) =>
              childrenApi[operation].apply(null, val),
            );
          }
        }

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
      if (!get(state, [dependency, UTIL_KEYS.DEPENDANTS, name])) {
        set(state, [dependency, UTIL_KEYS.DEPENDANTS, name], []);
      }
      state[dependency][UTIL_KEYS.DEPENDANTS][name].push(type);
    });
  }

  return {
    value: isReactive ? value(...getArguments(dependencies, state)) : value,
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

export function getArguments(names, state) {
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
  const realChanges = {};

  for (let [k, v] of Object.entries(changes)) {
    setValue(k, v, state, realChanges, changes);
  }

  if (Object.keys(realChanges).length) {
    updateComponentAfterChange(state, realChanges);
  }
}

function setValue(key, value, state, realChanges, changes) {
  const prevValue = get(state, [key, UTIL_KEYS.VALUE, 'value']);

  if (prevValue !== value) {
    set(state, [key, UTIL_KEYS.VALUE, 'value'], value);
    set(realChanges, [key, UTIL_KEYS.VALUE], { newValue: value, prevValue });

    updateDependencies(key, state, realChanges, changes);
  } else {
    set(realChanges, [key, UTIL_KEYS.VALUE], { [UTIL_KEYS.IS_SAME_VALUE]: true });
  }
}

function updateDependencies(key, state, realChanges, changes) {
  const dependants = get(state, [key, UTIL_KEYS.DEPENDANTS], {});

  for (let [dependant, types] of Object.entries(dependants)) {
    types.forEach((type) => {
      const { computeFn, dependencies } = state[dependant][type];
      const realChangesKeys = getFilteredKeys(realChanges, (k, v) => !!v[UTIL_KEYS.VALUE]);
      const changesKeys = Object.keys(changes);
      const isUpdated = get(realChanges, [dependant, type]);

      if (!dependencies.every((name) =>
        changesKeys.includes(name) && realChangesKeys.includes(name) || !changesKeys.includes(name)
      ) || isUpdated) {
        return;
      }

      const prevValue = state[dependant][type].value;
      const newValue = computeFn(...getArguments(dependencies, state));

      if (prevValue !== newValue) {
        state[dependant][type].value = newValue;
        set(realChanges, [dependant, type], { newValue, prevValue });

        if (type === UTIL_KEYS.VALUE) {
          updateDependencies(dependant, state, realChanges, changes);
        }
      }
    })
  }
}

function updateComponentAfterChange (state, realChanges) {
  forEach(realChanges, (name, change) => {
    const binding = state[name];
    const { [UTIL_KEYS.MARKUP]: el, [UTIL_KEYS.CHILDREN]: children } = binding;

    if (children) {
      const { newValue, prevValue } = change[UTIL_KEYS.VALUE];
      const childrenApi = createChildrenApi(binding);
      const diffs = getChildrenDifference(newValue, prevValue);

      for (let operation of CHILDREN_LIST_OPERATIONS) {
        const values = diffs[operation];
        values.forEach((val) => {
          if (operation === DESTROY_OP && children.length) {
            runStateChangeListeners(false, children[val[0]].state);
          }
          childrenApi[operation].apply(null, val);
        });
      }
      binding[UTIL_KEYS.IS_RENDERED] = true;
      return;
    }

    forEach(change, (type, value) => applyToMarkup(el, type, value.newValue));
  });

  const changedKeys = getFilteredKeys(
    realChanges,
    (k, v) =>
      !!v[UTIL_KEYS.VALUE] &&
      !v[UTIL_KEYS.VALUE][UTIL_KEYS.IS_SAME_VALUE] &&
      !state[k][UTIL_KEYS.CHILDREN],
  );
  state[UTIL_KEYS.IS_RENDERED_COMPONENT] && changedKeys.length && runStateChangeListeners(changedKeys, state);
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
        ...createChildrenApi(childrenData, true),
      },
    );

    parent = parent[UTIL_KEYS.PARENT_STATE];
  }
}

export function createStateApi (state) {
  return {
    get: getValues.bind(null, state),
    set: setValues.bind(null, state),
    children: getStateChildren.bind(null, state),
    send: sendMessage.bind(null, state),
    onChange: addStateListener.bind(null, state),
    removeListener: removeStateListener.bind(null, state),
    [DESTROY_OP]: removeChildMarkup.bind(null, state),
    markup: getComponentMarkups(state),
    state,
  }
}

export function getStateBindings (state) {
  return filter(
    state,
    (k, v) => !!v?.[UTIL_KEYS.VALUE] && !v?.[UTIL_KEYS.CHILDREN],
  );
}

function getComponentMarkups (state) {
  return map(
    filter(
      state,
      (k, v) => !!v?.[UTIL_KEYS.MARKUP]?.el && !v?.[UTIL_KEYS.CHILDREN],
    ),
    (k, v) => [k, v?.[UTIL_KEYS.MARKUP]?.el],
  );
}

function createChildrenApi (childrenBinding, isManualUse) {
  const { createComponent, [UTIL_KEYS.PARENT_STATE]: parentState, [UTIL_KEYS.CHILDREN]: children, [UTIL_KEYS.VALUE]: value } = childrenBinding;

  const create = (value, nextNode, isFirst) => {
    const { [UTIL_KEYS.MARKUP]: el } = childrenBinding;

    const componentApi = createComponent(value, el.el.parentNode, {
      isNoShadow: true,
      placeholder: isFirst && el.el,
      nextNode,
      [UTIL_KEYS.CHILDREN_DATA]: childrenBinding,
      [UTIL_KEYS.PARENT_STATE]: parentState,
    });

    if (isFirst) {
      el.el = componentApi.state[UTIL_KEYS.MARKUP_COMPONENT];
    }

    return componentApi;
  };

  return {
    [DESTROY_OP]: (idx) => {
      children[idx][DESTROY_OP](idx);
      children.splice(idx, 1);
      if (isManualUse) {
        value.value.splice(idx, 1);
      }
    },
    push: (value) => {
      const nextNode =
        children.length && children[children.length - 1].state[
          UTIL_KEYS.MARKUP_COMPONENT
        ].nextSibling;
      children.push(create(value, nextNode, !children.length));
      if (isManualUse) {
        value.value.push(value);
      }
    },
    insert: (value, idx = 0) => {
      const nextNode = children[idx].state[UTIL_KEYS.MARKUP_COMPONENT];
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
  return map(filter(state, (k, v) => !!v?.[UTIL_KEYS.CHILDREN]), (k, v) => [k, createChildrenApi(v)]);
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

  return { [DESTROY_OP]: destroy, set, insert, push };
}