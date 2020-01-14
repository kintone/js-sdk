declare const kintone: {
  getRequestToken(): string;
};

declare module NodeJS {
  interface Global {
    kintone: typeof kintone;
  }
}

declare const location:
  | {
      origin: string;
    }
  | undefined;
