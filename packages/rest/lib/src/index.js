"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterator = exports.createClient = void 0;
const openapi_fetch_1 = __importDefault(require("openapi-fetch"));
exports.createClient = openapi_fetch_1.default;
const iterator_1 = require("./helpers/iterator");
Object.defineProperty(exports, "iterator", { enumerable: true, get: function () { return iterator_1.iterator; } });
//# sourceMappingURL=index.js.map