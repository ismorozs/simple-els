import { UTIL_KEYS } from "./consts";
import { isArray, forEach } from "./helpers";
import { getStateBindings, createStateApi } from "./state";

export function runStateChangeListeners (changes, state) {
  const { [UTIL_KEYS.ON_CHANGE_COMPONENT]: onChangeComponent, [UTIL_KEYS.MARKUP_COMPONENT]: markup } = state;

  const bindings = getStateBindings(state);
  const componentApi = createStateApi(state);
  forEach(
    bindings,
    (name, { [UTIL_KEYS.ON_CHANGE]: listeners, [UTIL_KEYS.MARKUP]: el }) => {
      if (isArray(changes) && !changes.includes(name)) {
        return;
      }

      const change = isArray(changes) ? [name] : changes;
      listeners.forEach((cb) => cb(change, componentApi, el?.el));
    },
  );
  onChangeComponent(changes, componentApi, markup);

  return componentApi;
}