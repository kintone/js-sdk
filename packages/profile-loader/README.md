# `@kintone/profile-loader`

![Node.js version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/kintone/js-sdk/master/packages/profile-loader/package.json&label=node&query=$.engines.node&colorB=blue)
![License](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/kintone/js-sdk/master/packages/profile-loader/package.json&label=license&query=$.license&colorB=green)

A loader to retrive Kintone settings like `username`, `password`, `baseUrl`, and whatever you want.

**THIS IS AN EXPERIMENTAL AND HAS BEEN PUBLISHED YET**

## Usage

```js
const profileLoader = require("@kintone/profile-loader");

const profile = profileLoader();
// or
const profile = profileLoader({
  profile: "your_profile",
  config: configFIlePath,
  credentials: credentialsFilePath,
});
```

## Settings

### Config file

You can get the following settings from the function.
each setting corresponds the environment variable.

- baseUrl ... `KINTONE_BASE_URL`

If you put a config file at `$HOME/.kintone/config`, the function reads settings from the config file.

**Do not put your credentials in the file, use `$HOME/.kintone/credentials` instead.**

You can put your settings in the config file and get the value from the function.

The format of the config file is the following.

```toml
# The default setting, so the function
[default]
baseUrl = "https://example.kintone.com"
# Custom settings
debug = true

[staging]
baseUrl = "https://staging-example.kintone.com"
# Custom settings
debug = false
```

### Credentialsfile

You can get the following settings from the function.
each setting corresponds the environment variable.

- username ... `KINTONE_USERNAME`
- password ... `KINTONE_PASSWORD`
- apiToken ... `KINTONE_API_TOKEN`
- oAuthToken ... `KINTONE_OAUTH_TOKEN`

If you put a credentials file at `$HOME/.kintone/credentials`, the function reads settings from the credentials file.

The format of the credentials file is the following.

```toml
# The default setting, so the function
[default]
username = "bob"
password = "pass"
apiToken = "api_token1,api_token2"
oAuthToken = "oauth_token"

[staging]
username = "staging-bob"
password = "staging-pass"
apiToken = "staging-api_token1,staging-api_token2"
oAuthToken = "staging-oauth_token"
```

### Profile

You can specify a `profile` through the `KINTONE_PROFILE` environmental value.

- `profile` ... `KINTONE_PROFILE`

### The Priority of loading settings

1. Config file
1. Credentials file
1. Environment variable

### Customize the location to store `config` and `credentials`

You can customize the location of the `config` and `credentials` file through the following environmental values.

- `config` ... `KINTONE_CONFIG_FILE`
- `credentials` ... `KINTONE_CREDENTIALS_FILE`

The default values are `${HOME}/.kintone/config` and `${HOME}/.kintone/credentials`.

## API

### `loadProfile`

```js
const profile = loadProfile({
  profile: "dev",
  config: path.resolve(__dirname, ".kintone", "config"),
  credentials: path.resolve(__dirname, ".kintone", "credentials"),
});
```

| Name        | Type   | Required | Description                                                                                    |
| ----------- | ------ | -------- | ---------------------------------------------------------------------------------------------- |
| profile     | String |          | A profile specified as a [table](https://toml.io/en/v1.0.0-rc.1#section-16) in a setting file. |
| config      | String |          | A path to a config file. The default value is `$HOME/.kintone/config`.                         |
| credentials | String |          | A path to a credentials file. The default value is `$HOME/.kintone/credentials`.               |

## Prior Art

- ["Configuration and credential file settings - AWS Command Line Interface"](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

## LICENSE

MIT License
