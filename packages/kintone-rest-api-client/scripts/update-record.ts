import { KintoneAPIClient } from "../src/index";

(async () => {
  const APP_ID = 8;
  const client = new KintoneAPIClient({
    subdomain: process.env.KINTONE_SUBDOMAIN || "",
    auth: {
      apiToken: process.env.KINTONE_API_TOKEN || ""
    }
  });

  const params = {
    id: 22,
    record: {
      Customer: {
        value: "example"
      }
    }
  };

  console.log(await client.record.updateRecord(APP_ID, params));
})();
