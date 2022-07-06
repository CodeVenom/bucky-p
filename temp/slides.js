// - - - - - slides handling - - - - -
const RESET_STACK = [
    slide(0, invis),
    slide(0, flatten),
    slideParts(0, invis_offset),
];

let presentationStack = [];
let presentationBackStack = [];

document.addEventListener('keypress', event => {
    switch (event.key) {
        case 'a':
            back();
            break;
        case 'd':
            next();
            break;
        case 'q':
            reset();
            break;
    }
});

// - - - - - slides handling helper functions - - - - -
function randomizedStatus(e, s) {
    if (s.includes('offset')) {
        const tx = randomInt(50) + 'px';
        const ty = randomInt(50) + 'px';
        e.style.transform = `translate(${tx},${ty})`;
    }
}

function pushStatusToBackStack(e, ...s) {
    let flag = true;
    const f = _ => {
        log(s);
        if (flag) {
            e.classList.add.apply(e.classList, s);
        } else {
            e.classList.remove.apply(e.classList, s);
        }
        flag = !flag;
        randomizedStatus(e, s);
    };
    presentationBackStack.unshift(f);
}

function flatten(e) {
    pushStatusToBackStack(e, 'flat');
}

function invis(e) {
    pushStatusToBackStack(e, 'invis');
}

function invis_offset(e) {
    pushStatusToBackStack(e, 'invis', 'offset');
}

function slide(index, f) {
    return _ => {
        f(document.getElementsByClassName('slide')[index]);
    };
}

function slideParts(index, f) {
    return _ => {
        for (const e of document.getElementsByClassName('slide')[index].children) {
            f(e);
        }
    };
}

function reset() {
    presentationStack = [];
    presentationBackStack = [];
    presentationStack.anti = presentationBackStack;
    presentationBackStack.anti = presentationStack;
    for (const f of RESET_STACK) {
        f();
    }
    presentationBackStack.shiftExeAll();
}

function back() {
    log('back');
    presentationBackStack.shiftExe()
}

function next() {
    log('next');
    presentationStack.shiftExe()
}
