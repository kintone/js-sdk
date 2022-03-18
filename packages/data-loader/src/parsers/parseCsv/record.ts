import { CsvRow, FieldsJson } from "../../types/kintone";
import { PRIMARY_MARK } from "../../printers/printAsCsv/constants";
import { RecordForImport } from "../../types/data-loader";
import { convertField, fieldReader } from "./field";
import { convertSubtableField, subtableFieldReader } from "./subtable";

type RecordCsv = CsvRow[];

export const convertRecord = (
  recordCsv: RecordCsv,
  fieldsJson: FieldsJson
): RecordForImport => {
  const record: RecordForImport = {};
  for (const field of fieldReader(recordCsv[0], fieldsJson)) {
    record[field.code] = convertField(field);
  }
  for (const subtableField of subtableFieldReader(recordCsv, fieldsJson)) {
    record[subtableField.code] = convertSubtableField(subtableField);
  }
  return record;
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#use_of_the_yield_keyword
// eslint-disable-next-line func-style
export function* recordReader(
  rows: CsvRow[]
): Generator<RecordCsv, void, undefined> {
  if (!hasSubtable(rows[0])) {
    yield* rows.map((row) => [row]);
    return;
  }

  let index = 0;
  while (index < rows.length) {
    let first = index;
    let last = first;

    // skip to the first primary mark
    while (first < rows.length && !isPrimaryCsvRow(rows[first])) {
      first++;
    }

    // find the row just before the next primary mark
    while (last + 1 < rows.length && !isPrimaryCsvRow(rows[last + 1])) {
      last++;
    }

    yield rows.slice(first, last + 1);

    index = last + 1;
  }
}

const hasSubtable = (row: CsvRow): boolean => PRIMARY_MARK in row;

const isPrimaryCsvRow = (row: CsvRow): boolean => !!row[PRIMARY_MARK];
