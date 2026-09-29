import { BINDING_SIGN, UTIL_KEYS } from "./consts";
import { getArguments } from "./state";
import { forEach, getParamNames, isFunction, isArray, set } from "./helpers";
import { cloneHTMLMarkup } from "./html";
import createTemplate from "./index";

export function combineTemplates(
  combineCb: ICombineComponentsFunction,
  templateId: string,
) {
  const parentBindings: Record<string, IBinding> = {};
  const inject = injectTemplate.bind(null, parentBindings, templateId);
  const markupStr = combineCb.call(null, inject);
  return [cloneHTMLMarkup(markupStr), parentBindings] as [
    Element,
    Record<string, IBinding>,
  ];
}

function injectTemplate(
  parentBindings: Record<string, IBinding>,
  templateId: string,
  template: any,
  value?: any,
) {
  const [createComponent, isAnonymous] = getCreateFunction(
    template,
    templateId,
  ) as [IComponentConsructor, boolean];
  const id = Object.keys(parentBindings).length;
  const name = `${UTIL_KEYS.CHILDREN}${id}`;
  const computeFn = isFunction(value) && value;
  const dependencies = (computeFn && getParamNames(value)) || [];
  parentBindings[name] = {
    createComponent,
    values: {
      [UTIL_KEYS.VALUE]: {
        value: !computeFn && normalizeValue(value),
        computeFn,
        dependencies,
      },
    },
    dependants: {},
    children: [],
    isRendered: false,
    isAnonymous,
    isFastApply: false,
    el: {} as IMarkupPointer,
    isParent: true,
  };

  return `<span ${BINDING_SIGN.COMPONENT}${name}></span>`;
}

export function combineState(
  state: IState,
  parentBindings: Record<string, IBinding>,
) {
  Object.assign(state.bindings, parentBindings);
  forEach(parentBindings, (parentName, parentBinding) => {
    const { dependencies, computeFn, value } =
      parentBinding.values[UTIL_KEYS.VALUE];
    dependencies.forEach((name) => {
      set(
        state.bindings,
        [name, UTIL_KEYS.DEPENDANTS, parentName],
        [UTIL_KEYS.VALUE],
      );
    });

    const newComputeFn =
      computeFn &&
      function (dependencies: string[], state: IState) {
        const computedValue = (computeFn as any).apply(
          null,
          getArguments(dependencies, state),
        );

        if (!computedValue) {
          return [];
        }

        return normalizeValue(computedValue);
      };
    parentBinding.values[UTIL_KEYS.VALUE].computeFn = newComputeFn;
    parentBinding.values[UTIL_KEYS.VALUE].value = newComputeFn
      ? newComputeFn(dependencies, state)
      : value;
  });
}

function getCreateFunction(
  template: ITemplate | string | ICombineComponentsFunction,
  templateId: string,
) {
  if ((template as ITemplate).markup) {
    return [template, false];
  }

  return [
    createTemplate(
      template as string | ICombineComponentsFunction,
      {},
      "",
      templateId,
    ),
    true,
  ];
}

function normalizeValue(value: any) {
  return isArray(value)
    ? value[0] && !isArray(value[0])
      ? (value as any[]).map((v) => [v])
      : value
    : [[value || {}]];
}
