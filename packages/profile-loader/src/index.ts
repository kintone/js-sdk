console.log("Hello");

type Profile = {
  username: string;
  password: string;
  baseUrl: string;
  apiToken: string;
  oAuthToken: string;
};

export const loadProfile = (): Profile => {
  return {
    username: "",
    password: "",
    baseUrl: "",
    apiToken: "",
    oAuthToken: "",
  };
};
