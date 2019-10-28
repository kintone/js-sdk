import { KintoneAPIClient } from "../src/index";

(async () => {
  const APP_ID = 8;
  const client = new KintoneAPIClient({
    subdomain: process.env.KINTONE_SUBDOMAIN || "",
    auth: {
      apiToken: process.env.KINTONE_API_TOKEN || ""
    }
  });

  // const code = "field code"

  // const record = {
  //   [code]: {
  //     value: "field value"
  //   }
  // };

  console.log(await client.record.addRecord(APP_ID /* , record*/));
})();
