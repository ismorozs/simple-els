import { applyToMarkup, setupEventListener, removeChildMarkup } from "./html";
import {
  getParamNames,
  isObject,
  isFunction,
  map,
  forEach,
  set,
  get,
  filter,
  toCamelCase,
  getFilteredKeys,
} from "./helpers";
import {
  STATE_BEHAVIOUR_DELIMITER,
  REACTIVE_TYPES,
  UTIL_KEYS,
  DESTROY_OP,
  EMPTY_FN,
  CHILDREN_LIST_OPERATIONS,
  NO_EVENT_TYPES,
} from "./consts";
import { runStateChangeListeners } from "./lifecycle";

export function prepareStateSettings(
  stateBehaviour: IUserStateBehavior = {},
  noValues?: boolean,
) {
  const state: IState = {
    onMessage: stateBehaviour.onMessage || EMPTY_FN,
    onChange: stateBehaviour.onChange || EMPTY_FN,
    bindings: {},
  };
  map(UTIL_KEYS, (_, v) => v).forEach(
    (v: string) => delete stateBehaviour[v as keyof IUserStateBehavior],
  );

  forEach(stateBehaviour, (stateKey, userValue) => {
    const [name, type] = splitStateKey(stateKey);

    if (!state.bindings[name]) {
      state.bindings[name] = {
        values: { [UTIL_KEYS.VALUE]: {} as IValue },
        children: [],
        el: {} as IMarkupPointer,
        isFastApply: !type && !isObject(userValue),
        dependants: {},
      };
    }

    const binding = state.bindings[name];

    if (isObject(userValue)) {
      return forEach(userValue as IUserBindingBehavior, (type, value) => {
        binding.values[type] = prepareValue(name, type, value, state, noValues);
      });
    }

    binding.values[type || UTIL_KEYS.VALUE] = prepareValue(
      name,
      type,
      userValue,
      state,
      noValues,
    );
  });

  return state;
}

function splitStateKey(key: string) {
  const segments = key.split(STATE_BEHAVIOUR_DELIMITER);
  if (segments.length === 1) {
    return [segments[0]];
  }

  const name = segments.slice(0, -1).join(STATE_BEHAVIOUR_DELIMITER);
  const type = segments.slice(-1)[0];

  return [name, type];
}

export function updateTemplateMarkup(
  markupPointers: IMarkupPointers,
  state: IState,
) {
  forEach(markupPointers, (name, elData) => {
    const binding = state.bindings[toCamelCase(name)];
    elData.isFastApply = binding?.isFastApply;
    binding &&
      forEach(binding.values, (type, value) =>
        applyToMarkup(elData, type, value?.value),
      );
  });
}

export function setupComponentMarkup(
  markupPointers: IMarkupPointers,
  state: IState,
  args: IStateChangeArgs,
) {
  forEach(markupPointers, (name, elData) => {
    const binding = state.bindings[toCamelCase(name)];
    elData.isFastApply = !binding || binding?.isFastApply;
    set(state.bindings, [toCamelCase(name), UTIL_KEYS.MARKUP], elData);
  });

  setValues(state, args);

  forEach(state.bindings, (name, binding) => {
    const { isParent, el, isRendered, values } = binding;
    const { [UTIL_KEYS.VALUE]: value } = values || {};

    if (isParent) {
      if (!isRendered) {
        const childrenApi = createChildrenApi(binding);
        const diffs = getChildrenDifference(value.value, []);
        for (let operation of CHILDREN_LIST_OPERATIONS) {
          diffs[operation as keyof typeof diffs].forEach((val) => {
            childrenApi[operation as keyof typeof diffs].apply(null, [val]);
          });
        }

        updateAnonymousChildren(state);
      }

      binding.parentState = state;
      return;
    }

    const eventListeners = filter(binding.values, (type, value) =>
      isEventListener(type, value.value),
    );
    forEach(eventListeners, (event, cb) =>
      setupEventListener(
        el?.el as HTMLElement,
        event,
        cb.value,
        createStateApi(state),
      ),
    );
  });

  return createStateApi(state);
}

function prepareValue(
  name: string,
  type: string,
  value: any,
  state: IState,
  noValues?: boolean,
): IValue {
  const isReactive = isReactiveFunction(type, value);
  const dependencies = isReactive ? getParamNames(value) : [];

  if (dependencies) {
    dependencies.forEach((dependency) => {
      if (!get(state.bindings, [dependency, UTIL_KEYS.DEPENDANTS, name])) {
        set(state.bindings, [dependency, UTIL_KEYS.DEPENDANTS, name], []);
      }
      state.bindings[dependency].dependants[name].push(type || UTIL_KEYS.VALUE);
    });
  }

  const computeFn =
    isReactive &&
    function (dependencies: string[], state: IState) {
      return value.apply(null, getArguments(dependencies, state));
    };

  return {
    value: !noValues
      ? isReactive
        ? (computeFn as IComputeFunction)(dependencies as string[], state)
        : value
      : undefined,
    computeFn,
    dependencies,
  };
}

