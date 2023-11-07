/* eslint-disable no-var,vars-on-top */
declare namespace globalThis {
  // We cannot use let,const to declare global object:(
  // https://stackoverflow.com/a/69230938
  var kintone: {
    getRequestToken(): string;
  };

  var garoon: {
    connect: {
      kintone: {
        getRequestToken(): Promise<string>;
      };
    };
  };

  // see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/24419
  declare interface Element {}
  declare interface Document {}
  declare interface NodeListOf<T = {}> {}
}
