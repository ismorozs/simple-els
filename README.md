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

## Usage
Library exports only one function ```create```, which creates components that will subsequently be added to the page.  

Signature:
```js
create (String markupWithBindings, Object bindingsBehavior, String styles) => Component
```
Where:  
```markupWithBindings``` - HTML string, in which you can add special ```@``` or ```.``` attributes that will make the component more alive. ```@``` creates a pointer to an HTML element (let's call them bindings), and ```.``` adds an encapsulated classname to that element.    
```bindingsBehavior``` - object describing bindings state, appearance, and behavior  
```styles``` - CSS styles for the component; class names get encapsulated, so don't worry about name collision  
  
```Component``` - object that can be called to be attached to the DOM or combined into another component.

## Component
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
  left // initial position
  top // initial position
  bottom // initial position
  right // initial position
  handle // selector of the element to hold and move the popup around
  closeButton // selector of the element to close the popup on click
}) => ComponentApi
```
If no ```left``` or ```right``` position is specified, ```left``` defaults to 'center'  

If no ```top``` or ```bottom``` position is specified, ```top``` defaults to 'center'
  

```ComponentApi``` - way to control the attached ```Component``` from the outside.

## Component Api
```ComponentApi``` has such methods:
```js
.get() // get all state values
.set(Object newValues) // set new state values
.destroy() // remove the component from the DOM
```
  
## Example:
```js
create(
  // attach handle and someclass classes to the <div> element 
  // bind <p> element to the key a in the state, and attach someclass to its classlist
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
    // a_text is reactive and dependes on a, so it reevalutes each time a changes
    a_text: (a) => `${a}, world!`,
    // add 'click' event listener on <p> element
    // event - a standard Event object like in any listener
    // state - object which allows getting and changing component's variables
    a_click: (event, state) => {
      const { a } = state.get();
      console.log(a); // "Hello"
      // set new value to a, which will cause a_text reeavluate and make text of <p> change
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