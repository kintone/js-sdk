import { getFormDataBodySerializer } from "../FormDataBodySerializer";

describe("getFormDataBodySerializer", () => {
  const serializer = getFormDataBodySerializer();

  it("should return FormData when object contains FormData", () => {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const formData = new FormData();
    formData.append("test", "value");

    const result = serializer({ file: formData });
    expect(result).toBe(formData);
  });

  it("should return defaultBodySerializer result when object does not contain FormData", () => {
    const obj = { test: "value" };
    const result = serializer(obj);
    expect(result).toBe(JSON.stringify(obj));
  });

  it("should return defaultBodySerializer result for non-object values", () => {
    const values = ["string", 123, true, null];
    values.forEach((value) => {
      const result = serializer(value);
      expect(result).toBe(JSON.stringify(value));
    });
  });

  it("should return defaultBodySerializer result for undefined", () => {
    const result = serializer(undefined);
    expect(result).toBe(undefined);
  });
});
