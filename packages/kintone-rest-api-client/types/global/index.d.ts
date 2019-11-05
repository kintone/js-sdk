declare namespace process {
  const env: {
    [key: string]: string;
  };
}

declare const global: any;

declare const kintone: {
  getRequestToken(): string;
};

declare namespace console {
  function log(...args: any[]): void;
}
