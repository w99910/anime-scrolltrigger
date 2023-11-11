import anime from "animejs";

export default class ScrollAnime {
    getScrollOffset(position) {
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

    lerp(start, end, current) {
        let distance = Math.abs(end - start);
        let currentDist = Math.max(end - current, 0);
        return 1.0 - Math.min(currentDist / distance, 1);
    }

    constructor(element, triggers) {
        triggers.forEach((trigger) => {
            trigger.animations = {};
            trigger.hasTriggered = false;
            trigger.isActive = false;
            trigger.scrollTrigger.actions ??= 'play none none reverse';
            trigger.scrollTrigger.actions = trigger.scrollTrigger.actions.split(' ');
            if (trigger.scrollTrigger.actions.length < 4) {
                throw new Error('Actions attribute should have four values. e.g, "play none none reset"');
            }
            Object.keys(trigger).forEach((key) => {
                if (!['targets', 'scrollTrigger', 'animations'].includes(key)) {
                    trigger.animations[key] = trigger[key]
                }
            })
            if (trigger.scrollTrigger.lerp) {
                trigger.animations.easing = 'linear'
            }
            let params = {
                targets: trigger.targets,
                ...trigger.animations,
                autoplay: false,
            };
            if (trigger.scrollTrigger.onUpdate) {
                params.update = trigger.scrollTrigger.onUpdate;
            }
            trigger.anime = anime(params)

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
                if (trigger.scrollTrigger.onEnter) trigger.scrollTrigger.onEnter(trigger, progress);
                trigger.scrollTrigger.lerp ? trigger.anime.seek(trigger.anime.duration * progress) : triggerAction(trigger.scrollTrigger.actions[0])
            }
            trigger._onLeave = (trigger, progress) => {
                if (trigger.scrollTrigger.onLeave) trigger.scrollTrigger.onLeave(trigger, progress);
                triggerAction(trigger.scrollTrigger.actions[1])
            }

            trigger._onEnterBack = (trigger, progress) => {
                if (trigger.scrollTrigger.onEnterBack) trigger.scrollTrigger.onEnterBack(trigger, progress);
                trigger.scrollTrigger.lerp ? trigger.anime.seek(trigger.anime.duration * progress) : triggerAction(trigger.scrollTrigger.actions[2])
            }
            trigger._onLeaveBack = (trigger, progress) => {
                if (trigger.scrollTrigger.onLeaveBack) trigger.scrollTrigger.onLeaveBack(trigger, progress);
                triggerAction(trigger.scrollTrigger.actions[3])
            }

            let triggerRect = trigger.scrollTrigger.trigger.getBoundingClientRect();
            // start trigger offset and scroll offset
            let start = trigger.scrollTrigger.start ?? 'top center';
            start = start.split(' ');
            if (start.length < 2) {
                throw new Error('Start must be in the format of "triggerOffset scrollOffset"')
            }
            trigger.startTriggerOffset = triggerRect.top + triggerRect.height * this.getScrollOffset(start[0]);
            trigger.startScrollPosition = start[1];
            let end = trigger.scrollTrigger.end ?? 'bottom center';
            end = end.split(' ');
            if (end.length < 2) {
                throw new Error('end must be in the format of "triggerOffset scrollOffset"')
            }
            trigger.endScrollPosition = end[1];
            trigger.endTriggerOffset = triggerRect.top + triggerRect.height * this.getScrollOffset(end[0]);

            trigger.animationTriggerStartOffset = trigger.startTriggerOffset - element.clientHeight * this.getScrollOffset(trigger.startScrollPosition);
            trigger.animationTriggerEndOffset = trigger.endTriggerOffset - element.clientHeight * this.getScrollOffset(trigger.endScrollPosition);

            // debug offsets
            if (trigger.scrollTrigger.debug) {
                element.style.position = 'relative';
                trigger.scrollTrigger.startTriggerOffsetMarker = this.createMarker('5px', '20px', '#ff4949', trigger.startTriggerOffset + 'px');
                trigger.scrollTrigger.endTriggerOffsetMarker = this.createMarker('5px', '20px', '#49deff', trigger.endTriggerOffset + 'px');
                trigger.scrollTrigger.trigger.appendChild(trigger.scrollTrigger.startTriggerOffsetMarker)
                trigger.scrollTrigger.trigger.appendChild(trigger.scrollTrigger.endTriggerOffsetMarker)
                trigger.scrollTrigger.startScrollerOffsetMarker = this.createMarker('5px', '24px', '#ff4949', element.clientHeight * this.getScrollOffset(trigger.startScrollPosition) + 'px', '0px', 'absolute');
                trigger.scrollTrigger.endScrollerOffsetMarker = this.createMarker('5px', '24px', '#49deff', element.clientHeight * this.getScrollOffset(trigger.endScrollPosition) + 'px', '0px', 'absolute');
                trigger.scrollTrigger.trigger.appendChild(trigger.scrollTrigger.startScrollerOffsetMarker)
                trigger.scrollTrigger.trigger.appendChild(trigger.scrollTrigger.endScrollerOffsetMarker)
            }
        })
        let currentScroll = 0;
        let isVerticalScrolling = false;
        element.addEventListener('scroll', (e) => {
            isVerticalScrolling = element.scrollTop > currentScroll;
            currentScroll = element.scrollTop;
            triggers.forEach((trigger) => {
                let startScrollerOffset = element.scrollTop + element.clientHeight * this.getScrollOffset(trigger.startScrollPosition);
                let endScrollerOffset = element.scrollTop + element.clientHeight * this.getScrollOffset(trigger.endScrollPosition);
                if (trigger.scrollTrigger.debug) {
                    trigger.scrollTrigger.startScrollerOffsetMarker.style.top = startScrollerOffset + 'px';
                    trigger.scrollTrigger.endScrollerOffsetMarker.style.top = endScrollerOffset + 'px';
                }
                // console.log([startScrollerOffset, endScrollerOffset], [trigger.startTriggerOffset, trigger.endTriggerOffset], trigger.isActive)
                if (startScrollerOffset >= trigger.startTriggerOffset && (trigger.scrollTrigger.lerp || !trigger.isActive) && endScrollerOffset <= trigger.endTriggerOffset) {
                    let progress = this.lerp(trigger.animationTriggerStartOffset, trigger.animationTriggerEndOffset, element.scrollTop);
                    if (progress > 0.99 || progress < 0.09) progress = Math.round(progress);
                    isVerticalScrolling ? trigger._onEnter(trigger, progress) : trigger._onEnterBack(trigger, progress);
                    trigger.isActive = true
                    return;
                }
                if (endScrollerOffset >= trigger.endTriggerOffset && trigger.isActive) {
                    trigger._onLeave(trigger);
                    trigger.isActive = false;
                    return;
                }

                if (startScrollerOffset < trigger.startTriggerOffset && trigger.isActive) {
                    trigger.isActive = false;
                    trigger._onLeaveBack(trigger)
                }

            })
        })
    }
}
