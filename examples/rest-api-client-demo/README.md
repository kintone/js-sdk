# Demo scripts for `@kintone/rest-api-client`

Demo scripts for `@kintone/rest-api-client`.
This is not a published package.

## Usage

### Set environment variables

- `KINTONE_BASE_URL` (**Must**)
  - A base URL for your Kintone environment.
- `KINTONE_USERNAME` and `KINTONE_PASSWORD`
  - Your username and password for the Kintone environment.
  - Required if you use password authentication.
- `KINTONE_API_TOKEN`
  - An API token for Kintone apps.
  - Required if you use API token authentication.
- `KINTONE_OAUTH_TOKEN`
  - An OAuth access token for Kintone apps.
  - Required if you use OAuth authentication.
- `KINTONE_DOMAIN`
  - A domain name for your Kintone environment.
  - Required if you upload scripts to your Kintone environment using `@kintone/customize-uploader`.
  - This will be migrated to `KINTONE_BASE_URL` in the future.

### Modify hard-coded IDs

Currently, we have hard-coded IDs in files that are in `src/` like `app.ts`, `bulkRequest.ts`, `file.ts`, and `record.ts`.
We are going to fix the problem, but currently, you have to modify the IDs your self.

We have an app ID in `customize-manifest.json`, so you have to update the app ID if you deploy a script to your Kintone environment.

### Run a script with `ts-node`

#### yarn

```
% yarn demo record getRecord
```

#### npm

```
% npm run demo record getRecord
```

#### pnpm

```
% pnpm demo record getRecord
```

### Upload scripts to your Kintone environment

#### yarn

```
% yarn deploy
```

#### npm

```
% npm run deploy
```

#### pnpm

```
% pnpm deploy
```

## License

- [MIT](LICENSE)
