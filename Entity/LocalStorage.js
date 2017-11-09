"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultLocalStorage = /** @class */ (function () {
    function DefaultLocalStorage() {
        this.objects = {};
    }
    DefaultLocalStorage.prototype.contains = function (key) {
        return key in this.objects;
    };
    DefaultLocalStorage.prototype.getItem = function (key) {
        return this.objects[key];
    };
    DefaultLocalStorage.prototype.setItem = function (key, value) {
        this.objects[key] = value;
    };
    DefaultLocalStorage.prototype.createID = function () {
        var id = parseInt(this.getItem("local-id-enumerator")) || 0;
        this.setItem("local-id-enumerator", "" + (id + 1));
        return "local-id-" + id;
    };
    DefaultLocalStorage.singleton = function () {
        if (DefaultLocalStorage._singleton == null) {
            DefaultLocalStorage._singleton = new DefaultLocalStorage();
        }
        return DefaultLocalStorage._singleton;
    };
    DefaultLocalStorage._singleton = null;
    return DefaultLocalStorage;
}());
exports.DefaultLocalStorage = DefaultLocalStorage;
