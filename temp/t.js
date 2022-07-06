const INNER_SPAWN_OFFSET = 200;
const MOVE_SPEED_MIN = 2;
const MOVE_SPEED_MAX = 10;
const SPAWN_CHANCE_MIN = 1;
const SPAWN_CHANCE_MAX = 4;
const SPAWN_SPEED = 1;

let start, checkpoint;
let done = false;
let seconds = 0;
let spawns = 0;

function step(timestamp) {
    if (start === undefined) {
        start = timestamp;
    }
    const nextSecond = Math.floor(timestamp / 1000) !== Math.floor(checkpoint / 1000);
    const elapsed = timestamp - start;

    if (nextSecond) {
        seconds++;
        // log('tick');

        if (seconds % SPAWN_SPEED === 0) {
            spawnRandom();
        }
    }

    checkpoint = timestamp;
    if (!done) {
        const spawned = document.getElementsByClassName('spawned');
        for (const i of spawned) {
            i.classList.remove('tiny-font');
            move(i);
            if (isOutOfSight(i)) {
                i.remove();
            }
        }

        window.requestAnimationFrame(step);
    }
}

// window.requestAnimationFrame(step);