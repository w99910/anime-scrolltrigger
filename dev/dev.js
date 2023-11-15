import AnimeScrollTrigger from "../src/anime-scrolltrigger";

let container = document.getElementById('container');

let boxes = container.querySelectorAll('.box');

let animations = []
animations.push({
    targets: boxes,
    // opacity: [0, 1],
    // background: '#000',
    // translateY: (e, i) => -i * 400,
    scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '80% center',
        debug: true,
        lerp: true,
        actions: "play none none reverse",
        pin: true,
        onEnter: (trigger, progress) => console.log('enter', progress),
        onLeave: () => console.log('onLeave'),
        onEnterBack: (trigger, progress) => console.log('enterback', progress),
        onLeaveBack: (trigger, progress) => console.log('leaveback', progress),
    }
})

setTimeout(() => {
    new AnimeScrollTrigger(document.body, animations)
}, 300)

