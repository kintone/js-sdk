declare namespace process {
  const env: {
    [key: string]: string;
  };
}

declare const kintone: {
  getRequestToken(): string;
};
