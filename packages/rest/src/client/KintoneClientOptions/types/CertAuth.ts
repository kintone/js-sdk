export type ClientCertAuth =
  | {
      pfx: Buffer;
      password: string;
    }
  | {
      pfxFilePath: string;
      password: string;
    };
