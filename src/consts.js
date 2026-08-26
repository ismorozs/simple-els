export const STATE_BEHAVIOUR_DELIMITER = "_";
export const NOT_BINDING_PREFIX = " ";
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
  IS_RENDERED: "isRendered",
  ON_MESSAGE: "onMessage",
  ON_MESSAGE_COMPONENT: NOT_BINDING_PREFIX + "onMessage",
  PARENT_STATE: NOT_BINDING_PREFIX + "parentState",
  ON_CHANGE_COMPONENT: NOT_BINDING_PREFIX + "onChange",
  CHILDREN_DATA: NOT_BINDING_PREFIX + "childrenData",
  MARKUP_COMPONENT: NOT_BINDING_PREFIX + "el",
  IS_RENDERED_COMPONENT: NOT_BINDING_PREFIX + "isRendered",
  IS_SAME_VALUE: "isSame",
};

export const COMPONENT_PREFIX = "component";
export const DESTROY_OP = "destroy";

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

export const EMPTY_FN = () => {};

export const CHILDREN_LIST_OPERATIONS = [DESTROY_OP, "set", "insert", "push"];