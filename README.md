# Anime-ScrollTrigger

![Anime-ScrollTrigger](cover.jpg)

## Features

- Trigger animation when scroller offset intersects with trigger element.
- Support Scroll Triggering without the need of using animation ( i.e you can still use scroll trigger when you don't want to animate) 
- Pinning trigger element
- Option for [linear interpolation](https://en.wikipedia.org/wiki/Linear_interpolation) of animation based on scroll.
  i.e, trigger animation state based on scroll
- Smoothing animation when `lerp` is enabled. 
- Debugging the offset markers.
- Calculates offsets using `boundingClientRect` and `scrollTop` instead of using `Intersection Observer`.

Demo codepen: [https://codepen.io/Zaw-Lin-Tun-the-encoder/pen/vYbervK](https://codepen.io/Zaw-Lin-Tun-the-encoder/pen/vYbervK)


## Table Of Contents

- [Features](#features)
- [Introduction](#introduction)
- [Understanding How Trigger Works](#understanding-how-trigger-works)
- [Changelogs](#changelogs)
- [Installation](#installation)
- [Usages](#usages)
  - [Import](#import-animescrolltrigger)
  - [Init](#create-an-instance)
  - [Animation](#animation)
  - [ScrollTrigger](#scroll-trigger)
- [Examples](#examples)
- [Tips And Mistakes](#tips-and-mistakes)
- [ToDO](#to-do)

## Introduction

`Anime-ScrollTrigger` is a library which is aimed to animate on scroll just
like [`ScrollTrigger`](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). Some name conventions would be different but
the logic is pretty similar.

I strongly recommend you to use that library because it is awesome and maintained.

I don’t know how exactly that library is implemented in the context of coding. I only have abstract ideas of that
library and tried to create my own one based on those ideas.

> 💡 The animation system of this library is solely dependent on [`animejs`](https://animejs.com/) library. So basic hands-on knowledge of `animejs` would help you.

Most of usages are similar to [`ScrollTrigger`](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) . Please have a look at
the following instructions.

## Understanding How Trigger Works

It's important to know that there are two types of trigger offsets ( trigger positions ):

- trigger element: start offset `startTriggerOffset` and end offset `endTriggerOffset`:

  Offsets are calculated on [height](https://developer.mozilla.org/en-US/docs/Web/CSS/height) of the trigger element
  relative to the [top](https://developer.mozilla.org/en-US/docs/Web/API/Window/top) of the trigger element. You can
  change the value with **first** word of `start` or `end` attribute under `scrollTrigger` attribute.
- scroller/container element: start offset `startScrollerOffset` and end offset `endScrollerOffset`.

  Offsets are calculated relative
  to [clientHeight](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight) of the scroller element. You
  can change the value with **second** word of `start` or [`end`](#) attribute under `scrollTrigger` attribute.

Trigger will start when `startTriggerOffset` meets `startScrollerOffset`.
Trigger will end when `endTriggerOffset` meets `endScrollerOffset`.
For example,

   ```js
   ...
   scrollTrigger: {
      start: 'top bottom', 
      end: '10% bottom',
   }
   ```

The above values indicate that

- animation will start when `the top` of trigger element and the `bottom end` of scroller meets.
- animation will end when `10% of the trigger element height + top` of trigger element and `bottom end` of scroller
  meets.

## Changelogs

Read Changelog [here](CHANGELOG.md)


## Installation

Use `npm`

```bash
npm install anime-scrolltrigger
```

Or `cdn`

```js
import AnimeScrollTrigger from 'https://cdn.jsdelivr.net/npm/anime-scrolltrigger@{enter version e.g, 0.1.0}/dist/anime-scrolltrigger.es.js';
```

## Usages

### Import `AnimeScrolltrigger`

```js
import AnimeScrollTrigger from 'anime-scrolltrigger' 
```

### Create an instance.

- container: Scroller HTML element
- animations: Array of [animation object](#animation)

```js
let container = document.getElementById('container');
let boxes = document.querySelectorAll('.box')
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
    }, {
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

new AnimeScrollTrigger(container, animations);
```

### Animation

Animation object has the following structure.

- targets (optional) : HTML elements to animate
- attributes (optional) which you want to animate ( same as animejs) - for example
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

### Scroll Trigger

- #### trigger: `HTMLElement`

- #### start: `String`

  Indicate where `startTriggerOffset` of `trigger` element will intersect with `startScrollerOffset` of `scroller` element and when it intersects, animation will *
  *start**.
  Format is `"start-trigger-offset start-scroller-offset"`.
  Default value is `"top center"`.
  > Offset can be provided as percentage (e.g. 10%, 20%, -5%) or constant values: top, center, bottom.

- #### end: `String`

  Indicate where `endTriggerOffset` will intersect with `endScrollerOffset` and when it intersects, animation will **end
  **.  
  Format is `"end-trigger-offset end-scroller-offset"`.
  Default value is `"bottom center"`.
  > Offset can be provided as percentage (e.g. 10%, 20%, -5%) or constant values: top, center, bottom.

- #### actions: `String`

  Action behavior when a certain event is triggered. Format
  is `"on-enter-action on-leave-action on-enter-back-action on-leave-back-action"`. Default value is "play none none
  reverse".
  > Note: when `lerp` is enabled, user-defined `on-enter-action` and `on-enter-back-action` will be ignored which means
  that animation will be forwarded on scrolling down and backwarded on scrolling up.

- #### lerp: `Boolean`

  Lerp ( linear interpolation) enables progressive transition of animation which means that animation state will be
  triggered based on scroll position instead of triggering at once when scroller reach trigger start offset.

- #### smooth: `Boolean`

  When you enable `lerp`, the default behavior is that the animation will be triggered as `linear` easing ( which means that you will not see any smoothness or easing in the animation). 

  Thus, in order to make the animation `smooth`, you can enable this option.
  Default is `false`. 

  > Default easing method is `easeOutQuart` but if you provide `easing` attribute in the animation, provided `easing` will be used. 

- #### pin: `Boolean` or `String` or `HTMLElement` or `Object`

  Pinning will pin the trigger element to the top of container element. Pinning state will start when it reaches
  animation-trigger-start-offset and ends when it reaches animation-trigger-end-offset.

  A pinned element should exist **equal or below** `top` of the trigger element so that it will pin the element when trigger element is reached.

  If you want to provide top offset, you can provide it as an object attribute. 
  ```js
  pin: {
    element: '.pin-Element',
    top: 20,
  }
  ```

- #### debug: `Boolean` or `Object`

  Indicate to show start offset markers and end offset markers in order to see where they are located visually.
  You can pass object in order to `change markers color`.
  ```js
  debug: { 
     startTriggerOffsetMarker: '#f6a945',
     endTriggerOffsetMarker: '#ffd291',
     startScrollerOffsetMarker: '#4b45f6',
     endScrollerOffsetMarker: '#d5d4ff',
  }
  ```

- #### events: `Object`

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
    trigger: boxes[1],
    start: 'top 40%',
    end: 'bottom center',
    lerp: true,
    debug: true,
    pin: false,
    actions: 'play none none reverse',
    events:
        { // Scroll Trigger Events
            onEnter: (trigger) => {},
            onLeave: (trigger) => {},
            onEnterBack: (trigger) => {},
            onLeaveBack: (trigger) => {},
            onUpdate: (trigger,progress) => {},
        }
}
```

## Examples

- [simple-boxes](./examples/simple-boxes.html)

## Tips and mistakes

- Sometimes when the animation is not working, make sure that container element you provided is actually scrolling.
  You may want to listen to scroll event of that element.
  ```js
  container.addEventListener('scroll',()=>console.log('yay scrolling'))
  ```
- The start-intersection-trigger-offset needs to be lower than end-intersection-trigger-point offset. If it is not, animation/ triggering won't work. 
- Incorrect trigger offsets could probably happen because of initializing trigger before dom tree hasn't completed building yet. So workaround might be setting timeout.
  ```js
  setTimeout(()=>{
    new AnimeScrollTrigger(element,animations)
  },300)
  ```
## TO-DO

- [x] configurable marker colors
- [x] pin option
    - it should pin the target element to trigger element until it reaches animation-end-offset
- [ ] test on horizontal scroll
