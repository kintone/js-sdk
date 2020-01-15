declare const kintone: {
  getRequestToken(): string;
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
