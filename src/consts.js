export const STATE_BEHAVIOUR_DELIMITER = "_";
export const BINDING_SIGN = {
  BEHAVIOR: "@",
  CLASS: ".",
  COMPONENT: "&",
};
export const UTIL_KEYS = {
  VALUE: STATE_BEHAVIOUR_DELIMITER,
  DEPENDENCIES: "dependencies",
  DEPENDANTS: "dependants",
  ON_CHANGE: "onChange",
  LISTENERS: "listeners",
  MARKUP: "el",
  EVENT_LISTENERS: "eventListeners",
  CHILDREN: "children",
  TEMPLATE: "template",
};

export const COMPONENT_PREFIX = "component";

export const REACTIVE_TYPES = [
  "html",
  "value",
  "style",
  "text",
  "attrs",
  "class",
  "onChange",
  UTIL_KEYS.VALUE,
];

export const DEFAULT_CONTAINER = "div";
