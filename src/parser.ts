import parse from "csv-parse/lib/sync";

export function csvParser(input: string) {
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });
  return records.map((record: Record<string, string>) => {
    const keys = Object.keys(record);
    const row: Record<string, unknown> = {};
    for (const key of keys) {
      row[key] = {
        value: record[key],
      };
    }
    return row;
  });
}
