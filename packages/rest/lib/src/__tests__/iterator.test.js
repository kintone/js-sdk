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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi_fetch_1 = __importDefault(require("openapi-fetch"));
const iterator_1 = require("../helpers/iterator");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const client = (0, openapi_fetch_1.default)({
        baseUrl: "http://localhost",
        headers: {
            "X-Cybozu-Authorization": "QWRtaW5pc3RyYXRvcjpjeWJvenU=",
        },
    });
    // アプリ作成
    const apps = [];
    for (let i = 0; i < 10; i++) {
        const addAppResp = yield client.POST("/k/v1/preview/app.json", {
            body: { name: `my app ${i}` },
        });
        apps.push({ app: addAppResp.data.app });
    }
    // デプロイ
    const deployAppResp = yield client.POST("/k/v1/preview/app/deploy.json", {
        body: { apps: apps },
    });
    const appIdList = apps.map((a) => a.app);
    // デプロイ確認
    const deployCheckIterator = (0, iterator_1.iterator)(client).GET("/k/v1/preview/app/deploy.json", (init) => init, (_init, resp) => {
        if (!resp)
            return true;
        for (const status of resp === null || resp === void 0 ? void 0 : resp.data.apps) {
            if (apps.some((a) => a.app === status.app) &&
                status.status === "PROCESSING") {
                return true;
            }
        }
        return false;
    }, {
        params: {
            query: { apps: appIdList },
        },
    });
    deploy_check: while (true) {
        const result = yield deployCheckIterator.next();
        if (result.done)
            break deploy_check;
        console.log("deploying...");
        yield new Promise((resolve) => setTimeout(resolve, 500));
    }
    // アプリ一覧取得
    const handleRequest = (previousInit, previousResp) => {
        var _a;
        if (!previousResp)
            return previousInit;
        const prevOffset = parseInt(previousInit.params.query.offset);
        const limit = parseInt(previousInit.params.query.limit);
        return Object.assign(Object.assign({}, previousInit), { params: Object.assign(Object.assign({}, previousInit === null || previousInit === void 0 ? void 0 : previousInit.params), { query: Object.assign(Object.assign({}, (_a = previousInit === null || previousInit === void 0 ? void 0 : previousInit.params) === null || _a === void 0 ? void 0 : _a.query), { offset: prevOffset + limit }) }) });
    };
    const hasNext = (init, resp) => {
        if (!resp)
            return true;
        return parseInt(resp.data.apps.length) >= parseInt(init.params.query.limit);
    };
    const getAppsIterator = (0, iterator_1.iterator)(client).GET("/k/v1/apps.json", handleRequest, hasNext, {
        params: {
            query: {
                ids: appIdList,
                offset: 0,
                limit: 3,
            },
        },
    });
    const allResp = [];
    try {
        for (var _d = true, getAppsIterator_1 = __asyncValues(getAppsIterator), getAppsIterator_1_1; getAppsIterator_1_1 = yield getAppsIterator_1.next(), _a = getAppsIterator_1_1.done, !_a; _d = true) {
            _c = getAppsIterator_1_1.value;
            _d = false;
            const resp = _c;
            console.log(resp.data);
            allResp.push(...resp.data.apps);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = getAppsIterator_1.return)) yield _b.call(getAppsIterator_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    console.log(allResp.length);
});
main();
//# sourceMappingURL=iterator.test.js.map