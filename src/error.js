import { UTIL_KEYS } from "./consts";
import { map } from "./helpers";

export function throwIllegalBindingNameError (name) {
  throwError(
    `Binding @${name} can't be added in the markup, because this name is reserved by the library.\nOther reserved names: ${map(UTIL_KEYS, (_, v) => v)}`,
  );
}

export function throwNoDeclaredDependencyError (name, dependant) {
  throwError(
    `Dependency '${name}' is used for '${dependant}', but is not declared as a state value of the component.`,
  );
}

function throwError (text) {
  throw new Error (text)
}