import { RecordClient } from "../RecordClient";
import { MockClient } from "../../http/MockClient";

describe("RecordClient", () => {
  it("should be able to create an instance without any error", () => {
    expect(() => {
      new RecordClient(new MockClient());
    }).not.toThrow();
  });
});
