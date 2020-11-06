declare const kintone: {
  getRequestToken(): string;
};

declare const garoon: {
  connect: {
    kintone: {
      getRequestToken(): Promise<string>;
    };
  };
};

declare module NodeJS {
  interface Global {
    kintone: typeof kintone;
    garoon: typeof garoon;
    location: typeof location;
  }
}

declare const location:
  | {
      host: string;
      protocol: string;
    }
  | undefined;

declare class Blob {
  constructor(array: unknown[]);
}

declare const PACKAGE_VERSION: string;

// see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/24419
declare interface Element {}
declare interface Document {}
declare interface NodeListOf<T = {}> {}
