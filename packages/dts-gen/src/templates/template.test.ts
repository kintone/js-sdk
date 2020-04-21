import { TypeDefinitionTemplate as t } from "./template";
import { DemoClient } from "../kintone/clients/demo-client";
import { DemoFullWidthSymbolClient } from "../kintone/clients/demo-fullwidth-symbol-client";
import { FieldTypeConverter } from "../converters/fileldtype-converter";
import { objectValues } from "../utils/objectvalues";
import * as fs from "fs";
describe("renderAsFile", () => {
    const TEMP_TEST_TYPEDEF = "tmp.testfields.d.ts";
    test("generate typedefinition file", async () => {
        const client = new DemoClient();
        const fieldTypeGroups = await client
            .fetchFormProperties({
                appId: "",
                preview: false,
                guestSpaceId: null,
            })
            .then((properties) =>
                FieldTypeConverter.convertFieldTypesToFieldTypeGroups(
                    objectValues(properties)
                )
            );
        const input = {
            typeName: "TestFields",
            namespace: "kintone.types",
            fieldTypeGroups,
        };
        t.renderAsFile(TEMP_TEST_TYPEDEF, input);

        const expected = fs
            .readFileSync("./resources/testfields.d.ts")
            .toString()
            .trim()
            .replace(/\r?\n/g, "");

        const actual = fs
            .readFileSync(TEMP_TEST_TYPEDEF)
            .toString()
            .trim()
            .replace(/\r?\n/g, "");

        expect(actual.toString().trim()).toEqual(
            expected.toString().trim()
        );
    });

    afterEach(() => {
        fs.unlink(TEMP_TEST_TYPEDEF, (err) => {
            if (err) {
                throw err;
            }
        });
    });
});

describe("fullWidthSymbol Test", () => {
    const TEMP_TEST_TYPEDEF = "tmp.testfields.d.ts";
    test("generate type definition file", async () => {
        const client = new DemoFullWidthSymbolClient();
        const fieldTypeGroups = await client
            .fetchFormProperties({
                appId: "",
                preview: false,
                guestSpaceId: null,
            })
            .then((properties) =>
                FieldTypeConverter.convertFieldTypesToFieldTypeGroups(
                    objectValues(properties)
                )
            );
        const input = {
            typeName: "TestFields",
            namespace: "kintone.types",
            fieldTypeGroups,
        };
        t.renderAsFile(TEMP_TEST_TYPEDEF, input);

        const expected = fs
            .readFileSync(
                "./resources/test-fullwidth-symbol-field.d.ts"
            )
            .toString()
            .trim()
            .replace(/\r?\n/g, "");

        const actual = fs
            .readFileSync(TEMP_TEST_TYPEDEF)
            .toString()
            .trim()
            .replace(/\r?\n/g, "");

        expect(actual.toString().trim()).toEqual(
            expected.toString().trim()
        );
    });

    afterEach(() => {
        fs.unlink(TEMP_TEST_TYPEDEF, (err) => {
            if (err) {
                throw err;
            }
        });
    });
});
