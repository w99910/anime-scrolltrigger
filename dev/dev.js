import AnimeScrollTrigger from "../src/anime-scrolltrigger";

let container = document.getElementById('container');

let boxes = container.querySelectorAll('.box');

// let animations = []
// animations.push({
//     targets: boxes,
//     // opacity: [0, 1],
//     background: '#000',
//     // translateY: (e, i) => -i * 400,
//     scrollTrigger: {
//         trigger: container,
//         start: 'top top',
//         end: '80% center',
//         debug: true,
//         lerp: true,
//         actions: "play none none reverse",
//         pin: true,
//         onEnter: (trigger, progress) => console.log('enter', progress),
//         onLeave: () => console.log('onLeave'),
//         onEnterBack: (trigger, progress) => console.log('enterback', progress),
//         onLeaveBack: (trigger, progress) => console.log('leaveback', progress),
//     }
// })

let animations = [
    {
        targets: boxes[0],
        translateX: 100,
        easing: "linear",
        scrollTrigger: {
            trigger: boxes[0],
            start: "3% top",
            end: "bottom 30%",
            pin: true,
            lerp: true,
        }
    },
    {
        targets: boxes[1],
        backgroundColor: "#a993ff",
        easing: "linear",
        scrollTrigger: {
            trigger: boxes[1],
            start: "top 40%",
            end: "bottom center",
            lerp: true
        }
    },
    {
        targets: boxes[2],
        backgroundColor: "#02cdf1",
        easing: "linear",
        scrollTrigger: {
            trigger: boxes[2],
            start: "top 60%",
            end: "bottom 30%",
            lerp: true,
        }
    },
    {
        targets: boxes[3],
        translateY: -100,
        easing: "linear",
        scrollTrigger: {
            trigger: boxes[3],
            lerp: true,
            start: "top 60%",
            end: "bottom 80%"
        }
    }
];


setTimeout(() => {
    new AnimeScrollTrigger(document.body, animations)
}, 300)

