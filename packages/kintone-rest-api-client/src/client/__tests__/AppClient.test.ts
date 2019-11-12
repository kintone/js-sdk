import { MockClient } from "../../http/MockClient";
import { AppClient } from "../AppClient";

describe("AppClient", () => {
  let mockClient: MockClient;
  let appClient: AppClient;
  const APP_ID = 1;
  const REVISION = 5;
  const properties = {
    fieldCode: {
      type: "SINGLE_LINE_TEXT",
      code: "fieldCode",
      label: "Text Field"
    }
  };

  beforeEach(() => {
    mockClient = new MockClient();
    appClient = new AppClient(mockClient);
  });
  describe("getFormFields", () => {
    const lang = "default";
    describe("without preview", () => {
      beforeEach(() => {
        appClient.getFormFields(APP_ID, lang);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/app/form/fields.json");
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual({
          app: APP_ID,
          lang
        });
      });
    });
    describe("preview: true", () => {
      beforeEach(() => {
        appClient.getFormFields(APP_ID, lang, true);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe(
          "/k/v1/preview/app/form/fields.json"
        );
      });
      it("should send a get request", () => {
        expect(mockClient.getLogs()[0].method).toBe("get");
      });
      it("should pass app and lang as a param to the http client", () => {
        expect(mockClient.getLogs()[0].params).toEqual({
          app: APP_ID,
          lang
        });
      });
    });
  });

  describe("addFormFields", () => {
    beforeEach(() => {
      appClient.addFormFields(APP_ID, properties, REVISION);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/form/fields.json"
      );
    });
    it("should send a post request", () => {
      expect(mockClient.getLogs()[0].method).toBe("post");
    });
    it("should pass app, properties and revision as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual({
        app: APP_ID,
        properties,
        revision: REVISION
      });
    });
  });

  describe("updateFormFields", () => {
    beforeEach(() => {
      appClient.updateFormFields(APP_ID, properties, REVISION);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/form/fields.json"
      );
    });
    it("should send a put request", () => {
      expect(mockClient.getLogs()[0].method).toBe("put");
    });
    it("should pass app, properties and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual({
        app: APP_ID,
        properties,
        revision: REVISION
      });
    });
  });

  describe("deleteRecords", () => {
    const fields = ["fieldCode1", "fieldCode2"];
    beforeEach(() => {
      appClient.deleteFormFields(APP_ID, fields, REVISION);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe(
        "/k/v1/preview/app/form/fields.json"
      );
    });
    it("should send a delete request", () => {
      expect(mockClient.getLogs()[0].method).toBe("delete");
    });
    it("should pass app, fields, and revision to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual({
        app: APP_ID,
        fields,
        revision: REVISION
      });
    });
  });
});
