# `@kintone/profile-loader`

A loader to retrive Kintone settings like `username`, `password`, `baseUrl`, and etc.

## Usage

```js
const profileLoader = require("@kintone/profile-loader");

const profile = profileLoader();
// or
const profile = profileLoader('your_profile', configPath);
```

## Settings

You can get the following settings from the function.
each setting corresponds the environment variable.

- username ... `KINTONE_USERNAME`
- password ... `KINTONE_PASSWORD`
- baseUrl ... `KINTONE_BASE_URL`
- apiToken ... `KINTONE_API_TOKEN`
- oAuthToken ... `KINTONE_OAUTH_TOKEN`

If you put a config file at `.kintone/config`, the function reads settings from the config file.

### Config file

The format of the config file is here.

```toml
# The default setting, so the function
[default]
username = "bob"
password = "pass"
baseUrl = "https://example.kintone.com"
apiToken = "api_token1,api_token2"
oAuthToken = "oauth_token"

[staging]
username = "staging-bob"
password = "staging-pass"
baseUrl = "https://staging-example.kintone.com"
apiToken = "staging-api_token1,staging-api_token2"
oAuthToken = "staging-oauth_token"
```

### The Priority of loading settings

1. Config file
1. Environment variable

## LICENSE
MIT License
