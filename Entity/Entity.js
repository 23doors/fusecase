"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityInstance_1 = require("./EntityInstance");
var RemoteServer_1 = require("./RemoteServer");
var LocalStorage_1 = require("./LocalStorage");
var entityClasses = {};
var Entity = /** @class */ (function () {
    function Entity(ctor, remoteServer, localStorage) {
        if (remoteServer === void 0) { remoteServer = RemoteServer_1.DefaultRemoteServer.singleton(); }
        if (localStorage === void 0) { localStorage = LocalStorage_1.DefaultLocalStorage.singleton(); }
        this.ctor = ctor;
        this.remoteServer = remoteServer;
        this.localStorage = localStorage;
        this.instances = {};
        entityClasses[ctor.name] = this;
    }
    Entity.prototype.singleton = function () {
        return this.loadInstance(this.ctor.name + "-singleton").obj;
    };
    Entity.prototype.get = function (id) {
        return this.loadInstance(this.ctor.name + "-instance-" + id).obj;
    };
    Entity.prototype.loadInstance = function (id) {
        if (!(id in this.instances)) {
            this.instances[id] = new EntityInstance_1.default(this, id);
        }
        return this.instances[id];
    };
    return Entity;
}());
exports.default = Entity;
