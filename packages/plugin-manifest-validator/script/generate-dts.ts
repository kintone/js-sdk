"use strict";

import fs from "fs";
import { compile } from "json-schema-to-typescript";
import schema from "../src/manifest-schema.json";

// @ts-expect-error manifest-shema.json is not assignable JSONShema4.
compile(schema, "manifest-schema.json").then((dts) =>
  fs.writeFileSync("manifest-schema.d.ts", dts)
);
