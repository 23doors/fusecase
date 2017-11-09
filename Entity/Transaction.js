"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction = /** @class */ (function () {
    function Transaction(localId, method, args) {
        this.localId = localId;
        this.method = method;
        this.args = args;
        this.remoteId = null;
    }
    Transaction.prototype.perform = function (instance) {
        return this.method.apply(instance.obj, this.args);
    };
    Transaction.prototype.canonize = function (remoteId) {
        this.remoteId = remoteId;
    };
    return Transaction;
}());
exports.default = Transaction;
