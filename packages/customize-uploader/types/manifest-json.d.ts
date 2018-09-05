declare module '*.json' {
  const value : {
    app: string,
    scope: string,
    desktop: {
      js: Array<any>,
      css: Array<any>,
    },
    mobile: {
      js: Array<any>
    },
    [propName: string]: {}
  };
  export default value;
}