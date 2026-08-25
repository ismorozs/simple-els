import { UTIL_KEYS } from "./consts";
import { map } from "./helpers";

export function throwIllegalBindingNameError (name) {
  throwError(
    `Binding @${name} can't be added in the markup, because this name is reserved by the library.\nOther reserved names: ${map(UTIL_KEYS, (_, v) => v)}`,
  );
}

function throwError (text) {
  throw new Error (text)
}