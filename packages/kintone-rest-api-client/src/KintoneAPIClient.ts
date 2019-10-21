import axios from "axios";

type Auth = {
  apiToken: string;
};
type AppID = string | number;
type RecordID = string | number;

export class KintoneAPIClient {
  private subdomain: string;
  private auth: Auth;
  constructor({ subdomain, auth }: { subdomain: string; auth: Auth }) {
    this.subdomain = subdomain;
    this.auth = auth;
  }

  public async getRecord(app: AppID, id: RecordID) {
    const path = "/k/v1/record.json";
    const headers = { "X-Cybozu-API-Token": this.auth.apiToken };
    const requestURL = `https://${this.subdomain}.cybozu.com${path}?app=${app}&id=${id}`;
    const { data } = await axios.get(requestURL, { headers });
    return data;
  }
}
