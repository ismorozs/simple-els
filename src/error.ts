import { UTIL_KEYS } from "./consts";
import { map } from "./helpers";

export function throwIllegalBindingNameError(name: string) {
  throwError(
    `Binding @${name} can't be added in the markup, because this name is reserved by the library.\nOther reserved names: ${map(UTIL_KEYS, (_: any, v: string) => v)}`,
  );
}

export function throwNoDeclaredDependencyError(
  name: string,
  dependant: string,
) {
  throwError(
    `Dependency '${name}' is used for '${dependant}', but is not declared as a state value of the component.`,
  );
}

function throwError(text: string) {
  throw new Error(text);
}
