# ScrollAnime

> Warning: Currently I am busy with my projects but I will try to release first beta version with complete documentation as soon as possible. 

## Introduction

`ScrollAnime` is a library which is aimed to animate on scroll just like [`ScrollTrigger`](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). Some name conventions would be different but the logic is pretty similar. 

I strongly recommend you to use that library because it is awesome and maintained. 

I don’t know how exactly that library is implemented in the context of coding. I only have abstract ideas of that library and tried to create my own one based on those ideas.

> 💡 The animation system of this library is solely dependent on [`animejs`](https://animejs.com/) library.

Most of usages are similar to [`ScrollTrigger`](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) . Please have a look at the following examples.

## Installation

```bash
npm install https://github.com/w99910/scrollanime.git
```

## Usages

- ### Import `ScrollAnime` 
```js
import ScrollAnime from 'scrollanime' 
// or 
import ScrollAnime from 'scrollanime/dist/scrollanime.es';
```

- ### Pass two parameters: 
  - container: Scroller HTML element
  - animations: Array of [animation object](#animation)

```js
let container = document.getElementById('container');
let animations = [
        {
            targets: boxes[0],
            translateX: 100,
            easing: 'linear',
            scrollTrigger: {
                trigger: boxes[0],
                start: 'top 3%',
                end: 'bottom 30%',
            }
        },{
            targets: boxes[1],
            backgroundColor: '#a993ff',
            easing: 'linear',
            scrollTrigger: {
                trigger: boxes[1],
                start: 'top 40%',
                end: 'bottom center',
                lerp: true,
            }
        }];
```
- ### Animation
Animation object has the following structure.
- targets: HTML elements to animate
- attributes which you want to animate ( same as animejs) - for example 
  ```js
  {
    translateX: 100,
    backgroundColor: 100,
    ...
  }
  ```
- scrollTrigger: [scroll trigger object](#scroll-trigger)
---
Example Animation Object
```js
{
    targets: boxes[1],
    backgroundColor: '#a993ff',
    easing: 'linear',
    scrollTrigger: {
        ...
    }
}
```

- ### Scroll Trigger

- trigger: `HTMLElement`
  
- start: `String`

  Indicate where animation will start. 
  Format is `"trigger-offset scroller-offset"`.
  Default value is `"top center"`.

- end: `String`

  Indicate where animation will end. 
  Format is `"trigger-offset scroller-offset"`.
  Default value is `"bottom center"`.

- actions: `String`

  Action behavior when a certain event is triggered. Format is `"on-enter-action on-leave-action on-enter-back-action on-leave-back-action"`. Default value is "play none none reverse".
  > Note: when `lerp` is enabled, user-defined `on-enter-action` and `on-enter-back-action` will be ignored which means that animation will be forwarded on scrolling down and backwarded on scrolling up.

- debug: `Boolean`

  Indicate to show start offset markers and end offset markers in order to see where they are located visually. 

- events: `Object`

  Events triggered on scroll.
  - onEnter: 
  - onLeave: 
  - onEnterBack:
  - onLeaveBack:
  - onUpdate:
---
Example scroll trigger object is
```js
{
    trigger: HTMLElement,
    start: 'trigger-offset scroller-offset', // e.g 'center start' - default value is 'top center',
    end: 'trigger-offset scroller-offset', // e.g 'bottom center' - default value is 'bottom center'
    actions: '',
    lerp: Boolean, // same as `scrub` property in ScrollTrigger.
    debug: Boolean, // indicate to show start offset markers and end offset markers. 
    events: { // Scroll Trigger Events
        onEnter: Function(), 
        onLeave: Function()
        onEnterBack: Function(),
        onLeaveBack: Function(),
        onUpdate: Function(),
    }
}
```

## Examples

- [simple-boxes](./examples/simple-boxes.html)