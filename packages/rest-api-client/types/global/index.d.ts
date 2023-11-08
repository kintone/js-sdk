/* eslint-disable no-var,vars-on-top */
// We cannot use let,const to declare global object:(
// https://stackoverflow.com/a/69230938
declare var kintone: {
  getRequestToken(): string;
};

declare var garoon: {
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
