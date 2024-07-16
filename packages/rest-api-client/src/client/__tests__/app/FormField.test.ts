import type { MockClient } from "../../../http/MockClient";
import type { AppClient } from "../../AppClient";
import { APP_ID, makeClients, REVISION } from "../fixtures/AppClientFixture";

const properties = {
  fieldCode: {
    type: "SINGLE_LINE_TEXT" as const,
    code: "fieldCode",
    label: "Text Field",
  },
};

describe("FormField Test", () => {
  let appClient: AppClient;
  let mockClient: MockClient;

  beforeEach(() => {
    const clients = makeClients();
    appClient = clients.appClient;
    mockClient = clients.mockClient;
  });

  describe("getFormFields", () => {
    const lang = "default";
    const params = { app: APP_ID, lang } as const;
    describe("without preview", () => {
      beforeEach(async () => {
        await appClient.getFormFields(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/form/fields.json");
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
    describe("preview: true", () => {
      beforeEach(async () => {
        await appClient.getFormFields({ ...params, preview: true });
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/form/fields.json",
        );
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual(params);
      });
    });
  });

  describe("addFormFields", () => {
    const params = { app: APP_ID, properties, revision: REVISION };
    beforeEach(async () => {
      await appClient.addFormFields(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/form/fields.json",
      );
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass app, properties and revision as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("updateFormFields", () => {
    const params = { app: APP_ID, properties, revision: REVISION };
    beforeEach(async () => {
      await appClient.updateFormFields(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/form/fields.json",
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, properties and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });

  describe("deleteFormFields", () => {
    const fields = ["fieldCode1", "fieldCode2"];
    const params = { app: APP_ID, fields, revision: REVISION };
    beforeEach(async () => {
      await appClient.deleteFormFields(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/form/fields.json",
      );
    });
    it("should send a delete request", () => {
      expect(mockClient.getLogs()[0].method).toBe("delete");
    });
    it("should pass app, fields, and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});
