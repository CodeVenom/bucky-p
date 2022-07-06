// - - - - - slides handling - - - - -
const DEFAULT_STATUS_OPTIONS = {
    invert: false,
};

const RESET_STACK = [
    slide(0, invis),
    slide(0, flatten),
    slideParts(0, invis_offset),
    slide(0, invertStatus(invis)),
    slide(1, invis),
    slidePartsNested(1, shrink, 3),
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

function pushStatusToBackStack(
    e,
    o = DEFAULT_STATUS_OPTIONS,
    ...s
) {
    let flag = !o.invert;
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

function flatten(e, o) {
    pushStatusToBackStack(
        e,
        o,
        'flat',
    );
}

function invis(e, o) {
    pushStatusToBackStack(
        e,
        o,
        'invis',
    );
}

function shrink(e, o) {
    pushStatusToBackStack(
        e,
        o,
        'shrink',
    );
}

function invis_offset(e, o) {
    pushStatusToBackStack(
        e,
        o,
        'invis',
        'offset',
    );
}

// TODO: define this as a function prototype
function invertStatus(f) {
    return withOptions(
        f,
        {
            invert: true,
        },
    );
}

function withOptions(f, o) {
    return e => {
        f(e, o);
    };
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

function slidePartsNested(index, f, depth) {
    return _ => {
        const elements = nestedChildren(
            [document.getElementsByClassName('slide')[index]],
            depth,
        );
        for (const e of elements) {
            f(e);
        }
    };
}

function nestedChildren(elements, depth) {
    if (depth === 0) {
        return elements;
    }
    const stack = [];
    for (const e of elements) {
        for (const c of e.children) {
            stack.push(c);
        }
    }
    return nestedChildren(stack, depth - 1);
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
