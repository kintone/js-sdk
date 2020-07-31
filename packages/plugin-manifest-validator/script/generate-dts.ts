"use strict";

import fs from "fs";
import { compile } from "json-schema-to-typescript";
import schema from "../src/manifest-schema.json";

delete schema.definitions.resources.items.anyOf;

// @ts-expect-error TODO: checko JSONShema4
compile(schema, "manifest-schema.json").then((dts) =>
  fs.writeFileSync("manifest-schema.d.ts", dts)
);
