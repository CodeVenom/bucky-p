// - - - - - prototypes - - - - -
Array.prototype.shiftExe = function () {
    const f = this.shift();
    if (f !== undefined) {
        // log('exe: ' + f.slideOptions.id);
        f();
        this.anti.unshift(f);
    }
    return f;
};

Array.prototype.shiftExeAll = function () {
    let l = this.length;
    while (l--) {
        this.shiftExe();
    }
};

// - - - - - wrappers - - - - -
function cw() {
    return document.body.clientWidth;
}

function ch() {
    return document.body.clientHeight;
}

// - - - - - aliases - - - - -
// TODO: introduce log levels
log = console.log;
