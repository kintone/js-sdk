import validate from "./dist/src/index.js";

declare const validator: typeof validate & { default: typeof validate };

declare namespace validator {
  type RequiredObjectProperty =
    import("./dist/src/index.js").RequiredObjectProperty;
  type RequiredProperties = import("./dist/src/index.js").RequiredProperties;
}

export = validator;
