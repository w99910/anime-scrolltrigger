import anime from "animejs";

export default class AnimeScrollTrigger {
    getScrollOffsetPercentage(position) {
        if (position.includes('%')) return parseInt(position.substring(0, position.length - 1)) / 100;
        if (parseInt(position)) return parseInt(position);
        switch (position) {
            case 'top' :
                return 0;
            case 'bottom':
                return 1;
            case 'center':
                return 0.5;
            default:
                return null;
        }
    }

    createMarker(height, width, color, top, right = null, position = 'absolute') {
        let marker = document.createElement('div');
        marker.style.height = height;
        marker.style.width = width;
        marker.style.backgroundColor = color;
        marker.style.position = position;
        marker.style.top = top;
        if (right) marker.style.right = right;
        return marker;
    }

    createMarkerContainer() {
        this.element.style.position = 'relative';
        this.markerContainer = document.createElement('div');
        this.markerContainer.style.overflow = 'hidden'
        this.markerContainer.style.height = this.element.scrollHeight + 'px';
        this.markerContainer.style.width = this.element.scrollWidth + 'px';
        this.markerContainer.style.position = 'absolute';
        this.markerContainer.style.left = '0';
        this.markerContainer.style.top = '0';
        this.markerContainer.style.pointerEvents = 'none'
        this.element.prepend(this.markerContainer)
        return this.markerContainer;
    }

    lerp(start, end, current) {
        let distance = Math.abs(end - start);
        let currentDist = Math.max(end - current, 0);
        return 1 - Math.min(currentDist / distance, 1);
    }

    createPinContainer(triggerElement) {
        // it is important to insert at the same position.
        let pinContainer = document.createElement('div');
        pinContainer.className = 'pin-container';
        let style = window.getComputedStyle(triggerElement);
        Object.keys(style).forEach((attr)=>{
            if(/[^0-9]/i.test(attr)) {
                pinContainer.style[attr] = style[attr];
            }
        })
        pinContainer.style.height = triggerElement.getBoundingClientRect().height + 'px';
        pinContainer.style.width = triggerElement.getBoundingClientRect().width + 'px';
        pinContainer.style.willChange = 'transform';
        if (triggerElement.parentElement.children.length > 1) {
            triggerElement.insertAdjacentElement('beforebegin', pinContainer)
        } else {
            triggerElement.parentElement.appendChild(pinContainer)
        }
        pinContainer.prepend(triggerElement)
        return pinContainer;
    }

    removePinContainer(pinContainer) {
        // it is important to insert at the same position.
        let parentEl = pinContainer.parentElement;
        if (parentEl.children.length > 1) {
            pinContainer.replaceWith(pinContainer.children[0])
        } else {
            parentEl.appendChild(pinContainer.children[0]);
        }
        pinContainer.remove();
    }

    getElement(el, defaultEl){
        if(typeof el === "string")return document.querySelector(el);
        if(typeof el === "object") return el;
        return defaultEl;
    }

    getDistanceBetween(triggerElement, scrollerElement, currentViewportScrollOffset = 0){
        // DOMRect top is relative to the parent so we need to check if element's parent is the target parent element.
        const getTopRelativeToBody = (el, scrollTop) =>{
            let offset = 0;
            let margin = 0;
            while(true){
                offset += el.getBoundingClientRect().top + currentViewportScrollOffset - parseInt(window.getComputedStyle(el).marginTop);
                margin += parseInt(window.getComputedStyle(el).marginTop);
                if(!el.parentElement || el.tagName === 'body'){
                    break;
                }
                el = el.parentElement;
            }
            return offset;
        }

        const triggerTop = getTopRelativeToBody(triggerElement, currentViewportScrollOffset);
        const scrollerTop = getTopRelativeToBody(scrollerElement, 0);
        return Math.abs(scrollerTop - triggerTop);
    }

