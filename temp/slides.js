// - - - - - slides handling - - - - -
const DEFAULT_STATUS_OPTIONS = {
    batchKey: undefined,
    invert: false,
    maxOffset: 50,
    maxRotation: 0,
};

// TODO: build reset stack automatically based on custom html attributes
const RESET_STACK = [
    slide(0, invis),
    slide(0, flatten),
    slideParts(0, invis_transform),
    slide(0, withOptions(invis).invert().result),

    slide(1, invis),
    slidePartsNested(1, withOptions(shrink).batch('schedule').result, 5),
    slide(1, withOptions(invis).invert().result),

    slide(2, invis),
    slidePartsNested(2, withOptions(flatten).batch('release-day').result, 5),
    slide(2, withOptions(invis).invert().result),

    // slide(3, invis),
    slidePartsNested(
        3,
        withOptions(invis_transform).batch('releases').maxOffset(12).maxRotation(3).result,
        3
    ),
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
function randomizedStatus(e, o, s) {
    const maxOffset = o.maxOffset;
    const maxRotation = o.maxRotation;

    if (s.includes('transform')) {
        const tx = randomInt(maxOffset) + 'px';
        const ty = randomInt(maxOffset) + 'px';
        const r = randomDeviation(maxRotation * 2) + 'deg';
        e.style.transform = `translate(${tx},${ty}) rotate(${r})`;
    }
}

function pushStatusToBackStack(
    e,
    o = {...DEFAULT_STATUS_OPTIONS},
    ...s
) {
    let flag = !o.invert;
    const f = _ => {
        if (flag) {
            e.classList.add.apply(e.classList, s);
        } else {
            e.classList.remove.apply(e.classList, s);
        }
        flag = !flag;
        randomizedStatus(e, o, s);
    };
    f.slideOptions = o;
    // presentationBackStack.unshift(f);
    // TODO: find a better way to determine id
    f.slideOptions.id = presentationBackStack.unshift(f);
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

function invis_transform(e, o) {
    pushStatusToBackStack(
        e,
        o,
        'invis',
        'transform',
    );
}

function withOptions(f) {
    const x = {
        options: {...DEFAULT_STATUS_OPTIONS},
        result: e => {
            f(e, x.options);
        },
    };

    x.batch = key => {
        x.options.batchKey = key;
        return x;
    };

    x.invert = _ => {
        x.options.invert = true;
        return x;
    };

    x.maxOffset = p => {
        x.options.maxOffset = p;
        return x;
    }

    x.maxRotation = p => {
        x.options.maxRotation = p;
        return x;
    }

    return x;
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

function slideStep(stack) {
    if (stack.length < 1) {
        return;
    }

    // TODO: consider differentiating between instant batch and animation frame batch
    // TODO: find a more elegant solution for this
    const f = stack[0];
    const batchKey = f.slideOptions.batchKey;
    if (batchKey) {
        let counter = 0;
        for (const item of stack) {
            if (item.slideOptions.batchKey === batchKey) {
                counter++;
            }
        }
        currentPresentationStack = stack;
        desiredSlideSteps = counter;
        return;
    }

    stack.shiftExe();
}

function back() {
    log('back');
    slideStep(presentationBackStack);
}

function next() {
    log('next');
    slideStep(presentationStack);
}
