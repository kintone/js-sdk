import{a as n,b as o,c as r,d as m,e as u}from"./chunk-TARDHA6I.js";import d from"node:fs";import f from"os";import{Agent as a}from"undici";import{ProxyAgent as i}from"undici";var s=e=>{let t=e.protocol??"http";return e.auth===void 0?{dispatcher:new i({uri:`${t}://${e.host}:${e.port}`})}:{dispatcher:new i({uri:`${t}://${e.auth.username}:${e.auth.password}@${e.host}:${e.port}`})}};var c=()=>{throw new o("Node.js")},l=()=>{throw new o("Node.js")},h=e=>({dispatcher:new a({connect:{pfx:"pfx"in e?e.pfx:d.readFileSync(e.pfxFilePath),passphrase:e.password}})}),P=e=>e.socketTimeout?{timeout:e.socketTimeout}:{},g=e=>{let{userAgent:t}=e;return t!==void 0?{"User-Agent":`Node.js/${process.version}(${f.type()}) ${r.name}@${r.version}${t?` ${t}`:""}`}:{}},y=e=>{if(typeof e>"u")throw new Error("in Node.js environment, baseUrl is required");return e},$=()=>r.version,x=e=>s(e),p={getRequestToken:c,getDefaultAuth:l,buildCertAuth:h,buildUserAgentHeader:g,buildTimeoutHeader:P,buildBaseUrl:y,getVersion:$,buildProxy:x};n(p);export{m as createClient,u as iterator};
//# sourceMappingURL=index.js.map