import AnimeScrollTrigger from "../src/anime-scrolltrigger";

let container = document.getElementById('container');

let boxes = container.querySelectorAll('.box');

let animations = []
animations.push({
    targets: boxes,
    // opacity: [0, 1],
    background: '#000',
    // translateY: (e, i) => -i * 400,
    scrollTrigger: {
        trigger: container,
        start: '10% top',
        end: '80% center',
        debug: true,
        lerp: true,
        actions: "play none none reverse",
        pin: true,
    }
})

setTimeout(() => {
    new AnimeScrollTrigger(document.body, animations)
}, 300)

