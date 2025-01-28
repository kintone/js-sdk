var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
export function iterator(client) {
    function createIteratorMethod(url, handleRequest, hasNext, init, method) {
        return __asyncGenerator(this, arguments, function* createIteratorMethod_1() {
            let _init = init;
            let response = null;
            while (true) {
                if (!hasNext(_init, response))
                    return yield __await(void 0);
                _init = handleRequest(_init, response);
                response = yield __await(method(url, _init));
                yield yield __await(response);
            }
        });
    }
    return {
        GET: (url, handleRequest, hasNext, init) => createIteratorMethod(url, handleRequest, hasNext, init, client.GET),
        PUT: (url, handleRequest, hasNext, init) => createIteratorMethod(url, handleRequest, hasNext, init, client.PUT),
        POST: (url, handleRequest, hasNext, init) => createIteratorMethod(url, handleRequest, hasNext, init, client.POST),
        DELETE: (url, handleRequest, hasNext, init) => createIteratorMethod(url, handleRequest, hasNext, init, client.DELETE),
        OPTIONS: (url, handleRequest, hasNext, init) => createIteratorMethod(url, handleRequest, hasNext, init, client.OPTIONS),
        HEAD: (url, handleRequest, hasNext, init) => createIteratorMethod(url, handleRequest, hasNext, init, client.HEAD),
        PATCH: (url, handleRequest, hasNext, init) => createIteratorMethod(url, handleRequest, hasNext, init, client.PATCH),
        TRACE: (url, handleRequest, hasNext, init) => createIteratorMethod(url, handleRequest, hasNext, init, client.TRACE),
    };
}
//# sourceMappingURL=iterator.js.map