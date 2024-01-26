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

    createPinContainer(pinElement) {
        // create a pin container div and make it relative
        let pinContainer = document.createElement('div');
        pinContainer.className = 'pin-container';
        let style = window.getComputedStyle(pinElement.parentElement);
        let parentRect = pinElement.parentElement.getBoundingClientRect();

        // create a pinner div and make it absolute
        let pinner = document.createElement('div');

        Object.keys(style).forEach((attr) => {
            if (!/(webkit)|(\d+)/i.test(attr)) {
                pinContainer.style[attr] = style[attr];
            }
        })


        pinContainer.style.height = parentRect.height + 'px';
        pinContainer.style.width = parentRect.width + 'px';
        // pinContainer.style.position = 'relative';

        pinner.style.height = pinElement.getBoundingClientRect().height + 'px';
        pinner.style.width = parentRect.width + 'px';
        pinner.style.position = 'absolute';
        pinner.style.left = pinElement.getBoundingClientRect().left - parentRect.left + 'px';
        pinContainer.appendChild(pinner)

        // it is important to insert at the same position and provide.
        if (pinElement.parentElement.children.length > 1) {
            pinElement.insertAdjacentElement('beforebegin', pinContainer)
        } else {
            pinElement.parentElement.appendChild(pinContainer)
        }
        pinner.prepend(pinElement)
        return pinContainer;
    }

    removePinContainer(pinContainer) {
        // it is important to insert at the same position.
        let parentEl = pinContainer.parentElement;
        if (parentEl.children.length > 1) {
            pinContainer.replaceWith(pinContainer.children[0].children[0])
        } else {
            parentEl.appendChild(pinContainer.children[0].children[0]);
        }
        pinContainer.remove();
    }

    getElement(el, defaultEl) {
        if (typeof el === "string") return document.querySelector(el);
        if (typeof el === "object") return el;
        return defaultEl;
    }

    getDistanceBetween(triggerElement, scrollerElement, currentViewportScrollOffset = 0) {
        // DOMRect top is relative to the parent so we need to check if element's parent is the target parent element.
        const getTopRelativeToBody = (el, scrollTop, debug = false) => {
            let offset = 0;
            let org = el;
            while (true) {
                offset += el.getBoundingClientRect().top + currentViewportScrollOffset - parseInt(window.getComputedStyle(el).marginTop);
                if(debug){
                    console.log(org,el,offset)
                }
                if (!el.parentElement || el.tagName === 'BODY') {
                    break;
                }
                el = el.parentElement;
            }
            return offset;
        }

        const triggerTop = getTopRelativeToBody(triggerElement, currentViewportScrollOffset,true);
        const scrollerTop = getTopRelativeToBody(scrollerElement, 0);
         return Math.abs(scrollerTop - triggerTop);
    }

    getTransformValue(obj, propName, unit) {
        // matrix(scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY())
        // matrix(   m11 a,      b,        c,   m22  d,      m41   e,       m42   f)
        const defaultVal = stringContains(propName, 'scale') ? 1 : 0 + getTransformUnit(propName);
        const value = getElementTransforms(el).get(propName) || defaultVal;
        if (animatable) {
            animatable.transforms.list.set(propName, value);
            animatable.transforms['last'] = propName;
        }
        return unit ? convertPxToUnit(el, value, unit) : value;
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
            if (trigger.targets) {
                if (trigger.scrollTrigger.lerp) {
                    if(trigger.scrollTrigger.smooth){
                        let originalTargets = trigger.targets;
                        // determine if target are string or array
                        if(typeof originalTargets === 'string'){
                            originalTargets = document.querySelectorAll(originalTargets)
                        }
                        let newTargets = [];
                        originalTargets.forEach((originalTarget)=>{
                            let newTarget = originalTarget;
                            if (typeof originalTarget === 'string'){
                                newTarget = document.querySelector(originalTarget)
                            }
                            if(newTarget instanceof Element || newTarget instanceof HTMLElement){
                                newTarget = Object.assign({}, window.getComputedStyle(newTarget))
                                // unflatten transform matrix
                                let matrix = newTarget.transform;
                                newTarget.scaleX = 0;
                                newTarget.scaleY = 0;
                                newTarget.skewX = 0;
                                newTarget.skewY = 0;
                                newTarget.translateX = 0;
                                newTarget.translateY = 0;
                                if(matrix !== 'none'){
                                    // matrix(scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY())
                                    // matrix(   m11 a,      b,        c,   m22  d,      m41   e,       m42   f)
                                    let unflattenMatrix = matrix.match(/(\d+)/g);
                                    newTarget.scaleX = parseFloat(unflattenMatrix[0]);
                                    newTarget.scaleY = parseFloat(unflattenMatrix[3]);
                                    newTarget.skewX = parseFloat(unflattenMatrix[2]);
                                    newTarget.skewY = parseFloat(unflattenMatrix[1]);
                                    newTarget.translateX = parseFloat(unflattenMatrix[4]);
                                    newTarget.translateY = parseFloat(unflattenMatrix[5]);
                                }
                            }
                            if(!newTarget){
                                return;
                            }
                            newTargets.push(newTarget)
                        })
                        trigger.animations.easing ??= 'easeOutQuart'
                        trigger.fakeAnime = anime({
                            targets: newTargets,
                            ...trigger.animations,
                            autoplay: false,
                        })
                    }else{
                        trigger.animations.easing = 'linear'
                    }
                }
                trigger.anime = anime({
                    targets: trigger.targets,
                    ...trigger.animations,
                    autoplay: false,
                })
            }

            let animationTimeout = null;

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
                if (trigger.scrollTrigger.onEnter && !trigger.isActive) trigger.scrollTrigger.onEnter(trigger);
                if (trigger.scrollTrigger.onUpdate) trigger.scrollTrigger.onUpdate(trigger, progress);
                if (!trigger.anime) return null;
                if(trigger.fakeAnime){
                    if(animationTimeout)clearTimeout(animationTimeout)
                    trigger.fakeAnime.seek(trigger.fakeAnime.duration * progress)
                    let animation = {};
                    trigger.fakeAnime.animations.forEach((a) => {
                        if (!animation[a.property]) {
                            animation[a.property] = [];
                        }
                        if(typeof a.currentValue === 'string')a.currentValue = a.currentValue.trim();
                        let parse = parseFloat(a.currentValue)
                        if(parse) a.currentValue = parse;
                        animation[a.property][a.animatable.id] = a.currentValue;
                    })
                    let c = {};
                    Object.keys(animation).forEach((g)=>{
                        c[g] = (_,index) => animation[g][index];
                    })
                    let params =  {
                        targets: trigger.targets,
                        ...c,
                        easing: 'linear',
                        duration: 600,
                        autoplay: true,
                    }
                    animationTimeout = setTimeout(()=>{
                        params.easing = trigger.animations.easing;
                        params.duration = 1000;
                        anime(params)
                    },300)
                    anime(params)
                    return;
                }
                trigger.scrollTrigger.lerp ? trigger.anime.seek(trigger.anime.duration * progress) : triggerAction(trigger.scrollTrigger.actions[0])
            }
            trigger._onLeave = (trigger, progress) => {
                if (trigger.scrollTrigger.onLeave) trigger.scrollTrigger.onLeave(trigger);
                if (trigger.scrollTrigger.onUpdate) trigger.scrollTrigger.onUpdate(trigger, 1);
                if (!trigger.anime) return null;
                trigger.scrollTrigger.lerp ? trigger.anime.seek(trigger.anime.duration) : triggerAction(trigger.scrollTrigger.actions[1])
            }

            trigger._onEnterBack = (trigger, progress) => {
                if (trigger.scrollTrigger.onEnterBack && !trigger.isActive) trigger.scrollTrigger.onEnterBack(trigger);
                if (trigger.scrollTrigger.onUpdate) trigger.scrollTrigger.onUpdate(trigger, progress);
                if (!trigger.anime) return null;
                if(trigger.fakeAnime){
                    if(animationTimeout)clearTimeout(animationTimeout)
                    trigger.fakeAnime.seek(trigger.fakeAnime.duration * progress)
                    let animation = {};
                    trigger.fakeAnime.animations.forEach((a) => {
                        if (!animation[a.property]) {
                            animation[a.property] = [];
                        }
                        if(typeof a.currentValue === 'string')a.currentValue = a.currentValue.trim();
                        let parse = parseFloat(a.currentValue)
                        if(parse) a.currentValue = parse;
                        animation[a.property][a.animatable.id] = a.currentValue;
                    })

                    let c = {};
                    Object.keys(animation).forEach((g)=>{
                        c[g] = (_,index) => animation[g][index];
                    })
                    let params =  {
                        targets: trigger.targets,
                        ...c,
                        easing: 'linear',
                        duration: 600,
                        autoplay: true,
                    }
                    animationTimeout = setTimeout(()=>{
                        params.easing = trigger.animations.easing;
                        params.duration = 1000;
                        anime(params)
                    },300)
                    anime(params)
                    return;
                }
                trigger.scrollTrigger.lerp ? trigger.anime.seek(trigger.anime.duration * progress) : triggerAction(trigger.scrollTrigger.actions[2])
            }
            trigger._onLeaveBack = (trigger, progress) => {
                if (trigger.scrollTrigger.onLeaveBack) trigger.scrollTrigger.onLeaveBack(trigger);
                if (trigger.scrollTrigger.onUpdate) trigger.scrollTrigger.onUpdate(trigger, 0);
                if (!trigger.anime) return null;
                trigger.scrollTrigger.lerp ? trigger.anime.seek(0) : triggerAction(trigger.scrollTrigger.actions[3])
            }

            let triggerRect = trigger.scrollTrigger.trigger.getBoundingClientRect();
            // start trigger offset and scroll offset
            let start = trigger.scrollTrigger.start ?? 'top center';
            start = start.split(' ');
            if (start.length < 2) {
                throw new Error('Start must be in the format of "triggerOffset scrollOffset"')
            }
            // it is important to take scroller scroll top offset into account.
            trigger.startTriggerOffset = triggerRect.top + element.scrollTop + triggerRect.height * this.getScrollOffsetPercentage(start[0]);
            trigger.startScrollPosition = start[1];
            let end = trigger.scrollTrigger.end ?? 'bottom center';
            end = end.split(' ');
            if (end.length < 2) {
                throw new Error('end must be in the format of "triggerOffset scrollOffset"')
            }
            trigger.endScrollPosition = end[1];
            trigger.endTriggerOffset = triggerRect.top +  element.scrollTop  + triggerRect.height * this.getScrollOffsetPercentage(end[0]);

            trigger.animationTriggerStartOffset = Math.round(trigger.startTriggerOffset - element.clientHeight * this.getScrollOffsetPercentage(trigger.startScrollPosition));
            trigger.animationTriggerEndOffset = Math.round(trigger.endTriggerOffset - element.clientHeight * this.getScrollOffsetPercentage(trigger.endScrollPosition));

            if (trigger.animationTriggerStartOffset >= trigger.animationTriggerEndOffset) {
                console.warn(`Start offset of trigger - ${index} is greater than trigger end offset. This will result in no animation or incomplete animation. Please enable debug and see the offset markers.`)
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
        let currentScroll = element.scrollTop;
        let isVerticalScrolling = false;
        this.animations = animations;
        let pinElement = null;
        let topOffset = 0;
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
                    if (trigger.scrollTrigger.pin) {
                        pinElement ??= (()=>{
                            let pinElement = trigger.scrollTrigger.pin;
                            if(typeof trigger.scrollTrigger.pin === 'object'){
                                if(trigger.scrollTrigger.pin.element) pinElement =  trigger.scrollTrigger.pin.element;
                                if(trigger.scrollTrigger.pin.top) topOffset = trigger.scrollTrigger.pin.top;
                            }
                            return this.getElement(pinElement, trigger.scrollTrigger.trigger);
                        })()
                        if(!trigger.pinOffset){
                            trigger.pinOffset = element.scrollTop - parseInt(topOffset) + element.getBoundingClientRect().top + pinElement.getBoundingClientRect().top - parseInt(window.getComputedStyle(pinElement).marginTop);
                        }
                        if (element.scrollTop >= trigger.pinOffset) {
                            trigger.pinContainer ??= this.createPinContainer(pinElement);
                            let translateYDistance = element.scrollTop - trigger.pinOffset;
                            trigger.pinContainer.children[0].style.setProperty('top', translateYDistance + 'px');
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
