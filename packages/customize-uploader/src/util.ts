export const isUrlString = (str: string): boolean => {
  return /^https?:\/\/.*/i.test(str);
};

export const wait = async (ms: number): Promise<void> => {
  await new Promise((r) => setTimeout(r, ms));
};

export const parseProxy = (
  proxy: string
): {
  host: string;
  port: number;
  auth?: {
    username: string;
    password: string;
  };
} => {
  const { hostname, port, username, password } = new URL(proxy);
  let auth;
  if (username && password) {
    auth = { username, password };
  }
  return {
    host: hostname,
    port: Number(port),
    auth,
  };
};
