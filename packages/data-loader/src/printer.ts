const printJSON = (value: unknown) => {
  console.log(JSON.stringify(value, null, 2));
};

export const buildPrinter = (type = "json") => {
  switch (type) {
    case "json": {
      return printJSON;
    }
    default: {
      throw new Error(
        `Unknown format type. '${type}' is unknown as a format option.`
      );
    }
  }
};
