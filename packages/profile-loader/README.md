# `@kintone/profile-loader`

A loader to retrive Kintone settings like `username`, `password`, `baseUrl`, and etc.

**THIS IS AN EXPERIMENTAL AND HAS BEEN PUBLISHED YET**

## Usage

```js
const profileLoader = require("@kintone/profile-loader");

const profile = profileLoader();
// or
const profile = profileLoader('your_profile', configPath, credentialPath);
```

## Settings

### Config file

You can get the following settings from the function.
each setting corresponds the environment variable.

- baseUrl ... `KINTONE_BASE_URL`

If you put a config file at `.kintone/config`, the function reads settings from the config file.

**Do not put credential settings in the file, use `$HOME/.kintone/credentials` instead.

You can put your settings in the config file and get the value from the function.

The format of the config file is here.

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

### Credential file

You can get the following settings from the function.
each setting corresponds the environment variable.

- username ... `KINTONE_USERNAME`
- password ... `KINTONE_PASSWORD`
- apiToken ... `KINTONE_API_TOKEN`
- oAuthToken ... `KINTONE_OAUTH_TOKEN`

If you put a credential file at `$HOME/.kintone/credentials`, the function reads settings from the credential file.

The format of the credential file is here.

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

### The Priority of loading settings

1. Config file
1. Credential file
1. Environment variable

## LICENSE
MIT License
