import { MockClient } from "../../http/MockClient";
import { FileClient } from "../FileClient";
import FormData from "form-data";
import { injectPlatformDeps } from "../../platform";
import * as browserDeps from "../../platform/browser";

jest.mock("form-data");

describe("FileClient", () => {
  let mockClient: MockClient;
  let fileClient: FileClient;
  beforeEach(() => {
    mockClient = new MockClient();
    fileClient = new FileClient(mockClient);
  });
  describe("uploadFile", () => {
    describe("with name & data", () => {
      const params = {
        file: {
          name: "text.text",
          data: "Hello!",
        },
      };
      beforeEach(() => {
        fileClient.uploadFile(params);
      });
      it("should pass the path to the http client", () => {
        expect(mockClient.getLogs()[0].path).toBe("/k/v1/file.json");
      });
      it("should send a post request", () => {
        expect(mockClient.getLogs()[0].method).toBe("post");
      });
      it("should pass file object includes name and data as a param to the http client", () => {
        const MockFormData = FormData as jest.MockedClass<typeof FormData>;
        expect(MockFormData.prototype.append.mock.calls[0]).toEqual([
          "file",
          params.file.data,
          params.file.name,
        ]);
      });
    });

    describe("with file path", () => {
      const params = {
        file: {
          path: "foo/bar/baz.txt",
        },
      };
      it("should pass file object includes name and data as a param to the http client", async () => {
        injectPlatformDeps({
          readFileFromPath: async (filePath: string) => ({
            name: filePath,
            data: "Hello!",
          }),
        });
        await fileClient.uploadFile(params);
        const MockFormData = FormData as jest.MockedClass<typeof FormData>;
        expect(MockFormData.prototype.append.mock.calls[0]).toEqual([
          "file",
          "Hello!",
          params.file.path,
        ]);
      });
    });

    describe("on a browser environment", () => {
      const params = {
        file: {
          path: "foo/bar/baz.txt",
        },
      };
      it("should raise an error on a browser environment", () => {
        injectPlatformDeps(browserDeps);
        expect(fileClient.uploadFile(params)).rejects.toThrow(
          "uploadFile doesn't allow to accept a file path on a Browser environment."
        );
      });
    });
  });

  describe("downloadFile", () => {
    const params = { fileKey: "some_file_key" };
    beforeEach(() => {
      fileClient.downloadFile(params);
    });
    it("should pass the path to the http client", () => {
      expect(mockClient.getLogs()[0].path).toBe("/k/v1/file.json");
    });
    it("should send a get request", () => {
      expect(mockClient.getLogs()[0].method).toBe("get");
    });
    it("should pass fileKey as a param to the http client", () => {
      expect(mockClient.getLogs()[0].params).toEqual(params);
    });
  });
});

describe("FileClient with guestSpaceId", () => {
  const GUEST_SPACE_ID = 1;
  const params = {
    file: {
      name: "text.text",
      data: "Hello!",
    },
  };
  const mockClient = new MockClient();
  const fileClient = new FileClient(mockClient, GUEST_SPACE_ID);
  fileClient.uploadFile(params);
  it("should pass the path to the http client", () => {
    expect(mockClient.getLogs()[0].path).toBe(
      `/k/guest/${GUEST_SPACE_ID}/v1/file.json`
    );
  });
});