function isReactiveFunction(type: string, value: unknown) {
  return isFunction(value) && REACTIVE_TYPES.includes(type);
}

function isEventListener(type: string, value: unknown) {
  return isFunction(value) && !NO_EVENT_TYPES.includes(type);
}

export function getArguments(names: string[], state: IState) {
  const values = getValues(state);
  return names.map((name) => values[name as keyof typeof values]);
}

export function getValues(state: IState) {
  return map(getStateBindings(state), (k, v) => [
    k,
    v.values._?.value,
  ]) as Record<string, any>;
}

function setValues(state: IState, changes: Record<string, any>) {
  const realChanges: IComponentChanges = {};

  for (let [k, v] of Object.entries(changes)) {
    setValue(k, v, state, realChanges, changes);
  }

  updateComponentAfterChange(state, realChanges);
}

function setValue(
  key: string,
  value: any,
  state: IState,
  realChanges: IComponentChanges,
  changes: Record<string, any>,
) {
  const prevValue = get(state.bindings, [
    key,
    UTIL_KEYS.VALUES,
    UTIL_KEYS.VALUE,
    "value",
  ]);

  if (prevValue !== value) {
    set(
      state.bindings,
      [key, UTIL_KEYS.VALUES, UTIL_KEYS.VALUE, "value"],
      value,
    );
    set(realChanges, [key, UTIL_KEYS.VALUE], { newValue: value, prevValue });
  } else {
    set(realChanges, [key, UTIL_KEYS.VALUE], { isSame: true });
  }

  updateDependencies(key, state, realChanges, changes);
}

function updateDependencies(
  key: string,
  state: IState,
  realChanges: IComponentChanges,
  changes: Record<string, any>,
) {
  const dependants = get(
    state.bindings,
    [key, UTIL_KEYS.DEPENDANTS],
    {},
  ) as IBindingDependants;

  for (let [dependant, types] of Object.entries(dependants)) {
    types.forEach((type) => {
      const dependantBindingValue = state.bindings[dependant].values[type];
      const { computeFn, dependencies } = dependantBindingValue;
      const realChangesKeys = getFilteredKeys(
        realChanges,
        (k, v) => !!v[UTIL_KEYS.VALUE],
      );
      const changesKeys = Object.keys(changes);
      const isUpdated = get(realChanges, [dependant, type]);

      if (
        !dependencies.every(
          (name) =>
            (changesKeys.includes(name) && realChangesKeys.includes(name)) ||
            !changesKeys.includes(name),
        ) ||
        isUpdated
      ) {
        return;
      }

      const prevValue = dependantBindingValue.value;
      const newValue = (computeFn as IComputeFunction)(dependencies, state);

      if (prevValue !== newValue) {
        dependantBindingValue.value = newValue;
        set(realChanges, [dependant, type], { newValue, prevValue });

        if (type === UTIL_KEYS.VALUE) {
          updateDependencies(dependant, state, realChanges, changes);
        }
      }
    });
  }
}

function updateComponentAfterChange(
  state: IState,
  realChanges: IComponentChanges,
) {
  forEach(realChanges, (name, change) => {
    const binding = state.bindings[name];
    const { el, children, isParent } = binding;

    if (isParent) {
      const { newValue, prevValue } = change[UTIL_KEYS.VALUE];
      const childrenApi = createChildrenApi(binding);
      const diffs = getChildrenDifference(newValue, prevValue);

      for (let operation of CHILDREN_LIST_OPERATIONS) {
        const values = diffs[operation as keyof typeof diffs];
        values.forEach((val) => {
          if (operation === DESTROY_OP && children.length) {
            runStateChangeListeners(false, children[val.index].state);
          }
          childrenApi[operation as keyof typeof diffs].apply(null, [val]);
        });
      }

      binding.isRendered = true;
      return;
    }

    forEach(
      change,
      (type, value) => !value.isSame && applyToMarkup(el, type, value.newValue),
    );
  });

  updateAnonymousChildren(state);

  const changedKeys = getFilteredKeys(
    realChanges,
    (k, v) =>
      !!v[UTIL_KEYS.VALUE] &&
      !v[UTIL_KEYS.VALUE].isSame &&
      !state.bindings[k].isParent,
  );
  state.isRendered &&
    changedKeys.length &&
    runStateChangeListeners(changedKeys, state);
}

