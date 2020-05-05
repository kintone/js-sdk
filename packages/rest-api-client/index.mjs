import module from "module";
import url from "url";
const require = module.createRequire(url.fileURLToPath(import.meta.url));
export const KintoneRestAPIClient = require("./lib/index.js").KintoneRestAPIClient;
