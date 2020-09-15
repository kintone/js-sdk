import parse from "csv-parse/lib/sync";

export function csvParser(input: string): Array<Record<string, unknown>> {
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });
  return records;
}
