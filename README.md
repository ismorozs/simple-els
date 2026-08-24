# Simple Els
Describe the element's appearance and behaviour using basic JS types and minimal API. Combine them for more complex cases. Reactive declarations as the library's cornerstone. No additional environment setups. Ideal for popups

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
[1.3 Dynamic reevaluation (```ReactiveFunction```)](#reactivefunction)  
[1.4 Component manipulation (```ComponentAPI```)](#componentapi)  
[1.5 Attaching created component](#component)  
[1.6 Example](#basicexample)  
2. [Nesting components](#nesting)  
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
    <p @bindingName1 .class2 ></p>
    <p @bindingName2 .class3 ></p>
    <p @bindingName3 .class2.class3 ></p>
  </div>
`
```
```ComponentStateAndBehavior``` - object describing the component's state and bound elements' appearance, and behavior.  
```js
{
  bindingName1: { ... },
  bindingName2: { ... },
  bindingName3: { ... },
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
| ```bindingName1``` | ```@bindingName1```| 
| ```bindingName2``` | ```@bindingName2```| 
| ```bindingName3``` | ```@bindingName3```| 
| ... | ... | 

```ComponentStateAndBehavior``` object may as well hold any number of simple state values for different utility purposes that are not bound to any markup.  
And two special functions [onChange](#lifecycle) for handling component's state changes and [onMessage](#communication) for communication with child components.  
The general form of the object:
```js
{
  stateValue1: { ... },
  stateValue2: { ... },
  stateValue3: { ... },
  ...
  bindingName1: { ... },
  bindingName2: { ... },
  bindingName3: { ... },
  ...
  onChange: StateChangeHandler(Array|Boolean changes, ComponentAPI, HTMLElement markup)
  onMessage: MessageHandler(Any message, ComponentAPI, ChildrenAPI)
}

```


Each binding can have one or more of the following properties:
```js
  bindingName: {
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
|```attrs```| Map of attribute names and values |
|```style```| Map of CSS properties and corresponding values |
|```class```| Array of class names |
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



## Dynamic reevaluation (```ReactiveFunction```) <a name="reactivefunction"></a>
If you want the properties to change dynamically, ```ReactiveFunction``` will reevaluate and return a new value each time one or more of the ```dependencies``` arguments change.  
```js
(...dependencies) => newValue
```
```dependencies``` is a list of arguments, whose values are ```_``` keys of bindings or state values in the component.  

The type of ```newValue``` must depend on what binding property it evaluates for.
```js
{
  a: 1, // shothand for  a: { _: 1 }
  b: {
    _: 2
    text: "Always the same text",
  },
  c: (a, b) => a + b  // shothand for  c: { _: (a, b) => a + b }
  // a._ + b._ => 1 + 2
  d: {
    text: (c) => `Hi, my text is computed dynamically depending on c value: ${c}` // c._ => 3
  }
}
```
 
## Component manipulation (```ComponentAPI```) <a name="componentapi"></a>
Through ```ComponentAPI``` object, you can manage created components.  
Its methods are:
|Name | What does|
|---|---|
|```.get()```|returns all component's values (```_``` keys) at the moment of the call|
|```.set(Object newValues)```|sets new values for the component's state from the ```newValues``` object|
|```.send(Any message)```|sends a ```message``` to the parent components (see [Child-to-parent communication](#communication)) |
|```.destroy()```| destroys the component and removes it from markup (must be used very cautiously with child components; usually it's done automatically) |

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
  // bind <p> element to the key a in the state
  // bind <span> to the key b in the state, and attach class1, class2, class3 to its classlist
  // bind <button> to the key c in the state
  `<div .handle .someclass  >
    <p @a ></p>
    <span @b .class1.class2.class3 ></span>
    <button @c >back to who?</button>
  </div>`,

  // bindingsBehavior
  {
    // give a some default value, it doesn't change markup directly
    a: "Hello",
    // make the text of <p> change to what a_text function evaluates to
    // a_text is reactive and depends on a, so it reevaluates each time a changes
    a_text: (a) => `${a}, world!`,
    // add 'click' event listener on <p> element
    // event - a standard Event object like in any listener
    // state - object which allows getting and changing component's variables
    a_click: (event, state) => {
      const { a } = state.get();
      console.log(a); // "Hello"
      // set new value to a, which will cause a_text to reevaluate and make text of <p> change
      state.set({ a: "Greetings" });
    },

    // a simple state variable, doesn't have to be attached to DOM
    isSpanHovered: false,

    // second way of describing binding is through an object
    b: {
      // another form of giving the default value
      _: "to you",
      // change text of <span> depending on a and b variables
      // keys in objects don't have binding name prefix
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
      attrs: (isSpanHovered) => isSpanHovered && { disabled: isSpanHovered } || {},
      // change classes
      // classes are returned in the form of array
      class: (b) => b === "from me" && ["bigButton"] || []
    },
  },

  // styles
  // one of the classes is added by default through markup, and another is added and removed dynamically 
  `
  .someclass {
    padding: 5px;
    background-color: white;
    font-weight: bold
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
).asPopup({ right: 100, handle: '.handle'  })
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

### Unique component identifier
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

### Better with an example:
```js
const P = create(
  `<p @t .main ></p>`,
  {
    t: {
      _:"Default value",
      text: (t) => t
    }
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
