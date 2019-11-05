declare const kintone: {
  getRequestToken(): string;
};

declare module NodeJS {
  interface Global {
    kintone: typeof kintone;
  }
}
