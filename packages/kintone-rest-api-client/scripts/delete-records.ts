import { KintoneAPIClient } from "../src/index";

(async () => {
  const APP_ID = 8;
  const client = new KintoneAPIClient({
    subdomain: process.env.KINTONE_SUBDOMAIN || "",
    auth: {
      apiToken: process.env.KINTONE_API_TOKEN || ""
    }
  });

  const ids = [21];
  const revisions = ["1"];

  console.log(await client.record.deleteRecords(APP_ID, ids, revisions));
})();
