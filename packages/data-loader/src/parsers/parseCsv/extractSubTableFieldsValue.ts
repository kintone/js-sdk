import { formatToRecordValue } from "./formatToRecordValue";
import { CsvRows, FieldsJson } from "../../types";

export const extractSubTableFieldsValue = ({
  rows,
  fieldsJson,
}: {
  rows: CsvRows;
  fieldsJson: FieldsJson;
}) => {
  const subtableFieldProperties = Object.keys(fieldsJson.properties)
    .filter((fieldCode) => {
      return fieldsJson.properties[fieldCode].type === "SUBTABLE";
    })
    .map((fieldCode) => fieldsJson.properties[fieldCode]);

  return subtableFieldProperties.reduce((ret, subtableFieldProperty) => {
    if (subtableFieldProperty.type !== "SUBTABLE") return ret;
    ret[subtableFieldProperty.code] = {
      value: rows.map((row) => {
        return {
          id: row[subtableFieldProperty.code],
          value: Object.keys(subtableFieldProperty.fields).reduce(
            (subtableFieldValue, subtableFieldCode) => {
              if (row[subtableFieldCode]) {
                subtableFieldValue[subtableFieldCode] = formatToRecordValue({
                  fieldType:
                    subtableFieldProperty.fields[subtableFieldCode].type,
                  value: row[subtableFieldCode],
                });
              }
              return subtableFieldValue;
            },
            {} as any
          ),
        };
      }),
    };
    return ret;
  }, {} as any);
};
