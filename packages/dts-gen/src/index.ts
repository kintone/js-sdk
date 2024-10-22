import type { RenderInput } from "./templates/template";
import { FormsClientImpl } from "./kintone/clients/forms-client-impl";
import { FieldTypeConverter } from "./converters/fileldtype-converter";
import { TypeDefinitionTemplate } from "./templates/template";
import { objectValues } from "./utils/objectvalues";
import { parse } from "./cli-parser";

process.on("uncaughtException", (e) => {
  console.error(e.message);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
});

const args = parse(process.argv);

const client = new FormsClientImpl(args);

const fetchFormPropertiesInput = {
  appId: args.appId,
  guestSpaceId: args.guestSpaceId,
  preview: args.preview,
};

const handler = async () => {
  const properties = await client.fetchFormProperties(fetchFormPropertiesInput);
  const fieldTypeGroups = FieldTypeConverter.convertFieldTypesToFieldTypeGroups(
    objectValues(properties),
  );
  const input: RenderInput = {
    typeName: args.typeName,
    namespace: args.namespace,
    fieldTypeGroups,
  };
  await TypeDefinitionTemplate.renderAsFile(args.output, input);
};

handler().catch((err) => {
  console.error(err);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
});
