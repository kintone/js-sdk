declare namespace process {
  const env: {
    [key: string]: string;
  };
}

declare const kintone: {
  getRequestToken(): string;
};

declare namespace console {
  function log(...args: any[]): void;
}
