import parse from "csv-parse/lib/sync";

const csvParser = (input: string) => {
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
};

export const parser = (type: string, data: string) => {
  switch (type) {
    case "json":
      return JSON.parse(data);
    case "csv":
      return csvParser(data);
    default:
      throw new Error(`Unexpected file type: ${type} is unacceptable.`);
  }
};
