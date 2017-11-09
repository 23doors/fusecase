"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultRemoteServer = /** @class */ (function () {
    function DefaultRemoteServer() {
        this.idEnum = 0;
    }
    DefaultRemoteServer.singleton = function () {
        if (DefaultRemoteServer._singleton == null) {
            DefaultRemoteServer._singleton = new DefaultRemoteServer();
        }
        return DefaultRemoteServer._singleton;
    };
    DefaultRemoteServer.prototype.subscribe = function (instance) {
    };
    DefaultRemoteServer.prototype.notifyNewTransactions = function (instance) {
        for (var _i = 0, _a = instance.transactions; _i < _a.length; _i++) {
            var t = _a[_i];
            t.canonize("remote-" + this.idEnum++);
        }
    };
    DefaultRemoteServer._singleton = null;
    return DefaultRemoteServer;
}());
exports.DefaultRemoteServer = DefaultRemoteServer;
