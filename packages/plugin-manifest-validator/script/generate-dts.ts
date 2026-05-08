import fs from "fs";
import { compile } from "json-schema-to-typescript";
import schema from "../manifest-schema.json";

// json-schema-to-typescript expands `allOf` / `anyOf` into loose
// `{ [k: string]: unknown }` index signatures; strip them from a clone so
// the runtime validator still sees the original.
const schemaForDts = structuredClone(schema) as any;

// `resources.items` uses anyOf to allow string-or-array forms.
delete schemaForDts.definitions.resources.items.anyOf;

// Top-level allOf encodes the `sandbox:true` → required(allowed_hosts, permissions) rule.
delete schemaForDts.allOf;

// `allowed_hosts.items` uses anyOf to allow `"*"` or a URI string.
delete schemaForDts.properties.allowed_hosts.items.anyOf;

compile(schemaForDts, "manifest-schema.json").then((dts) =>
  fs.writeFileSync("manifest-schema.d.ts", dts),
);
