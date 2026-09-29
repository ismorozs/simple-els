import { isArray, forEach } from "./helpers";
import { getStateBindings, createStateApi } from "./state";

export function runStateChangeListeners(
  changes: string[] | boolean,
  state: IState,
) {
  const { onChange, el } = state;

  const bindings = getStateBindings(state);
  const componentApi = createStateApi(state);
  forEach(bindings, (name, binding) => {
    if (isArray(changes) && !(changes as string[]).includes(name)) {
      return;
    }

    const change = isArray(changes) ? [name] : changes;
    binding?.values?.onChange?.value?.(change, componentApi, binding.el?.el);
  });

  onChange(changes, componentApi, el);

  return componentApi;
}
