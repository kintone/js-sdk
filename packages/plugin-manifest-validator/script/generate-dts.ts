import fs from "fs";
import { compile } from "json-schema-to-typescript";
import schema from "../manifest-schema.json";

const schemaWithoutAnyOf = schema as any;
delete schemaWithoutAnyOf.definitions.resources.items.anyOf;

compile(schemaWithoutAnyOf, "manifest-schema.json").then((dts) =>
  fs.writeFileSync("manifest-schema.d.ts", dts),
);
