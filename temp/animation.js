// - - - - - generic animation stuff - - - - -
function spawnRandom() {
    let count = SPAWN_CHANCE_MIN + Math.floor(Math.random() * (SPAWN_CHANCE_MAX - SPAWN_CHANCE_MIN));
    while (0 < count--) {
        spawn(
            randomInt(cw() - INNER_SPAWN_OFFSET * 2),
            randomInt(ch() - INNER_SPAWN_OFFSET * 2),
        );
    }
}

function spawn(x, y) {
    // log('spawn');
    let ox = 1000 + INNER_SPAWN_OFFSET - 50 + x;
    let oy = 1000 + INNER_SPAWN_OFFSET - 50 + y;
    let gamepad = document.getElementsByClassName(randomSpawnClass())[0];
    let clone = gamepad.cloneNode();
    clone.spatial = {
        origin: {
            x: ox,
            y: oy,
        },
        position: {
            x: ox,
            y: oy,
        },
        direction: {
            x: Math.random() - .5,
            y: Math.random() - .5,
        },
        speed: {
            base: MOVE_SPEED_MIN + Math.random() * (MOVE_SPEED_MAX - MOVE_SPEED_MIN),
        },
    }
    clone.classList.add('spawned');
    clone.classList.add(randomColorClass());
    clone.classList.add('tiny-font');
    clone.id = 'spawn-' + (spawns++);
    move(clone);
    document.body.append(clone);
}

function move(e) {
    if (!'spatial' in e) {
        return;
    }

    const p = e.spatial.position;
    const d = e.spatial.direction;
    const s = e.spatial.speed;

    p.x += d.x * s.base;
    p.y += d.y * s.base;

    const tx = p.x + 'px';
    const ty = p.y + 'px';

    e.style.transform = `translate(${tx},${ty})`;
}

function isOutOfSight(e) {
    const bb = e.getBoundingClientRect();
    return bb.bottom < 0 || bb.right < 0 || bb.top > ch() || bb.left > cw();
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function randomSpawnClass() {
    const classes = [
        'gamepad',
        'leaf',
        'clock',
        'maple',
        'laugh',
        'moon',
        'knight',
    ];
    const index = (Math.floor(Math.random() * classes.length) % classes.length);
    return classes[index] + '-0';
}

function randomColorClass() {
    return 'color-' + (Math.floor(Math.random() * 6) % 6);
}

function cw() {
    return document.body.clientWidth;
}

function ch() {
    return document.body.clientHeight;
}

log = console.log;
