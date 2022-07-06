Array.prototype.shiftExe = function () {
    const f = this.shift();
    if (f !== undefined) {
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
