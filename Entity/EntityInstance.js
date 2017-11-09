"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var findProps_1 = require("./findProps");
var Transaction_1 = require("./Transaction");
var EntityInstance = /** @class */ (function () {
    function EntityInstance(entity, id) {
        this.entity = entity;
        this.id = id;
        this.originalMethods = {};
        this.obj = Object.create(entity.ctor.prototype);
        if (entity.localStorage.contains(id)) {
            this.transactions = JSON.parse(entity.localStorage.getItem(id));
        }
        else {
            this.transactions = [new Transaction_1.default(entity.localStorage.createID(), entity.ctor)];
        }
        entity.remoteServer.subscribe(this);
        this.replay();
        this.instrument();
    }
    EntityInstance.prototype.replay = function () {
        var trans = this.transacting;
        if (!trans) {
            this.transacting = true;
        }
        try {
            for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
                var t = _a[_i];
                t.perform(this);
            }
        }
        finally {
            if (!trans) {
                this.transacting = false;
            }
        }
    };
    EntityInstance.prototype.instrument = function () {
        var props = findProps_1.default(this.obj);
        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
            var k = props_1[_i];
            if (k.charAt(0) === "$") {
                continue;
            }
            if (this.obj[k] instanceof Function) {
                var f = this.obj[k];
                this.originalMethods[k] = f;
                this.obj[k] = this.wrapFunction(k, f);
            }
        }
    };
    EntityInstance.prototype.wrapFunction = function (name, f) {
        var self = this;
        return function () {
            var args = Array.prototype.slice.call(arguments);
            if (this.transacting) {
                return f.apply(self, args);
            }
            this.transacting = true;
            try {
                var transaction = new Transaction_1.default(self.entity.localStorage.createID(), f, args);
                try {
                    var res = transaction.perform(self);
                    self.transactions.push(transaction);
                    self.entity.remoteServer.notifyNewTransactions(self);
                    return res;
                }
                catch (e) {
                    if (self.entity.ctor.catch) {
                        self.entity.ctor.catch(e, transaction);
                    }
                }
            }
            finally {
                this.transacting = false;
            }
        };
    };
    return EntityInstance;
}());
exports.default = EntityInstance;
