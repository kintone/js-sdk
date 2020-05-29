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
    location: typeof location;
  }
}

declare const location:
  | {
      origin: string;
    }
  | undefined;

declare class Blob {
  constructor(array: unknown[]);
}