function sendMessage(state: IState, data: any) {
  let parent = state.parentState;
  const parentBinding = state.parentBinding as IBinding;
  const index = parentBinding.children.findIndex((api) => api.state === state);
  const stop = () => (parent = {} as IState);

  while (parent) {
    parent.onMessage(
      data,
      {
        stop,
        ...createStateApi(parent),
      },
      {
        index,
        ...createChildrenApi(parentBinding, true),
      },
    );

    parent = parent.parentState;
  }
}

export function createStateApi(state: IState): IStateAPI {
  return {
    get: getValues.bind(null, state),
    set: setValues.bind(null, state),
    send: sendMessage.bind(null, state),
    children: getStateChildren.bind(null, state),
    [DESTROY_OP]: removeChildMarkup.bind(null, state),
    markup: getComponentMarkups(state),
    state,
  };
}

export function getStateBindings(state: IState) {
  return filter(
    state.bindings,
    (k, v) => !!v?.values?.[UTIL_KEYS.VALUE] && !v?.isParent,
  ) as Record<string, IBinding>;
}

function getStateChildren(state: IState) {
  return map(
    filter(state.bindings, (k, v) => !!v?.isParent),
    (k, v) => [k, createChildrenApi(v)],
  );
}

function getComponentMarkups(state: IState) {
  return map(
    filter(state.bindings, (k, v) => !!v?.el?.el && !v?.isParent),
    (k, v) => [k, v?.el?.el],
  ) as Record<string, HTMLElement>;
}

export function createChildrenApi(
  parentBinding: IBinding,
  isManualUse?: boolean,
) {
  const {
    createComponent,
    parentState,
    children,
    values: { [UTIL_KEYS.VALUE]: value },
  } = parentBinding;

  const create = (
    value: IStateChangeArgs,
    nextNode: HTMLElement,
    isFirst?: boolean,
  ) => {
    const { el } = parentBinding;

    const componentApi = createComponent?.(
      value,
      el?.el.parentNode as HTMLElement,
      {
        isNoShadow: true,
        placeholder: isFirst && el?.el,
        nextNode,
        parentBinding,
        parentState,
      },
    ) as IStateAPI;

    if (isFirst && el) {
      el.el = componentApi?.state.el as Node;
    }

    return componentApi;
  };

  return {
    [DESTROY_OP]: ({ index }: IChildrenAPIArgs) => {
      children[index][DESTROY_OP](index);
      children.splice(index, 1);
      if (isManualUse) {
        value.value.splice(index, 1);
      }
    },
    push: ({ values }: IChildrenAPIArgs) => {
      const nextNode =
        children &&
        children.length &&
        children[children.length - 1].state.el?.nextSibling;

      children.push(create(values, nextNode as HTMLElement, !children.length));
      if (isManualUse) {
        value.value.push(values);
      }
    },
    insert: ({ values, index = 0 }: IChildrenAPIArgs) => {
      const nextNode = children[index].state.el;
      children.splice(index, 0, create(values, nextNode as HTMLElement));
      if (isManualUse) {
        value.value.splice(index, 0, value);
      }
    },
    set: ({ values, index }: IChildrenAPIArgs) => {
      if (index || index === 0) {
        return children[index].set(
          createComponent?.isAnonymous
            ? getValues(prepareStateSettings(values))
            : values,
        );
      }
    },
    get: (index: number) => {
      if (index || index === 0) {
        return children[index].get();
      }

      return children.map(({ get }) => get());
    },
    forEach: (cb: (child: IStateAPI) => void) => children.forEach(cb),
  };
}

function getChildrenDifference(
  news: [IStateChangeArgs, string][],
  prevs: [IStateChangeArgs, string][],
) {
  const destroy: IChildrenAPIArgs[] = [];
  const set: IChildrenAPIArgs[] = [];
  const insert: IChildrenAPIArgs[] = [];
  const push: IChildrenAPIArgs[] = [];
  const newsInPrevs: Record<number, number> = {};
  const foundSameUids: Record<string, number> = {};

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
    } else {
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
    } else if (nextPos >= prevs.length + newCount) {
      push.push({ values: neww, index: i });
    } else {
      insert.push({ values: neww, index: nextPos });
      nextPos++;
      newCount++;
    }
  });

  return { [DESTROY_OP]: destroy, set, insert, push };
}

function updateAnonymousChildren(state: IState) {
  forEach(state.bindings, (_, childrenBinding) => {
    if (childrenBinding?.isAnonymous) {
      const childrenApi = createChildrenApi(childrenBinding);
      childrenApi.forEach(({ set }) => set(getValues(state)));
    }
  });
}
