const { KintoneRestAPIClient } = require("@kintone/rest-api-client");
const { KINTONE_BASE_URL, KINTONE_USERNAME, KINTONE_PASSWORD } = process.env;
const client = new KintoneRestAPIClient({
  baseUrl: KINTONE_BASE_URL,
  // Use password authentication
  auth: {
    username: KINTONE_USERNAME,
    password: KINTONE_PASSWORD,
  },
  // Use API token authentication
  // auth: { apiToken: process.env.KINTONE_API_TOKEN }
  // Use OAuth token authentication
  // auth: { oAuthToken: process.env.KINTONE_OAUTH_TOKEN }

  // Use session authentication if `auth` is omitted (in browser only)
});

client.record
  .getRecords({ app: 1 })
  .then((resp) => {
    console.log(resp.records);
  })
  .catch((err) => {
    console.log(err);
  });
