"use strict";var D=Object.create;var l=Object.defineProperty;var U=Object.getOwnPropertyDescriptor;var S=Object.getOwnPropertyNames;var B=Object.getPrototypeOf,z=Object.prototype.hasOwnProperty;var q=(e,t)=>{for(var r in t)l(e,r,{get:t[r],enumerable:!0})},y=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of S(t))!z.call(e,o)&&o!==r&&l(e,o,{get:()=>t[o],enumerable:!(i=U(t,o))||i.enumerable});return e};var m=(e,t,r)=>(r=e!=null?D(B(e)):{},y(t||!e||!e.__esModule?l(r,"default",{value:e,enumerable:!0}):r,e)),$=e=>y(l({},"__esModule",{value:!0}),e);var J={};q(J,{createClient:()=>v,iterator:()=>O});module.exports=$(J);var s={getRequestToken:()=>{throw new Error("not implemented")},getDefaultAuth:()=>{throw new Error("not implemented")},buildBaseUrl:()=>{throw new Error("not implemented")},getVersion:()=>{throw new Error("not implemented")},buildCertAuth:()=>{throw new Error("not implemented")},buildUserAgentHeader:()=>{throw new Error("not implemented")},buildTimeoutHeader:()=>{throw new Error("not implemented")},buildProxy:()=>{throw new Error("not implemented")}},f=e=>{e.getRequestToken&&(s.getRequestToken=e.getRequestToken),e.getDefaultAuth&&(s.getDefaultAuth=e.getDefaultAuth),e.buildCertAuth&&(s.buildCertAuth=e.buildCertAuth),e.buildUserAgentHeader&&(s.buildUserAgentHeader=e.buildUserAgentHeader),e.buildTimeoutHeader&&(s.buildTimeoutHeader=e.buildTimeoutHeader),e.buildBaseUrl&&(s.buildBaseUrl=e.buildBaseUrl),e.getVersion&&(s.getVersion=e.getVersion),e.buildProxy&&(s.buildProxy=e.buildProxy)};var b=m(require("fs"),1);var u=class e extends Error{platform;constructor(t){let r=`This function is not supported in ${t} environment`;super(r),Error.captureStackTrace&&Error.captureStackTrace(this,e),this.name="UnsupportedPlatformError",this.platform=t,Object.setPrototypeOf(this,e.prototype)}};var A=m(require("os"),1),P=require("undici");var h={name:"@kintone/rest",version:"0.0.1",description:"kintone REST API Client for JavaScript",keywords:["kintone","rest","api-client"],homepage:"https://github.com/kintone/js-sdk/tree/main/packages/rest#readme",bugs:{url:"https://github.com/kintone/js-sdk/issues"},repository:{type:"git",url:"git+https://github.com/kintone/js-sdk.git",directory:"packages/rest"},license:"Apache-2.0",author:{name:"Cybozu, Inc.",url:"https://cybozu.co.jp"},type:"module",exports:{".":{node:{import:"./lib/index.js",require:"./lib/index.cjs",default:"./lib/index.js"},browser:"./lib/index.browser.js"},"./package.json":"./package.json"},main:"lib/index.cjs",module:"lib/index.js",types:"lib/index.d.ts",files:["CHANGELOG.md","esm","lib","!**/*.tsbuildinfo"],scripts:{prebuild:"pnpm clean",build:"tsc --build --force && pnpm postbuild","build:vite":"vite build","build:tsup":"tsup",postbuild:"node scripts/copy-schemas.js","build:rollup_umd_dev":"rollup -c --environment BUILD:development","build:rollup_umd_prod":"rollup -c --environment BUILD:production","build:vite_umd_dev":"BUILD=development vite build","build:vite_umd_prod":"BUILD=production vite build",clean:"rimraf lib esm umd",fix:"pnpm lint:eslint --fix",lint:"run-s lint:*","lint:eslint":"eslint . --max-warnings 0","lint:package":"publint --strict",start:"tsc --build --force --watch",test:"jest","test:ci":"jest --runInBand","test:e2e":"jest --config=jest.e2e.config.js"},dependencies:{"core-js":"^3.41.0",fs:"0.0.1-security","js-base64":"^3.7.7","openapi-fetch":"^0.13.5","openapi-typescript":"^7.6.1","openapi-typescript-helpers":"^0.0.15",undici:"^7.4.0"},devDependencies:{"@rollup/plugin-babel":"^6.0.4","@rollup/plugin-commonjs":"^26.0.3","@rollup/plugin-json":"^6.1.0","@rollup/plugin-node-resolve":"^15.3.1","@rollup/plugin-terser":"^0.4.4","@types/rollup-plugin-node-builtins":"^2.1.5","@types/rollup-plugin-node-globals":"^1.4.5",rollup:"^4.38.0","rollup-plugin-ecma-version-validator":"^0.2.13","rollup-plugin-license":"^3.6.0","rollup-plugin-node-builtins":"^2.1.2","rollup-plugin-node-globals":"^1.4.0","rollup-plugin-polyfill-node":"^0.13.0",tsup:"^8.4.0",vite:"^5.4.15","vite-plugin-dts":"^4.5.3"},engines:{node:">=18"},publishConfig:{access:"public"}};var c=require("undici"),g=e=>{let t=e.protocol??"http";return e.auth===void 0?{dispatcher:new c.ProxyAgent({uri:`${t}://${e.host}:${e.port}`})}:{dispatcher:new c.ProxyAgent({uri:`${t}://${e.auth.username}:${e.auth.password}@${e.host}:${e.port}`})}};var L=()=>{throw new u("Node.js")},_=()=>{throw new u("Node.js")},F=e=>({dispatcher:new P.Agent({connect:{pfx:"pfx"in e?e.pfx:b.default.readFileSync(e.pfxFilePath),passphrase:e.password}})}),K=e=>e.socketTimeout?{timeout:e.socketTimeout}:{},G=e=>{let{userAgent:t}=e;return t!==void 0?{"User-Agent":`Node.js/${process.version}(${A.default.type()}) ${h.name}@${h.version}${t?` ${t}`:""}`}:{}},X=e=>{if(typeof e>"u")throw new Error("in Node.js environment, baseUrl is required");return e},V=()=>h.version,Q=e=>g(e),M={getRequestToken:L,getDefaultAuth:_,buildCertAuth:F,buildUserAgentHeader:G,buildTimeoutHeader:K,buildBaseUrl:X,getVersion:V,buildProxy:Q};var H=m(require("openapi-fetch"),1);var x=require("js-base64"),C=e=>{switch(e.type){case"password":return{"X-Cybozu-Authorization":x.Base64.encode(`${e.username}:${e.password}`)};case"apiToken":{let t=e.apiToken;return{"X-Cybozu-API-Token":Array.isArray(t)?t.join(","):t}}case"oauth":return{Authorization:`Bearer ${e.oAuthToken}`};case"session":default:return{"X-Requested-With":"XMLHttpRequest"}}},T=e=>e===void 0||Object.keys(e).length===0||e.type==="session";var w=e=>({dispatcher:e});var I=e=>{let t=s.buildBaseUrl(e.baseUrl).replace(/\/+$/,""),r=C(e.auth??s.getDefaultAuth()),i=s.buildUserAgentHeader({userAgent:e.userAgent}),o=e.socketTimeout!==void 0?s.buildTimeoutHeader({socketTimeout:e.socketTimeout}):{},n=e.proxy!==void 0?s.buildProxy(e.proxy):{},p=e.httpsAgent!==void 0?w(e.httpsAgent):{},a=e.certAuth!==void 0?s.buildCertAuth(e.certAuth):{};return{fetch:e.fetch,Request:e.Request,querySerializer:e.querySerializer,bodySerializer:e.bodySerializer,baseUrl:t,headers:{...e.headers,...r,...i},requestInitExt:{...e.requestInitExt,...n,...p,...a},...o}};var R=()=>({async onRequest({request:e}){if(e.method==="GET")return e;if(e.headers.get("content-type")?.includes("multipart/form-data")){let r=await e.formData();return r.has("__REQUEST_TOKEN__")||r.append("__REQUEST_TOKEN__",await s.getRequestToken()),new Request(e.url,{method:e.method,headers:e.headers,body:r})}let t=await e.json();return t.__REQUEST_TOKEN__=await s.getRequestToken(),new Request(e.url,{method:e.method,headers:e.headers,body:JSON.stringify(t)})}});var k=()=>({async onRequest({request:e,params:t}){if(e.method!=="GET"||e.url.length<=4096)return e;let r=new URL(e.url),i=t.query,o=new Headers(e.headers);return o.set("X-HTTP-Method-Override","GET"),o.set("Content-Type","application/json"),new Request(r.origin+r.pathname,{method:"POST",headers:o,body:JSON.stringify(i)})}});var E=require("openapi-fetch"),j=()=>e=>{if(e&&typeof e=="object"){let t=e;for(let r in t)if(t[r]instanceof FormData)return t[r]}return(0,E.defaultBodySerializer)(e)};var v=e=>W(e),W=e=>{let t=I(e);t.bodySerializer=j();let r=(0,H.default)(t);return T(e.auth)&&r.use(R()),r.use(k()),r};var O=e=>{async function*t(r,i,o,n,p){let a=p,d=null;for(;;){if(!n(a,d))return;a=o(a,d),d=await e.request(r,i,a),yield d}}return{request:(r,i,o,n,p)=>t(r,i,o,n,p),GET:(r,i,o,n)=>t("get",r,i,o,n),PUT:(r,i,o,n)=>t("put",r,i,o,n),POST:(r,i,o,n)=>t("post",r,i,o,n),DELETE:(r,i,o,n)=>t("delete",r,i,o,n),OPTIONS:(r,i,o,n)=>t("options",r,i,o,n),HEAD:(r,i,o,n)=>t("head",r,i,o,n),PATCH:(r,i,o,n)=>t("patch",r,i,o,n),TRACE:(r,i,o,n)=>t("trace",r,i,o,n)}};f(M);0&&(module.exports={createClient,iterator});
//# sourceMappingURL=index.cjs.map