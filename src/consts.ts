export const STATE_BEHAVIOUR_DELIMITER = "_";

export const BINDING_SIGN = {
  BEHAVIOR: "@",
  CLASS: ".",
  COMPONENT: "&",
};

export const UTIL_KEYS = {
  VALUE: STATE_BEHAVIOUR_DELIMITER,
  DEPENDANTS: "dependants",
  CHILDREN: "children",
  VALUES: "values",
  MARKUP: "el",
  ON_MESSAGE: "onMessage",
  ON_CHANGE: "onChange",
};

export const DESTROY_OP = "destroy";

export const REACTIVE_TYPES = [
  "html",
  "value",
  "style",
  "text",
  "attrs",
  "class",
  UTIL_KEYS.VALUE,
  undefined,
];

export const NO_EVENT_TYPES = REACTIVE_TYPES.concat([UTIL_KEYS.ON_CHANGE]);

export const EMPTY_FN = () => {};

export const CHILDREN_LIST_OPERATIONS = [DESTROY_OP, "set", "insert", "push"];

export const FORM_TAGS = ["INPUT", "SELECT", "TEXTAREA"];
