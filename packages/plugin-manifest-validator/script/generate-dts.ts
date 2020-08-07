"use strict";

import fs from "fs";
import { compile } from "json-schema-to-typescript";
import schema from "../src/manifest-schema.json";

// @ts-expect-error manifest-schema.json is not assignable JSONSchema4.
compile(schema, "manifest-schema.json").then((dts) =>
  fs.writeFileSync("manifest-schema.d.ts", dts)
);
