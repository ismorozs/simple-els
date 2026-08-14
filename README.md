# Simple Els
As concisely as possible, describe the element's appearance and behaviour, then inject it onto the page. Combine them for more complex cases. Control or remove from the outside. No additional environment setups. Ideal for popups

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
[1.3 Dynamic reevaluation](#reactivefunction)  
[1.4 Component manipulation](#componentapi)  
[1.5 Listening to state changes](#changelistener)  
[1.6 Attaching created component](#component)  
[1.7 Example](#basicexample)  
2. [Nesting components](#nesting)  
3. [Lifecycle hooks](#lifecycle)  
4. [Child-to-parent communication](#communication)  

## Creating component <a name="basics"></a>

Library exports only one function ```create```, which creates components that will subsequently be added to the page.  

Signature:
```js
create (String markupWithBidings, Object ComponentStateAndBehavior, String styles) => Component
```
Where:  
```markupWithBidings``` - HTML string, in which you can add special ```@``` or ```.``` attributes that will make the component more alive.  
```@``` creates a pointer to an HTML element (let's call them bindings), and ```.``` adds an encapsulated classname to that element.  
```js
`
  <div .class1 >
    <p @bindingName1 .class2 ></p>
    <p @bindingName2 .class3 ></p>
    <p @bindingName3 .class2.class3 ></p>
  </div>
`
```
```ComponentStateAndBehavior``` - object describing component's state, and bound elements' appearance, and behavior  
```js
{
  bindingName1: { ... },
  bindingName2: { ... },
  bindingName3: { ... },
}
```
```styles``` - CSS string with styles for the component; class names get encapsulated, so don't worry about name collision  
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
```js
СomponentStateAndBehavior {
  bindingName1: { ... },
  bindingName2: { ... },
  bindingName3: { ... },
  ...
  stateValue1: { ... },
  stateValue2: { ... },
  stateValue3: { ... },
  ...
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
    eventName1: EventListener (event, ComponentApi) => void
    eventName2: EventListener (event, ComponentApi) => void
    eventName3: EventListener (event, ComponentApi) => void
    ...
    onChange: StateChangeListener (newValue, markup, ComponentApi) => void
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


```_``` holds the internal value of the binding, and it doesn't directly affect any markup. But it can consequently be used as an argument for  ```ReactiveFunction```s to reevaluate other values or HTML-related properties.  
  
    
```onChange``` - state listener callback that fires up each time ```_``` changes. (more details at [Lifecycle hooks](#lifecycle))  
  

State values, of course, can't have properties related to markup.
```js
  stateValue: {
    _: Any | ReactiveFunction (...dependencies) => Any,
    onChange: StateChangeListener (newValue, markup, ComponentApi) => void
  }
```
if ```stateValue``` doesn't need ```onChange``` listener, its value can be assigned directly to the key
```js
  stateValue: Any | ReactiveFunction (...dependencies) => Any,
``` 



## Dynamic reevaluation (```ReactiveFunction```) <a name="reactivefunction"></a>
If you want the properties to change dynamically, ```ReactiveFunction``` will reevaluate and return a new value each time one or more of the ```dependencies``` arguments change.  
```js
(...dependencies) => newValue
```
```dependencies``` is a list of arguments, values of which are ```_``` keys of bindings or state values in the component.  

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
 
## Component manipulation (```ComponentApi```) <a name="componentapi"></a>
Through ```ComponentApi``` object, you can manage created components.  
Its methods are:
|Name | What does|
|---|---|
|```.get()```|returns all component's values (```_``` keys) at the moment of the call|
|```.set(Object newValues)```|sets new values for the component's state from the ```newValues``` object|
|```.send(Any message)```|sends a ```message``` from the child to the parent components (more details at [Child-to-parent communication](#communication)) |
|```.destroy()```| destroys the component and removes it from markup (must be used very cautiously with child components; usually it's done automatically) |


## Listening to state changes (```StateChangeListener```) <a name="changelistener"></a>
See [Lifecycle hooks](#lifecycle)

## Attaching created component <a name="component"></a>
After a ```Component``` is ```create```d, it can actually be attached to the DOM with the use of such calls:
```js
Component(Node el) => ComponentApi
```
attach ```Component``` to the DOM inside ```el```
```js
Component(Object newValues, Node el) => ComponentApi
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
}) => ComponentApi
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
      // set new value to a, which will cause a_text reevaluate and make text of <p> change
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
      // keys for events have the same name as event themselves
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
  // one of classes is added by default through markup, and another is added and removed dynamically 
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
  CombineFunction (
    InjectComponentFunction (
      String wrapper,
      Component injectedComponent,
      ComponentValue componentValue
    ) => injectedComponentMarkup
  ) => markupWithBidings,
  Object ComponentStateAndBehavior,
  String styles
) => Component
```
In the end, ```CombineFunction``` still returns ```markupWithBidings```. But this version will include markup with mounting points for the components.  
  
  
So you write your usual markup as the return value of ```CombineFunction```, and at any point where you want to add an existing component, you do it with:  
```js
InjectComponentFunction (String wrapper, Component component, ComponentValue componentValue) => injectedComponentMarkup
```
Where:  
```wrapper``` (optional, defaults to "div") - container HTML element. String delimited by dot ```.``` signs. Where the first segment will be the HTML tag for the container, and all the following are classes for that container.  
```component``` - variable holding the component itself, as simple as that.  
```componentValue``` (optional) - value for the injected component; can be either an object or an array of objects if you want to add multiple components of the same kind. Or the value can be a ```ReactiveFunction```, which would mean that components will change depending on some outer conditions.  

Better with an example:
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
    Dynamic P array length: <input @num type="number" min="0" />
    <br>
    <br>
    /* Inject single P component with default values */
    ${inject(P)}
    <br>
    /* Add class to the container and give a static value from the outside */
    ${inject(".red", P, { t: "Value from outside" })}
    <br>
    /* Give static array as the value meaning there will be multiple components */
    ${inject(".green", P, [{ t: "Value 1" }, { t: "Value 2" }])}
    <br>
    /* Give the function as the value which will return dynamically changing array depending on the num state variable */
    ${inject(".blue.flex", P, (num) =>
      /* 
        Returning array can be two-dimensional in which case
        the first slot is the component value and the second is a unique component identifier.
        It will help differentiate new and previous values for effective children updating
      */
      Array(num).fill().map((_, i) => ([
        { t: `Value ${i}` },
        i
      ])),
    )}
    <br>
  </div>
`,
  {
    num: 1,
    num_value: (num) => num,
    num_change: (e, { set }) => set({ num: +e.target.value }),
    num_keyup: (e, { set }) => set({ num: +e.target.value }),
  },
  `
  .main { background-color: white; padding: 10px }
  .red { border: 3px solid #FF5A38 }
  .green { border: 3px solid #38FF6D }
  .blue { border: 3px solid #3845FF }
  .flex { display: flex; flex-wrap: wrap }
`,
).asPopup();

```

## Lifecycle hooks <a name="lifecycle"></a>
*To Be Added...*
## Child-to-parent communication <a name="communication"></a>
Sometimes the parent component needs to perform an operation, and only the child component can give it the right parameters.  
Such a co-operation can be achieved with a child component ```send```ing such parameters up to the parent, which is waiting for them in ```onMessage``` listener.

*To Be Added...*