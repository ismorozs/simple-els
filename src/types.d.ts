type IMarkupPointer = {
  name?: string;
  el: Node;
  classes?: string[];
  attrs?: Record<string, string>;
  isComponent?: boolean;
  placeholder?: Node;
  isFastApply?: boolean;
  templateId?: string;
};

type IMarkupPointers = Record<string, IMarkupPointer>;

type IUserBindingBehavior = {
  _: any;
};

type IUserStateBehavior = Record<
  string,
  IUserBindingBehavior | (() => void)
> & {
  onMessage?: () => void;
  onChange?: () => void;
};

type IComputeFunction = (dependecies: string[], state: IState) => any;

type IValue = {
  value: any;
  computeFn: false | IComputeFunction;
  dependencies: string[];
};

type IBindongOnChangeHandler = (
  change?: string[] | boolean,
  api?: IStateAPI,
  el?: Node,
) => void;

type IBindingDependants = Record<string, string[]>;

type IBinding = {
  values: Record<string, IValue>;
  dependants: IBindingDependants;
  isFastApply: boolean;
  el: IMarkupPointer;

  isParent?: boolean;
  isRendered?: boolean;
  isAnonymous?: boolean;
  createComponent?: IComponentConsructor;
  parentState?: IState;
  children: IStateAPI[];
};

type IState = {
  onMessage: IStateOnMessageHandler;
  onChange: IBindongOnChangeHandler;
  bindings: Record<string, IBinding>;
  isRendered?: boolean;
  parentState?: IState;
  parentBinding?: IBinding;
  el?: Node;
};

type IStateOnMessageHandler = (
  data?: any,
  componentApi: { stop: () => void } & IStateAPI,
  childrenApi: { index: number } & IChildrenAPI,
) => void;

type IStateChangeArgs = Record<string, any>;

type IStateBindingValueChange = {
  prevValue?: any;
  newValue?: any;
  isSame?: boolean;
};

type IStateBindingValueChanges = Record<string, IStateBindingValueChange>;

type IComponentChanges = Record<string, IStateBindingValueChanges>;

type IStateAPI = {
  get: () => Record<string, any>;
  set: (changes: IStateChangeArgs) => void;
  send: (data: any) => void;
  children: () => Record<string, IChildrenAPI>;
  destroy: (idx?: any) => void;
  markup: Record<string, HTMLElement>;
  state: IState;
};

type IChildrenAPIArgs = { index: number; values: IStateChangeArgs };

type ICombineComponentsFunction = (
  inject: (template: ITemplate, value?: any) => string,
) => string;

type ITemplate = {
  id: string;
  markup: Element | null;
  styles: CSSStyleSheet[];
  state: IState;
  isAnonymous: boolean;
  isStateless: boolean;
};

type IComponentConsructor = ((
  stateValues: IStateChangeArgs,
  target: HTMLElement,
  options?: IComponentCreateOptions,
) => IStateAPI) &
  ITemplate;

type IComponentCreateOptions = Record<string, any> & {
  parentState?: IState;
  parentBinding?: IBinding;
};

type IComponentWithState = ITemplate & {
  api: IStateAPI;
  markup: Element;
};
