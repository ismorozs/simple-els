# Simple Els
Create UI components of any complexity, appearance, and behavior using basic JS types and a minimal API. Reactive declarations as the library's cornerstone. No compilers or additional environment setups. Ideal for popups

## How to install and prepare
Install the library through
```sh
npm install simple-els
```
then import with
```js
import create from 'simple-els'
```
in your script file.
  
    
## Contents
1. [Basic usage](#basics)  
[1.1 Creating component](#basics)  
[1.2 Defining component state and behavior](#definingbehavior)  
[1.3 Short-form defninition](#fast-bindings)  
[1.4 Dynamic reevaluation (```ReactiveFunction```)](#reactivefunction)  
[1.5 Component manipulation (```ComponentAPI```)](#componentapi)  
[1.6 Attaching created component](#component)  
[1.7 Example](#basicexample)  
2. [Combining components](#nesting)  
[2.1 Basic nesting](#nesting)  
[2.2 Creating components with different values](#nesting-with-params)  
[2.3 Anonymous components/templates](#anonymous-components)  
[2.4 Conditional rendering](#conditional-rendering)  
[2.5 Unique identifiers](#unique-identifiers)  
3. [Child-to-parent communication (```send```/```onMessage```)](#communication)  
4. [Children list manipulation (```ChildrenAPI```)](#childrenapi)  
5. [Lifecycle hooks (```onChange```)](#lifecycle)  


## Creating component <a name="basics"></a>

Library exports only one function ```create```, which creates components that will subsequently be added to the page.  

Signature:
```js
create (String markupWithBidings, Object ComponentStateAndBehavior, String styles) => Component
```
Where:  
```markupWithBidings``` - HTML string, in which you can add special ```@``` or ```.``` attributes that will make the component more alive.  
```@``` creates a pointer to an HTML element (let's call them bindings) and adds an encapsulated classname to that element, ```.``` only adds a classname.  
```js
`
  <div .class1 >
    <p @binding1 .class1 ></p>
    <p @binding2 .class3 ></p>
    <p @binding3 .class2.class3 ></p>
  </div>
`
```
```ComponentStateAndBehavior``` - object describing the component's state and bound elements' appearance, and behavior.  
```js
{
  binding1: { ... },
  binding2: { ... },
  binding3: { ... },
}
```
```styles``` - CSS string with styles for the component; class names get encapsulated, so don't worry about name collision.
```js
`
  .class1 { ... }
  .class2 { ... }
  .class3 { ... }
`
```
  
Function call returns a ```Component``` object that can be called to be attached to the DOM or combined into another component.

## Defining component state and behavior (```ComponentStateAndBehavior```) <a name="definingbehavior"></a>
To start describing dynamic behavior and appearance of HTML elements, binding keys in ```ComponentStateAndBehavior``` must be given exactly the same names as attributes assigned to such elements in ```markupWithBidings``` only without a ```@``` sign.  

|Key in ```ComponentStateAndBehavior```| corresponding attribute in ```markupWithBidings``` |
|---|---|
| ```binding1``` | ```@binding1```| 
| ```binding2``` | ```@binding2```| 
| ```binding3``` | ```@binding3```| 
| ... | ... | 
  
### Naming conventions considerations
The library doesn't actually acknowledge capital letters for ```@``` and ```.``` attributes, and it will forcibly convert them to lowercase.  
For example, camel-cased literal like ```bindnigName``` will be turned into ```bindingname``` on its own at the end, probably causing some confusion.  
To avoid such confusion, use kebab notation for those attributes in ```markupWithBidings``` if you want to have long expressive binding names, as it is pretty much standard for HTML attributes anyway.
  
  

Kebab-cased binding attributes in ```markupWithBidings``` will be mapped to camel-cased keys in ```ComponentStateAndBehavior```  
  


|Key in ```ComponentStateAndBehavior```| corresponding attribute in ```markupWithBidings``` |
|---|---|
| ```bindingName``` | ```@binding-name```|
| ```manyWordsBindingName``` | ```@many-words-binding-name```|
---

```ComponentStateAndBehavior``` object may as well hold any number of simple state values for different utility purposes that are not bound to any markup.  
  
And two special functions [onChange](#lifecycle) for handling component's state changes and [onMessage](#communication) for communication with child components.  
The general form of the object:
```js
{
  stateValue1: { ... },
  stateValue2: { ... },
  stateValue3: { ... },
  ...
  binding1: { ... },
  binding2: { ... },
  binding3: { ... },
  ...
  onChange: StateChangeHandler(Array|Boolean changes, ComponentAPI, HTMLElement markup)
  onMessage: MessageHandler(Any message, ComponentAPI, ChildrenAPI)
}

```


Each binding can have one or more of the following properties:
```js
  binding: {
    _: Any | ReactiveFunction (...dependencies) => Any
    value: String | ReactiveFunction (...dependencies) => String
    text: String | ReactiveFunction (...dependencies) => String
    html: String | ReactiveFunction (...dependencies) => String
    attrs: Object | ReactiveFunction (...dependencies) => Object
    style: Object | ReactiveFunction (...dependencies) => Object
    class: String[] | ReactiveFunction (...dependencies) => String[]
    ...
    eventName1: EventHandler (event, ComponentAPI) => void
    eventName2: EventHandler (event, ComponentAPI) => void
    eventName3: EventHandler (event, ComponentAPI) => void
    ...
    onChange: StateChangeHandler (Array|Boolean changes, ComponentAPI, HTMLElement markup) => void
  }
```
| Key | What it represents in HTML element |
|---|---|
|```value```| ```value``` property |
|```text```| ```textContent``` property |
|```html```| ```innerHTML``` property |
|```attrs```| Object of attribute names and values |
|```style```| Object of CSS properties and corresponding values |
|```class```| Array of class name strings |
|...|...|
|```eventName```| Event to listen to on the element; can be any legitimate event name |

```EventHandler``` is a usual event handler function, with the first argument a standard ```Event``` object, and the second ```ComponentAPI```; see [Component manipulation (```ComponentAPI```)](#componentapi)  

```_``` holds the internal value of the binding, and it doesn't directly affect any markup. But it can consequently be used as an argument for  ```ReactiveFunction```s to reevaluate other values or HTML-related properties.  
  
    
```onChange``` - state listener callback that fires up each time ```_``` value of the binding changes. (more details at [Lifecycle hooks](#lifecycle))  
  

State values, of course, can't have properties related to markup.
```js
  stateValue: {
    _: Any | ReactiveFunction (...dependencies) => Any,
    onChange: StateChangeHandler (Array|Boolean changes, ComponentAPI, HTMLElement markup) => void
  }
```
If ```stateValue``` doesn't need ```onChange``` listener, its value can be assigned directly to the key
```js
  stateValue: Any | ReactiveFunction (...dependencies) => Any,
``` 

## Short-form defninition <a name="fast-bindings"></a>  
You can define a binding in the short key-value form if you want to just display a value on the screen. 
```js
bindingName: 'Default value' /* =>
bindingName: {
  _: 'Default value',
  text: (bindingName) => bindingName,
  value: (bindingName) => bindingName
}
*/
```
There's also a short form for all other keys
```js
bindingName_click: () => { console.log("Click!") }
// bindingName: { click: () => { console.log("Click!") } }
bindingName_style: () => ({ fontSize: 14 })
// bindingName: { style: ({ fontSize: 14 }) }

// ...
```

## Dynamic reevaluation (```ReactiveFunction```) <a name="reactivefunction"></a>
Binding properties can change automatically with the help of ```ReactiveFunction```s when one or more other binding properties on the component change.  
To declare one's binding dependency on the other, put its name in the ```bindingNames``` arguments list of the ```ReactiveFunction```.  
```js
ReactiveFunction (...bindingNames[]) => computedValue
```
```bindingNames``` is a list of arguments whose values will be retrieved from the ```_``` keys of the corresponding bindings or state values in the component.  

The type of ```computedValue``` will depend on which binding property it evaluates for.
```js
{
  a: 'hello', // => a { _: 'hello' }
  b: {
    _: 'world'
  },
  /*
    Extract '_' key values from 'a' and 'b' and calculate a new value for 'c'
    which will be put inside c._ key as well

    c._ = a._ + b._
  */
  c: (a, b) => a + b  // =>  c: { _: (a, b) => a + b }

  d: {
    class: (c) => [c],
    style: (a, b) => ({ padding: a, margin: b }),
    text: (a, b, c) => `Text that changes depending on ${a}, ${b} and ${c} values`, 
    attrs: (b) => ({ href: `http://example.com/${b}` })
  }
}
```
 
## Component manipulation (```ComponentAPI```) <a name="componentapi"></a>
Through ```ComponentAPI``` object, you can manage created components.  
Its methods and properties are:
|Name | What does|
|---|---|
|```.get()```|returns all the component's values (```_``` keys) at the moment of the call|
|```.set(Object newValues)```|sets new values for the component's state from the ```newValues``` object|
|```.send(Any message)```|sends a ```message``` to the parent components (see [Child-to-parent communication](#communication)) |
|```.destroy()```| destroys the component and removes it from markup (must be used very cautiously with child components; usually it's done automatically) |
|```markup```|map of all the component's bound DOM elements |

## Attaching created component <a name="component"></a>
After a ```Component``` is ```create```d, it can actually be attached to the DOM with the use of such calls:
```js
Component(Node el) => ComponentAPI
```
attach ```Component``` to the DOM inside ```el```
```js
Component(Object newValues, Node el) => ComponentAPI
```
change ```Component``` state to ```newValues```, and then attach it to the DOM inside ```el```   

You can also turn ```Component``` into a popup with
```js
Component.asPopup({
  left // initial position (number or 'center')
  top // initial position (number or 'center')
  bottom // initial position (number or 'center')
  right // initial position (number or 'center')
  handle // selector of the element to hold and move the popup around
  closeButton // selector of the element to close the popup on click
}) => ComponentAPI
```
All keys to the ```asPopup``` method are optional.  

If no ```left``` or ```right``` position is specified, ```left``` defaults to 'center'  

If no ```top``` or ```bottom``` position is specified, ```top``` defaults to 'center'
  
## Example: <a name="basicexample"></a>
```js
create(
  // attach handle and someclass classes to the <div> element
  // bind <p> element to the key 'a' in the state
  // bind <span> to the key 'b' in the state, and attach class1, class2, class3 to its classlist
  // bind <button> to the key 'c' in the state
  // bind the second <p> element to the key 'fast'
  // assign <input> element @fast-calculated attribute which will match the 'fastCalculated' key
  `<div .handle .someclass  >
    <p @a ></p>
    <span @b .class1.class2.class3 ></span>
    <button @c >back to who?</button>
    <p @fast></p>
    <input @fast-calculated /></p>
  </div>`,

  {
    fast: "Fast form of binding definition requires only a primitive value form to be displayed",

    a: {
      // give a some default value, it doesn't change markup directly
      _: "Hello",
      // make the text of <p> change to what the text function evaluates to
      // text function is reactive and depends on 'a', so it reevaluates each time 'a' changes
      text: (a) => `${a}, world!`,
      // add 'click' event listener on <p> element
      click: (event, state) => {
        const { a } = state.get();
        console.log(a); // "Hello"
        // set new value to 'a', which will cause the text function to reevaluate and make text of <p> change
        state.set({ a: "Greetings" });
      },
    },

    // @fast-calculated in markup translates to 'fastCalculated' in definition object
    fastCalculated: (a) => `${a}, again!!!`,

    // a simple state variable, doesn't have to be attached to DOM
    isSpanHovered: false,

    b: {
      _: "to you",
      // change text of <span> depending on 'a' and 'b' variables
      text: (a, b) => `${a} back ${b}`,
      // change styles
      style: (isSpanHovered) => ({
        backgroundColor: (isSpanHovered && "#FA9D9D") || "#EBFA9D",
      }),
      // keys for events have the same name as the browser events themselves
      mouseenter: (e, state) => {
        state.set({ isSpanHovered: true });
      },
      mouseleave: (e, state) => {
        state.set({ isSpanHovered: false });
      },
    },

    c: {
      click: (_, { get, set }) => {
        const { b } = get();
        set({ b: (b === "to you" && "from me") || "to you" });
      },
      // change attributes on the <button> with @c binding
      // attributes are returned in the form object
      attrs: (isSpanHovered) =>
        (isSpanHovered && { disabled: isSpanHovered }) || {},
      // change classes
      // classes are returned in the form of array
      class: (b) => (b === "from me" && ["bigButton"]) || [],
    },
  },

  // styles
  // one of the classes is added by default through markup, and another is added and removed dynamically
  `
  .someclass {
    padding: 5px;
    background-color: white;
    font-weight: bold
    border: 2px solid black;
  }

  .bigButton {
    display: inline-block;  
    padding: 10px;
    font-size: 14px;
    font-weight: bold;
  }
`,
  // top or bottom are not specified so that the popup will be vertically centered
  // popup will be movable by element with .handle class
).asPopup({ right: 100, handle: ".handle" });
```
## Nesting Components <a name="nesting"></a>
Components composed of other components are ```create```d almost the same way, only this time the first argument is a function.
```js
create (
  CombineComponents (
    InjectComponent (
      Component component,
      Object|Object[]|ReactiveFunction componentValue
    ) => componentMountingPoint
  ) => markupWithBidings,
  Object ComponentStateAndBehavior,
  String styles
) => Component
```
In the end, ```CombineComponents``` function still returns ```markupWithBidings```. But this version will include markup with mounting points for the components.  
  
  
So you write your usual markup as the return value of ```CombineComponents``` function, and at any point where you want to add an existing component, you do it with:  
```js
InjectComponent (Component component, Object|Object[]|ReactiveFunction componentValue) => componentMountingPoint
```
Where:  
```component``` - variable holding the component itself, as simple as that.  
```componentValue``` (optional) - value for the injected component; can be either an object or an array of objects if you want to add multiple components of the same kind. Or the value can be a ```ReactiveFunction```, which would mean that components will change depending on some outer conditions.  

Simplest example:
```js
const A = create(`<span>Hello</span>`);
const B = create(`<span>World</span>`);
create((inject) => `
  <div>
    ${inject(A)}, ${inject(B)}!
  </div>
`
).asPopup();
/* =>
  <div>
    <span>Hello</span>, <span>World</span>
  </div>
*/
```

## Creating components with different binding values <a name="nesting-with-params"></a>
To create the same components with different binding values. Put those values as a second argument to ```InjectComponent``` function.
In the form of an object, an array of objects, or ```ReactiveFunction```.
```js
const Span = create(
  `<span @text></span>`,
  {
    text: {
      text: (text) => text,
      click: (e, { get }) => alert(get().text),
    },
  },
  ` .text { padding-left: 5px }`,
);
create(
  (inject) => `
  <div>
    ${inject(Span, { text: "Hello" })},
    ${inject(Span, { text: "World" })}!
    <div>
      ${inject(
        Span,
        ["one", "two", "three"].map((text) => ({ text })),
      )}!
    </div>
    <div>
      ${inject(Span, (texts) => texts.map((text) => ({ text })))}!
    </div>
  </div>
`,
  {
    texts: ["a", "b", "c", "d"],
  },
).asPopup();
```

## Anonymous components/templates <a name="anonymous-components"></a>
For repeatable views that don't require particular logic, or if you just don't feel like creating another full-fledged component, use an anonymous one.

```js
create((inject) => `
  <ul>
    ${inject(`
      <li .list-item @item></li>
    `, (num) =>
        Array(num).fill().map((_, i) =>
          ({ item: `Item: ${i}` })))}
  </ul>
`, {
  num: 10,
}, `
  .list-item {
    font-size: 20px;
  }
`).asPopup(); /* =>
  <ul>
    <li class="list-item item">Item 0</li>
    <li class="list-item item">Item 1</li>
    <li class="list-item item">Item 2</li>
    ...
</ul>
*/
```
Class names of anonymous components are scoped to the main component.  
Short binding notation is a good use case for such situations.

## Conditional rendering <a name="conditional-rendering"></a>
Display content only if a condition requires so. To do that, return a negative primitive or an empty ```Array``` from a ```ReactiveFunction```.
```js
const Span = create(`<span>Hello</span>`);
create((inject) => `
  <div>
    ${inject(Span, () => null)}
    ${inject(Span, () => [])}
    ${inject(Span, () => '')}
    ${inject(Span, () => true)}
  </div>
`).asPopup() /* =>
  <div>
    <span>Hello</span>
  </div>
*/
```

## Unique component identifier <a name="unique-identifiers"></a>
If you are going to use ```ReactiveFunction``` to calculate values for the children component list, the alghorithm will try to compare new and previous values and then find the most optimal way to update the existing children list.  
But the more complex the state of the component will get, and the more side effects it will keep inside, the harder it will become for the alghorithm to rightfully differentiate one component from another based on just incoming values. Which in the end may cause some undesireable outcomes.  
Giving each component a unique identifier will help very much in understanding what is changed, what is removed, and what is added. 

To return an array of values with unique identifiers, return it in two-dimensional form, where the first slot will be filled with the component's values and the second with some unique value that should identify that component.
```js
ReactiveFunction (...dependencies) => [
  [Object componentValues1, Any uniqueId1],
  [Object componentValues2, Any uniqueId2],
  [Object componentValues3, Any uniqueId3],
  ...
]
```

### Example:
```js
const P = create(
  `<p @t .main ></p>`,
  {
    t: {
      _: "Default value",
      text: (t) => t,
    },
  },
  `.main { border: 1px solid #B638FF; padding: 5px; margin: 5px }`,
);

create(
  (inject) => `
  <div .main >
    Dynamic P array length: <input @num type="number" min="0" /><br>

    Inject a single P component with default values 
    <div .container>
      ${inject(P)}
    </div>
    
    Give a static value from the outside 
    <div .red.container>
      ${inject(P, { t: "Value from outside" })}
    </div>
    
    Give a static array of objects as the value meaning there will be multiple components 
    <div .green.container>
      ${inject(P, [{ t: "Value 1" }, { t: "Value 2" }])}
    </div>

    Give a function as the value that will return a dynamically changing array 
    <div .blue.flex.container>
      ${inject(P, (num) =>
        /* 
        Returning array can be two-dimensional in which case
        the first slot is the component value and the second is a unique component identifier.
        It will help differentiate new and previous values for effective children updating
      */
        Array(num)
          .fill()
          .map((_, i) => [{ t: `Value ${i}` }, i]),
      )}
    </div>

    Same as above only anonymous component this time 
    <div .blue.flex.container>
      ${inject(
        /*
          Anonymous components share the same class namespace as their parent.
          Binding @value is created on the fly and will map to the values
          returned from ReactiveFunction
        */
        (inject2) => `
        <div>
          <p @value .class-from-outer-scope></p>
          ${
            /* Inserting a standard component inside the anonymous one */
            inject2(P, (num) => ({ t: `Total: ${num}` }))
          }
        </div>`,
        (num) =>
          Array(num)
            .fill()
            .map((_, i) => [{ value: `Value ${i}` }, i]),
      )}
    </div>
  </div>
`,
  {
    num: 1,
    num_value: (num) => num,
    num_change: (e, { set }) => set({ num: +e.target.value }),
    num_keyup: (e, { set }) => set({ num: +e.target.value }),
  },
  `
  .num { margin-top: 5px; margin-bottom: 20px }
  .main { background-color: white; padding: 10px }
  .red { border: 3px solid #FF5A38 }
  .green { border: 3px solid #38FF6D }
  .blue { border: 3px solid #3845FF }
  .flex { display: flex; flex-wrap: wrap }
  .container { margin-top: 10px; margin-bottom: 20px }
  .class-from-outer-scope { border: 1px solid #B638FF; padding: 5px; margin: 5px }
`,
).asPopup();

```

## Child-to-parent communication (```send```/```onMessage```) <a name="communication"></a>
Sometimes the parent component needs to perform an operation, and only the child component can provide it with the right parameters.  
Such a co-operation can be achieved with a child component ```send```ing the required parameters up to the parent, which is waiting for them in ```onMessage``` listener.  

```ComponentAPI.send(message)``` sends any type of data inside ```message``` argument up to its parent components. Because this method is inside ```ComponentAPI```, it is available in any ```EventHandler``` and ```StateChangeHandler``` functions.  

```onMessage``` can be added to the  ```ComponentStateAndBehavior``` argument in the step of the component creation and has such a form:
```js
onMessage(Any message, { stop, ...ComponentAPI }, { index, ...ChildrenAPI})
```
Where:  
```message``` - data sent from the child component as an argument to the ```ComponentAPI.send``` method  
```stop``` - function to stop the message ascending higher up the component tree  
```ComponentAPI``` - see [Component manipulation (```ComponentAPI```)](#componentapi)  
```index``` - numeric position of the child in the children list  
```ChildrenAPI``` - way to manage the whole list of children components. See [Children list manipulation](#childrenapi).  
  
### Example:  
```js
const Child = create(
  `<button @button >Click me!</button>`,
  {
    time: new Date(),
    color: "white",
    button: {
      style: (color) => ({ backgroundColor: color }),
      mouseenter: (e, { set }) => set({ time: new Date() }),
      /*
        Child component sends its data up the component tree to its parents
      */
      click: (e, { get, send }) => send({ ...get() }),
    },
  },
  `.button { padding: 5px; margin: 5px; font-size: 18px }`,
);

const colors = ["LightGreen", "LightSalmon", "LightBlue", "Plum", "Gainsboro"];

create(
  (inject) => `
  <div .main>
    Create button with color: 
    <select @color >
      ${colors.map((color) => `<option>${color}</option>`).join("")}
    </select>
    <button @create >Create</button>
    <br>
    <p @info ></p>

    ${inject(Child, (buttons) => buttons)}
  </div>
`,
  {
    buttons: [],
    color: colors[0],
    color_change: (e, { set }) => set({ color: e.target.value }),
    create_click: (e, { set, get }) => {
      const { color, buttons } = get();
      set({ buttons: [...buttons, { color }] });
    },
    info: {
      html: (info) => {
        if (!info) {
          return "";
        }
        const { index, time } = info;
        return `
          Child with position ${index} in the list
          was clicked at ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}.${time.getMilliseconds()}
        `;
      },
      style: (info) => (info && { backgroundColor: info.color }) || {},
      class: (info) => (info ? [] : ["hidden"]),
    },
    /*
      Parent is listening for children messages and that way is able to get access to their scope values
    */
    onMessage: (message, { set }, { index }) =>
      set({ info: { ...message, index } }),
  },
  `
  .main { background-color: white; padding: 10px; }
  .info { padding: 10px; font-size: 18px }
  .hidden { display: none }
`,
).asPopup();
```


## Children list manipulation (```ChildrenAPI```) <a name="childrenapi"></a>
Manually manipulate lists of children components instead of relying on automatic updating from ```ReactiveFunction```s.  
Or you can just inquire their state.  
Methods:  
|Name| What does|
|---|---|
|```.get(Number index)```|gets the component's values at ```index``` position, or all components' values if ```index``` is omitted|
|```.set(Object values, Number index)```|sets new ```values``` for the component at ```index``` position |
|```.push(Object values)```|adds a new component at the end of the list with specified ```values```|
|```.insert(Object values, Number index)```|inserts a new component with specified ```values``` at ```index``` position in the list|
|```.destroy(Number index)```| destroys component at ```index``` position in the list and removes it from HTML markup |
|```.forEach(Callback (ComponentAPI) => void)```|performs ```Callback``` function on each component in the list with ```ComponentAPI``` as an argument|  

```index``` argument inside ```onMessage``` listener is beginning to make sense.  
  
  

Direct mutations are not recommended and should be used with care when there's no way the ```ReactiveFunction``` can achieve the same desired result, as they may break the comparing algorithm, ```onChange``` tracking and all subsequent reactive flow.  
To minimize unpredictable behavior, try to avoid using ```ChildrenAPI``` mutations and ```ReactiveFunction``` simultaneously.


## Lifecycle hooks (```onChange```) <a name="lifecycle"></a>
Only one ```onChange``` function is responsible for tracking and responding to any changes in the component's state and lifecycle.
It can be appended to a single binding as well as to the whole component definition inside ```ComponentStateAndBehavior``` argument.  
The signature:
```js
onChange(Array|Boolean changes, ComponentAPI, HTMLElement markup)
```
Where:  
```changes``` - the list of keys that were changed, or a flag to determine the component's state    
```ComponentAPI``` - see [Component manipulation (```ComponentAPI```)](#componentapi)  
```markup``` - bound element or the whole component markup  
  


Depending on the ```changes```'s value, you can determine the component's state and corresponding course of action:

|Component state| ```changes``` value| Note |
|---|---|---|
|Created| ```true``` | ```changes``` is just a positive boolean; time to set up outside logic or side effects | 
|Updated| [...changed keys] | ```changes``` is an array filled with changed keys; check what exactly is changed and act accordingly | 
|Before removal| ```false``` | ```changes``` is a negative boolean; perform all required pre-removal operations |  
