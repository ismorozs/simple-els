import {
  prepareStateSettings,
  updateTemplateMarkup,
  setupComponentMarkup,
  getValues,
} from "./state";
import { addChildMarkup, cloneHTMLMarkup, gatherBindings } from "./html";
import { prepareStyles } from "./styles";
import { isObject, copy, isFunction, map, uid } from "./helpers";
import { combineState, combineTemplates } from "./combine";
import { runStateChangeListeners } from "./lifecycle";

function createTemplate(
  markupStr: string | ICombineComponentsFunction,
  stateBehaviour: IUserStateBehavior,
  styleSheets: string,
  parentId: string,
) {
  const id = parentId || uid();
  const [markup, childrenState] = isFunction(markupStr)
    ? combineTemplates(markupStr as ICombineComponentsFunction, id)
    : [cloneHTMLMarkup(markupStr as string), {} as Record<string, IBinding>];

  const [state, styles] = isObject(stateBehaviour)
    ? [prepareStateSettings(stateBehaviour), prepareStyles(id, styleSheets)]
    : [{} as IState, prepareStyles(id, stateBehaviour as unknown as string)];

  const isStateless = !Object.keys(state).length || !!parentId;

  combineState(state, childrenState);

  const boundElements = gatherBindings(markup as Element, id, true);
  updateTemplateMarkup(boundElements, state);

  const allStyles = map(childrenState, (_, v) => v)
    .map((v: IBinding) => v.createComponent?.styles)
    .reduce(
      (allStyles: CSSStyleSheet[], styles: CSSStyleSheet) =>
        allStyles.concat(styles),
      [],
    )
    .concat(styles);

  const template: ITemplate = {
    id,
    markup,
    state,
    styles: allStyles,
    isStateless,
    isAnonymous: isStateless,
  };

  return Object.assign(
    (
      stateValues: IStateChangeArgs,
      target: HTMLElement,
      options: IComponentCreateOptions,
    ) => createComponent(template, stateValues, target, options),
    {
      ...template,
      asPopup: (options: IComponentCreateOptions) =>
        createComponent(template, {}, document.body, {
          ...options,
          isPopup: true,
        }),
    },
  );
}

function createComponent(
  template: ITemplate,
  stateValues: IStateChangeArgs,
  target: Element,
  options: IComponentCreateOptions = {},
) {
  if (template.isStateless) {
    copy(template.state, prepareStateSettings(stateValues, true));
    template.isStateless = false;
  }

  const markup = template.markup?.cloneNode(true) as Element;
  const state = copy({}, template.state) as IState;
  state.parentState = options.parentState;
  state.parentBinding = options.parentBinding;
  state.el = markup;

  const boundElements = gatherBindings(markup, template.id);
  const api =
    state &&
    setupComponentMarkup(
      boundElements,
      state,
      template.isAnonymous
        ? getValues(prepareStateSettings(stateValues))
        : stateValues,
    );

  const component = { api, ...template, markup, state };

  if (target) {
    return append(target, component, options);
  }
}

export function append(
  parentNode: Element,
  component: IComponentWithState,
  options: IComponentCreateOptions = {},
) {
  addChildMarkup(parentNode, component, options);

  const { state } = component;
  state.isRendered = true;

  return runStateChangeListeners(true, state);
}

export default createTemplate;
