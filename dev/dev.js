import AnimeScrollTrigger from "../src/anime-scrolltrigger";

let container = document.getElementById('container');

let boxes = container.querySelectorAll('.box');

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
    },
    {
        targets: boxes[1],
        backgroundColor: '#a993ff',
        easing: 'linear',
        scrollTrigger: {
            trigger: boxes[1],
            start: 'top 40%',
            end: 'bottom center',
            lerp: true,
        }
    },
    {
        targets: boxes[2],
        backgroundColor: '#02cdf1',
        easing: 'linear',
        scrollTrigger: {
            trigger: boxes[2],
            start: 'top 60%',
            end: 'bottom 80%',
            lerp: true,
            debug: {
                startTriggerOffsetMarker: '#f6a945',
                endTriggerOffsetMarker: '#ffd291',
                startScrollerOffsetMarker: '#4b45f6',
                endScrollerOffsetMarker: '#d5d4ff',
            },
        }
    },
    {
        targets: boxes[3],
        translateY: 200,
        easing: 'linear',
        scrollTrigger: {
            trigger: boxes[3],
            lerp: true,
            start: 'top 60%',
            end: 'bottom 80%',
            // debug: true,
        }
    }
]

new AnimeScrollTrigger(container, animations);