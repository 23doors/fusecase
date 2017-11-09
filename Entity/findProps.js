"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findProps(obj, arr) {
    if (arr === void 0) { arr = []; }
    var keys = Object.getOwnPropertyNames(obj);
    for (var i in keys) {
        var p = keys[i];
        if (p === "constructor") {
            continue;
        }
        arr.push(p);
    }
    // Include members from object's prototype chain (to allow ES6 classes)
    var proto = Object.getPrototypeOf(obj);
    if (proto && proto !== Object.prototype) {
        return findProps(proto, arr);
    }
    return arr;
}
exports.default = findProps;
