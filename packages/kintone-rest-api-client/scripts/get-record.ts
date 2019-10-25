import { KintoneAPIClient } from "../src/index";

(async () => {
  const APP_ID = 8;
  const RECORD_ID = 3;
  const client = new KintoneAPIClient({
    subdomain: process.env.KINTONE_SUBDOMAIN || "",
    auth: {
      apiToken: process.env.KINTONE_API_TOKEN || ""
    }
  });
  console.log(await client.record.getRecord(APP_ID, RECORD_ID));
})();
