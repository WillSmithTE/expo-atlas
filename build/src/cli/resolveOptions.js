"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOptions = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var serializeStatsFile_1 = require("../metro/serializeStatsFile");
var serializeStatsFile_2 = require("../metro/serializeStatsFile");
var port_1 = require("../utils/port");
function resolveOptions(input) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, statsFile, port;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        resolveStatsFile(input),
                        resolvePort(input),
                    ])];
                case 1:
                    _a = _b.sent(), statsFile = _a[0], port = _a[1];
                    return [2 /*return*/, { statsFile: statsFile, port: port }];
            }
        });
    });
}
exports.resolveOptions = resolveOptions;
function resolveStatsFile(input) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var statsFile, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    statsFile = (_a = input._[0]) !== null && _a !== void 0 ? _a : (0, serializeStatsFile_1.getStatsPath)(process.cwd());
                    if (!fs_1.default.existsSync(statsFile)) {
                        throw new Error("Could not find stats file \"".concat(statsFile, "\"."));
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, serializeStatsFile_2.validateStatsFile)(statsFile)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    throw new Error("Stats file is incompatible with this version.");
                case 4: return [2 /*return*/, path_1.default.resolve(statsFile)];
            }
        });
    });
}
function resolvePort(input) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!((_a = input['--port']) !== null && _a !== void 0)) return [3 /*break*/, 1];
                    _b = _a;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, (0, port_1.getFreePort)(3000)];
                case 2:
                    _b = _c.sent();
                    _c.label = 3;
                case 3: return [2 /*return*/, _b];
            }
        });
    });
}
//# sourceMappingURL=resolveOptions.js.map