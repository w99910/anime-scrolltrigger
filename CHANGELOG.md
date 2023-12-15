## v0.1.1

- Added `smooth` feature when `lerp` the animation. 🎉🎉

## v0.1.0

- fixed `enter` and `enterback` events triggering multiple times when `lerp` is enabled.
- Previously under the hood of pinning an element, `translate3d` CSS property was used. It only work well in Chrome and not in browsers such as Firefox or Safari. Thus I have decided to use `position` and `top` CSS properties for pinning an element.


## v0.0.9

- Pinning now calculates margin top of pin element.

## v0.0.8

- fix that progress value close to 0 or 1 was not triggering correctly when lerping.
- pinContainer will respect the css styles of trigger element
