"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var HOST = 'syncano.space';
var DEFAULT_HEADERS = { 'Content-Type': 'application/json' };
var Transaction_1 = require("./Transaction");
var Server = /** @class */ (function () {
    function Server(instanceName, token) {
        this.sentTransactions = new Set();
        this.url = "https://" + instanceName + ".syncano.space/";
        this.token = token;
    }
    Server.prototype.notifyNewTransactions = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            var latestTid, transactions, transaction, i, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        latestTid = undefined;
                        transactions = instance.transactions;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < transactions.length)) return [3 /*break*/, 4];
                        transaction = transactions[i];
                        if (i > 0) {
                            latestTid = transactions[i - 1].localId;
                        }
                        if (this.sentTransactions.has(transaction.localId)) {
                            return [3 /*break*/, 4];
                        }
                        return [4 /*yield*/, this.sync(instance, {
                                latestTid: latestTid,
                                tid: transaction.localId,
                                action: transaction.method.name,
                                payload: JSON.stringify(transaction.args || {}),
                            })];
                    case 2:
                        response = _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.sync = function (instance, _a) {
        var tid = _a.tid, action = _a.action, payload = _a.payload, latestTid = _a.latestTid;
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.post('sync-state/sync', {
                            tid: tid,
                            action: action,
                            payload: payload,
                            latestTid: latestTid,
                            appid: 'todolist',
                            entity: instance.id,
                        })];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Server.prototype.subscribe = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            var obs, _i, obs_1, t, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post('sync-state/list', {
                            appid: 'todolist',
                            entity: instance.id
                        })];
                    case 1:
                        obs = _a.sent();
                        this.sentTransactions = new Set(obs);
                        for (_i = 0, obs_1 = obs; _i < obs_1.length; _i++) {
                            t = obs_1[_i];
                            transaction = new Transaction_1.default(t.tid, instance.obj[t.action], JSON.parse(t.payload));
                            instance.transactions.push(transaction);
                        }
                        console.log(instance.transactions.length);
                        console.log(instance.transactions.length);
                        return [2 /*return*/, obs];
                }
            });
        });
    };
    Server.prototype.post = function (endpoint, args) {
        if (args === void 0) { args = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("" + this.url + endpoint + "/", { body: JSON.stringify(args), headers: DEFAULT_HEADERS, method: 'post' })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        res = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, res];
                }
            });
        });
    };
    return Server;
}());
exports.default = Server;
