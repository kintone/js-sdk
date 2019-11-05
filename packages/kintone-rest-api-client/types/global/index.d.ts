// temporary disable because kintone/customize-uploader includes @types in dependencies.
/*
declare namespace process {
  const env: {
    [key: string]: string;
  };
}

declare const global: any;

declare namespace console {
  function log(...args: any[]): void;
}
*/

declare const kintone: {
  getRequestToken(): string;
};
