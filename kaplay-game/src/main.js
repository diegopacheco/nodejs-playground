import kaplay from "kaplay";

kaplay({
    background: "#6d80fa",
});

loadSprite("bean", "https://play.kaplayjs.com/bean.png");

add([
    sprite("bean"), 
]);

const player = add([
    rect(40, 40),
    pos(100, 200), 
    area(),
    body(),
    health(8),
    "friendly",
    {
        dir: vec2(-1, 0),
        dead: false,
        speed: 240,
    },
]);

player.onCollide("enemy", () => {
    player.hp--;
});

player.onUpdate(() => {
    if (player.pos.y >= height()) {
        destroy(player);
    }
});

onUpdate("enemy", (enemy) => {
    enemy.move(-400, 0);
});

onKeyDown("w", () => {
    player.move(0, -100);
});

onKeyDown("s", () => {
    player.move(0, 100);
});

onKeyDown("a", () => {
    player.move(-100, 0);
});

onKeyDown("d", () => {
    player.move(100, 0);
});