    constructor(element, animations) {
        this.element = element;
        animations.forEach((trigger, index) => {
            trigger.animations = {};
            trigger.hasTriggered = false;
            trigger.isActive = false;
            trigger.scrollTrigger.actions ??= 'play none none reverse';
            trigger.scrollTrigger.actions = trigger.scrollTrigger.actions.split(' ');
            trigger.scrollTrigger.trigger = this.getElement(trigger.scrollTrigger.trigger)
            if (trigger.scrollTrigger.actions.length < 4) {
                throw new Error('Actions attribute should have four values. e.g, "play none none reset"');
            }
            Object.keys(trigger).forEach((key) => {
                if (!['targets', 'scrollTrigger', 'animations'].includes(key)) {
                    trigger.animations[key] = trigger[key]
                }
            })
            if (Object.keys(trigger.animations).length > 0) {
                if (trigger.scrollTrigger.lerp) {
                    trigger.animations.easing = 'linear'
                }
                let params = {
                    targets: trigger.targets,
                    ...trigger.animations,
                    autoplay: false,
                };
                trigger.anime = anime(params)
            }


            const triggerAction = (action) => {
                switch (action) {
                    case 'play':
                        if (trigger.anime.reversed) trigger.anime.reverse();
                        return trigger.anime.play();
                    case 'pause':
                        return trigger.anime.pause();
                    case 'reverse':
                        if (!trigger.anime.reversed) trigger.anime.reverse();
                        return trigger.anime.play();
                    case 'restart':
                        if (trigger.anime.reversed) trigger.anime.reverse()
                        return trigger.anime.restart();
                    case 'reset':
                        if (trigger.anime.reversed) trigger.anime.reverse();
                        return trigger.anime.reset();
                    default:
                        return null;
                }
            }

            trigger._onEnter = (trigger, progress) => {
                if (trigger.scrollTrigger.onEnter) trigger.scrollTrigger.onEnter(trigger);
                if(trigger.scrollTrigger.onUpdate) trigger.scrollTrigger.onUpdate(trigger,progress);
                if (!trigger.anime) return null;
                trigger.scrollTrigger.lerp ? trigger.anime.seek(trigger.anime.duration * progress) : triggerAction(trigger.scrollTrigger.actions[0])
            }
            trigger._onLeave = (trigger, progress) => {
                if (trigger.scrollTrigger.onLeave) trigger.scrollTrigger.onLeave(trigger);
                if(trigger.scrollTrigger.onUpdate) trigger.scrollTrigger.onUpdate(trigger,1);
                if (!trigger.anime) return null;
                trigger.scrollTrigger.lerp ? trigger.anime.seek(trigger.anime.duration):  triggerAction(trigger.scrollTrigger.actions[1])
            }

            trigger._onEnterBack = (trigger, progress) => {
                if (trigger.scrollTrigger.onEnterBack) trigger.scrollTrigger.onEnterBack(trigger);
                if(trigger.scrollTrigger.onUpdate) trigger.scrollTrigger.onUpdate(trigger,progress);
                if (!trigger.anime) return null;
                trigger.scrollTrigger.lerp ? trigger.anime.seek(trigger.anime.duration * progress) : triggerAction(trigger.scrollTrigger.actions[2])
            }
            trigger._onLeaveBack = (trigger, progress) => {
                if (trigger.scrollTrigger.onLeaveBack) trigger.scrollTrigger.onLeaveBack(trigger);
                if(trigger.scrollTrigger.onUpdate) trigger.scrollTrigger.onUpdate(trigger,0);
                if (!trigger.anime) return null;
                trigger.scrollTrigger.lerp ? trigger.anime.seek(0): triggerAction(trigger.scrollTrigger.actions[3])
            }

            let triggerRect = trigger.scrollTrigger.trigger.getBoundingClientRect();
            // start trigger offset and scroll offset
            let start = trigger.scrollTrigger.start ?? 'top center';
            start = start.split(' ');
            if (start.length < 2) {
                throw new Error('Start must be in the format of "triggerOffset scrollOffset"')
            }
            trigger.startTriggerOffset = triggerRect.top + triggerRect.height * this.getScrollOffsetPercentage(start[0]);
            trigger.startScrollPosition = start[1];
            let end = trigger.scrollTrigger.end ?? 'bottom center';
            end = end.split(' ');
            if (end.length < 2) {
                throw new Error('end must be in the format of "triggerOffset scrollOffset"')
            }
            trigger.endScrollPosition = end[1];
            trigger.endTriggerOffset = triggerRect.top + triggerRect.height * this.getScrollOffsetPercentage(end[0]);

            trigger.animationTriggerStartOffset = Math.round(trigger.startTriggerOffset - element.clientHeight * this.getScrollOffsetPercentage(trigger.startScrollPosition));
            trigger.animationTriggerEndOffset = Math.round(trigger.endTriggerOffset - element.clientHeight * this.getScrollOffsetPercentage(trigger.endScrollPosition));

            if (trigger.animationTriggerStartOffset >= trigger.animationTriggerEndOffset) {
                console.warn(`Trigger start offset of trigger - ${index} is greater than trigger end offset. This will result in no animation or incomplete animation. Please enable debug and see the offset markers.`)
            }

            // debug offsets
            if (trigger.scrollTrigger.debug) {
                let markerContainer = this.markerContainer ?? this.createMarkerContainer();
                trigger.scrollTrigger.startTriggerOffsetMarker = this.createMarker('5px', '20px', trigger.scrollTrigger.debug.startTriggerOffsetMarker ?? '#ff4949', trigger.startTriggerOffset + 'px', triggerRect.right >= element.clientWidth ? Math.min(element.clientWidth, window.innerWidth) - 20 : triggerRect.right + 'px');
                trigger.scrollTrigger.endTriggerOffsetMarker = this.createMarker('5px', '20px', trigger.scrollTrigger.debug.endTriggerOffsetMarker ?? '#49deff', trigger.endTriggerOffset + 'px', triggerRect.right >= element.clientWidth ? Math.min(element.clientWidth, window.innerWidth) - 20 : triggerRect.right + 'px');
                markerContainer.appendChild(trigger.scrollTrigger.startTriggerOffsetMarker)
                markerContainer.appendChild(trigger.scrollTrigger.endTriggerOffsetMarker)
                trigger.scrollTrigger.startScrollerOffsetMarker = this.createMarker('5px', '24px', trigger.scrollTrigger.debug.startScrollerOffsetMarker ?? '#ff4949', element.clientHeight * this.getScrollOffsetPercentage(trigger.startScrollPosition) + 'px', '0px', 'absolute');
                trigger.scrollTrigger.endScrollerOffsetMarker = this.createMarker('5px', '24px', trigger.scrollTrigger.debug.endScrollerOffsetMarker ?? '#49deff', element.clientHeight * this.getScrollOffsetPercentage(trigger.endScrollPosition) + 'px', '0px', 'absolute');
                markerContainer.appendChild(trigger.scrollTrigger.startScrollerOffsetMarker)
                markerContainer.appendChild(trigger.scrollTrigger.endScrollerOffsetMarker)
            }
        })
        let currentScroll = 0;
        let isVerticalScrolling = false;
        this.animations = animations;
        element.addEventListener('scroll', (e) => {
            isVerticalScrolling = element.scrollTop > currentScroll;
            currentScroll = element.scrollTop;
            animations.forEach((trigger) => {
                let startScrollerOffset = element.scrollTop + element.clientHeight * this.getScrollOffsetPercentage(trigger.startScrollPosition);
                let endScrollerOffset = element.scrollTop + element.clientHeight * this.getScrollOffsetPercentage(trigger.endScrollPosition);
                if (trigger.scrollTrigger.debug) {
                    trigger.scrollTrigger.startScrollerOffsetMarker.style.top = startScrollerOffset + 'px';
                    trigger.scrollTrigger.endScrollerOffsetMarker.style.top = endScrollerOffset + 'px';
                }
                if (element.scrollTop >= trigger.animationTriggerStartOffset && element.scrollTop <= trigger.animationTriggerEndOffset) {
                    if (trigger.scrollTrigger.lerp || !trigger.isActive) {
                        let progress = this.lerp(trigger.animationTriggerStartOffset, trigger.animationTriggerEndOffset, element.scrollTop);
                        isVerticalScrolling ? trigger._onEnter(trigger, progress) : trigger._onEnterBack(trigger, progress);
                    }
                    if (trigger.scrollTrigger.pin ) {
                        let pinElement =  this.getElement(trigger.scrollTrigger.pin,trigger.scrollTrigger.trigger);
                       if(!trigger.pinOffset){
                           trigger.pinOffset = this.getDistanceBetween(pinElement, element, element.scrollTop + element.getBoundingClientRect().top);
                       }
                       if(element.scrollTop >= trigger.pinOffset){
                           trigger.pinContainer ??= this.createPinContainer(pinElement);
                           let translateYDistance = element.scrollTop - trigger.pinOffset - parseInt(window.getComputedStyle(pinElement).marginTop);
                           trigger.pinContainer.style.transform = `translate3d(0,${translateYDistance}px,0)`
                       }
                    }
                    trigger.isActive = true;
                    return;
                }
                if (element.scrollTop >= trigger.animationTriggerEndOffset && trigger.isActive) {
                    trigger._onLeave(trigger);
                    trigger.isActive = false;
                    return;
                }
                if (element.scrollTop < trigger.animationTriggerStartOffset && trigger.isActive) {
                    trigger._onLeaveBack(trigger)
                    trigger.isActive = false;
                    if (trigger.scrollTrigger.pin && trigger.pinContainer) {
                        this.removePinContainer(trigger.pinContainer)
                        trigger.pinContainer = null;
                        trigger.pinOffset = null;
                    }
                }
            })
        })
    }
}
