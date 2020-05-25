import { KintoneRestAPIClient } from "@kintone/rest-api-client";
const { KINTONE_BASE_URL, KINTONE_USERNAME, KINTONE_PASSWORD } = process.env;
const client = new KintoneRestAPIClient({
  baseUrl: KINTONE_BASE_URL,
  auth: {
    username: KINTONE_USERNAME,
    password: KINTONE_PASSWORD,
  },
});

client.record
  .getRecord({ app: 8, id: 3 })
  .then((resp) => {
    console.log(resp);
  })
  .catch((err) => {
    console.log(err);
  });
