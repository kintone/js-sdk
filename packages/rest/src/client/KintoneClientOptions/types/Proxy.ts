export type Proxy = {
  protocol?: string;
  host: string;
  port: number;
  auth?: {
    username: string;
    password: string;
  };
};
