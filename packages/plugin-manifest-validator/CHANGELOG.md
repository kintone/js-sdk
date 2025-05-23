# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.3.1](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@10.3.0...@kintone/plugin-manifest-validator@10.3.1) (2025-05-13)


### Bug Fixes

* **dts-gen:** update axios ([#3284](https://github.com/kintone/js-sdk/issues/3284)) ([#3303](https://github.com/kintone/js-sdk/issues/3303)) ([edf7861](https://github.com/kintone/js-sdk/commit/edf78612a6ce06aee48bd5f409b764c7dab2337a))
* **rest-api-client:** commit for release ([#3286](https://github.com/kintone/js-sdk/issues/3286)) ([fc1f211](https://github.com/kintone/js-sdk/commit/fc1f21193f3bcd920bfec8f9698e1c8d1daa6817))

## [10.3.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@10.2.2...@kintone/plugin-manifest-validator@10.3.0) (2025-02-01)


### Features

* **plugin-manifest-validator:** add locales ([#3138](https://github.com/kintone/js-sdk/issues/3138)) ([f8ebb2b](https://github.com/kintone/js-sdk/commit/f8ebb2b1a039a8ac3a082930216b221a3bf9bcfa))

## [10.2.2](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@10.2.1...@kintone/plugin-manifest-validator@10.2.2) (2024-06-12)


### Bug Fixes

* **deps:** update dependency ajv-formats to v3 ([#2788](https://github.com/kintone/js-sdk/issues/2788)) ([2480cf8](https://github.com/kintone/js-sdk/commit/2480cf8106f53475faaa9e81d22db3924a1c256b))

## [10.2.1](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@10.2.0...@kintone/plugin-manifest-validator@10.2.1) (2024-05-31)


### Bug Fixes

* update plugin `manifest-schema.json` URL ([#2791](https://github.com/kintone/js-sdk/issues/2791)) ([39bae0f](https://github.com/kintone/js-sdk/commit/39bae0f415d3adac9601dba5627ea123a7947158))

## [10.2.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@10.1.0...@kintone/plugin-manifest-validator@10.2.0) (2024-05-29)


### Features

* **plugin-manifest-validator:** allow and recommend developers to set `$schema` property to manifest.json ([#2781](https://github.com/kintone/js-sdk/issues/2781)) ([a41014f](https://github.com/kintone/js-sdk/commit/a41014f9e897dc0841f168c20acb97ad5797ba77))


### Bug Fixes

* **plugin-manifest-validator:** return warning message if `homepage_url` or `name` is empty ([#2776](https://github.com/kintone/js-sdk/issues/2776)) ([af3533b](https://github.com/kintone/js-sdk/commit/af3533bfb51d52dbc6abc6d511bf39cc9d6d0a8d))

## [10.1.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@10.0.0...@kintone/plugin-manifest-validator@10.1.0) (2023-12-19)


### Features

* **plugin-manifest-validator:** support es language ([#2458](https://github.com/kintone/js-sdk/issues/2458)) ([1b3d532](https://github.com/kintone/js-sdk/commit/1b3d532faad3fc87335ea29f77f0566614f6f2e0))


### Bug Fixes

* **deps:** update dependency prettier to v3 ([#2457](https://github.com/kintone/js-sdk/issues/2457)) ([5a0b859](https://github.com/kintone/js-sdk/commit/5a0b859807530564732caa194e9251f37268b164))

## [10.0.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@9.1.0...@kintone/plugin-manifest-validator@10.0.0) (2023-10-03)


### ⚠ BREAKING CHANGES

* We dropped Node v16 support. Now supported versions are v18 and v20.

### Build System

* Drop Node v16 support version ([#2294](https://github.com/kintone/js-sdk/issues/2294)) ([767d657](https://github.com/kintone/js-sdk/commit/767d65749be66b6c2509bb737d8f45085814cc44))

## [9.1.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@9.0.1...@kintone/plugin-manifest-validator@9.1.0) (2023-09-26)


### Features

* **plugin-manifest-validator:** support custom validator for file existence ([#2246](https://github.com/kintone/js-sdk/issues/2246)) ([6301744](https://github.com/kintone/js-sdk/commit/63017444fe2feda481731a62c5d5f389109fa3ba))


### Bug Fixes

* **plugin-manifest-validator:** update default non-existent file message ([#2253](https://github.com/kintone/js-sdk/issues/2253)) ([8cbd044](https://github.com/kintone/js-sdk/commit/8cbd0446f0a10aa4d5197ba5d7cc5ba3955dfd5b))

## [9.0.1](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@9.0.0...@kintone/plugin-manifest-validator@9.0.1) (2023-06-21)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

# [9.0.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@8.0.2...@kintone/plugin-manifest-validator@9.0.0) (2023-06-07)

- build!: drop Node v14 support because of the EOL (#2124) ([ef0e004](https://github.com/kintone/js-sdk/commit/ef0e004b40a518a1b5a3aa5d82446c556c742f02)), closes [#2124](https://github.com/kintone/js-sdk/issues/2124)

### BREAKING CHANGES

- We dropped Node v14 support. Now supported versions are v16, v18, and v20.

## [8.0.2](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@8.0.1...@kintone/plugin-manifest-validator@8.0.2) (2023-05-10)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [8.0.1](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@8.0.0...@kintone/plugin-manifest-validator@8.0.1) (2023-04-04)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

# [8.0.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@7.0.9...@kintone/plugin-manifest-validator@8.0.0) (2023-03-29)

### chore

- **plugin-manifest-validator:** update dependency ajv to v8 ([06d9e03](https://github.com/kintone/js-sdk/commit/06d9e03ab87c7cc7cfc8be45dcdbbf1fefad5792))

### BREAKING CHANGES

- **plugin-manifest-validator:** the `ErrorObject` is changed according to Ajv v8 changes

## [7.0.9](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@7.0.8...@kintone/plugin-manifest-validator@7.0.9) (2023-02-22)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [7.0.8](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@7.0.7...@kintone/plugin-manifest-validator@7.0.8) (2023-01-25)

### Bug Fixes

- **plugin-manifest-validator:** rebuild schema file ([#1904](https://github.com/kintone/js-sdk/issues/1904)) ([20f86f6](https://github.com/kintone/js-sdk/commit/20f86f66b5008f9115735a5d9e43532ad8d010db))

## [7.0.7](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@7.0.6...@kintone/plugin-manifest-validator@7.0.7) (2022-12-21)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [7.0.6](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@7.0.5...@kintone/plugin-manifest-validator@7.0.6) (2022-11-16)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [7.0.5](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@7.0.4...@kintone/plugin-manifest-validator@7.0.5) (2022-08-10)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [7.0.4](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@7.0.3...@kintone/plugin-manifest-validator@7.0.4) (2022-07-21)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [7.0.3](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@7.0.2...@kintone/plugin-manifest-validator@7.0.3) (2022-06-29)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [7.0.2](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@7.0.1...@kintone/plugin-manifest-validator@7.0.2) (2022-06-01)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [7.0.1](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@7.0.0...@kintone/plugin-manifest-validator@7.0.1) (2022-05-20)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

# [7.0.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.1.13...@kintone/plugin-manifest-validator@7.0.0) (2022-05-13)

- chore!: drop Node v12 support because of the EOL (BREAKING CHANGE) (#1493) ([0d9dae1](https://github.com/kintone/js-sdk/commit/0d9dae10582fc40d89a1af8db4a2efc1d776a456)), closes [#1493](https://github.com/kintone/js-sdk/issues/1493)

### BREAKING CHANGES

- drop Node v12 support because of the EOL.

- ci: update Node version 14 -> 16

- ci: remove Node 18.x from test workflow

## [6.1.13](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.1.12...@kintone/plugin-manifest-validator@6.1.13) (2022-03-04)

### Bug Fixes

- **deps:** update dependency ajv to ^7.2.4 ([#1290](https://github.com/kintone/js-sdk/issues/1290)) ([28ebd21](https://github.com/kintone/js-sdk/commit/28ebd21b48fce964cc01816a99a991982f1ef48e))

## 6.1.12 (2022-02-14)

### Bug Fixes

- **deps:** update dependency @kintone/rest-api-client to ^2.0.34 ([#1341](https://github.com/kintone/js-sdk/issues/1341)) ([0e01847](https://github.com/kintone/js-sdk/commit/0e018475d77c68f42d414d563377aef56a7a1d41))

## 6.1.11 (2022-02-04)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## 6.1.10 (2022-01-18)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## 6.1.9 (2022-01-11)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## 6.1.8 (2021-12-24)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## 6.1.7 (2021-12-24)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [6.1.6](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.1.5...@kintone/plugin-manifest-validator@6.1.6) (2021-12-21)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [6.1.5](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.1.4...@kintone/plugin-manifest-validator@6.1.5) (2021-12-15)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [6.1.4](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.1.3...@kintone/plugin-manifest-validator@6.1.4) (2021-11-17)

### Bug Fixes

- **deps:** update dependency bytes to ^3.1.1 ([#1205](https://github.com/kintone/js-sdk/issues/1205)) ([d33b967](https://github.com/kintone/js-sdk/commit/d33b967e50b7a676b4288cb33ab336767262e1a8))

## [6.1.3](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.1.2...@kintone/plugin-manifest-validator@6.1.3) (2021-09-15)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [6.1.2](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.1.1...@kintone/plugin-manifest-validator@6.1.2) (2021-08-11)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [6.1.1](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.1.0...@kintone/plugin-manifest-validator@6.1.1) (2021-07-28)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

# [6.1.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.0.1...@kintone/plugin-manifest-validator@6.1.0) (2021-07-12)

### Features

- **plugin-manifest-validator:** accept new format plugin versions ([#972](https://github.com/kintone/js-sdk/issues/972)) ([66b3398](https://github.com/kintone/js-sdk/commit/66b3398e07e9779a630176450224060908b63249))

## [6.0.1](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.0.0...@kintone/plugin-manifest-validator@6.0.1) (2021-06-15)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

# [6.0.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@5.0.2...@kintone/plugin-manifest-validator@6.0.0) (2021-05-11)

### chore

- drop Node v10 support ([#870](https://github.com/kintone/js-sdk/issues/870)) ([5263389](https://github.com/kintone/js-sdk/commit/526338928e5a89a1f24c7458fc0c7c2452e36cc1))

### BREAKING CHANGES

- drop Node v10 support because of the EOL.

## [5.0.2](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@5.0.1...@kintone/plugin-manifest-validator@5.0.2) (2021-04-13)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [5.0.1](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@5.0.0...@kintone/plugin-manifest-validator@5.0.1) (2021-03-31)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

# [5.0.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@4.0.2...@kintone/plugin-manifest-validator@5.0.0) (2021-03-09)

### Bug Fixes

- **deps:** update dependency ajv to ^7.0.4 ([10cb494](https://github.com/kintone/js-sdk/commit/10cb4943f2446a8e3170759d5da8cc2390a3eeef))

### chore

- **deps:** update dependency ajv to v7 ([#636](https://github.com/kintone/js-sdk/issues/636)) ([a5490d5](https://github.com/kintone/js-sdk/commit/a5490d5702de9f32b06e1511f1e924388e7510c4))

### BREAKING CHANGES

- **deps:** The format of dataPath and message in an error object have been changed.
  dataPath: .desktop.css[0] -> /desktop/css/0
  message: **_ is a required property -> _** should have required property 'version'

- fix: put maxItems in the correct location

- refactor: remove unnecessary code

- refactor: define SchemaValidateFunction locally

- test: add a test for maxItems

- chore: add a note for PR that expose SchemaValidateFunction

- types: regenerate manifest-schema.d.ts

- docs: update an error object format

- docs: update a link to the documentation for validation errors

Co-authored-by: Renovate Bot <bot@renovateapp.com>
Co-authored-by: Toru Kobayashi <koba0004@gmail.com>

## [4.0.2](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@4.0.1...@kintone/plugin-manifest-validator@4.0.2) (2021-03-02)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [4.0.1](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@4.0.0...@kintone/plugin-manifest-validator@4.0.1) (2021-02-17)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

# [4.0.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@3.0.12...@kintone/plugin-manifest-validator@4.0.0) (2021-02-09)

### Features

- **plugin-manifest-validator:** bump the JSON Schema version from draft4 to draft7 ([#652](https://github.com/kintone/js-sdk/issues/652)) ([1545f94](https://github.com/kintone/js-sdk/commit/1545f94d76dc8f7b5b863748d5f78005091bed01))
- **plugin-manifest-validator:** Generate declaration file for TS interface ([#670](https://github.com/kintone/js-sdk/issues/670)) ([2b2ce2a](https://github.com/kintone/js-sdk/commit/2b2ce2acf0c5a4eccd2c15c12595e5cbcf064bad))

### BREAKING CHANGES

- **plugin-manifest-validator:** bump the JSON Schema version from draft4 to draft7

## [3.0.12](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@3.0.11...@kintone/plugin-manifest-validator@3.0.12) (2021-01-26)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [3.0.11](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@3.0.10...@kintone/plugin-manifest-validator@3.0.11) (2021-01-19)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [3.0.10](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@3.0.9...@kintone/plugin-manifest-validator@3.0.10) (2020-12-16)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [3.0.9](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@3.0.8...@kintone/plugin-manifest-validator@3.0.9) (2020-10-21)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

## [3.0.8](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@3.0.7...@kintone/plugin-manifest-validator@3.0.8) (2020-10-12)

### Bug Fixes

- **deps:** update dependency ajv to ^6.12.5 ([845fe92](https://github.com/kintone/js-sdk/commit/845fe929325eeb2459d1963f4a0ccfd7f525c2b2))
- **deps:** update dependency ajv to ^6.12.6 ([e0f700f](https://github.com/kintone/js-sdk/commit/e0f700fbed73d692c30eac25e7c9e8401d9645ee))

## [3.0.7](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@3.0.6...@kintone/plugin-manifest-validator@3.0.7) (2020-08-28)

### Bug Fixes

- **deps:** update dependency ajv to ^6.12.4 ([f6dccab](https://github.com/kintone/js-sdk/commit/f6dccab51d5168606a71430256c6e580f390f7c3))
- **deps:** update dependency ts-node to v9 ([#370](https://github.com/kintone/js-sdk/issues/370)) ([cf5f38b](https://github.com/kintone/js-sdk/commit/cf5f38bb67eaaa38eaa77f67394dcf79c3cb0306))

## [3.0.6](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@3.0.5...@kintone/plugin-manifest-validator@3.0.6) (2020-07-29)

### Bug Fixes

- **deps:** update dependency ajv to ^6.12.3 ([159759b](https://github.com/kintone/js-sdk/commit/159759bb45b9c34686228bcf7a790743b19d9197))

## [3.0.5](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@3.0.4...@kintone/plugin-manifest-validator@3.0.5) (2020-06-12)

**Note:** Version bump only for package @kintone/plugin-manifest-validator

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.0.4](https://github.com/kintone/plugin-manifest-validator/compare/v3.0.3...v3.0.4) (2020-06-02)

### [3.0.3](https://github.com/kintone/plugin-manifest-validator/compare/v3.0.2...v3.0.3) (2020-04-28)

### Bug Fixes

- **deps:** update dependency ajv to ^6.12.2 ([86dbf90](https://github.com/kintone/plugin-manifest-validator/commit/86dbf90bc35514d0517a418bb14876f92cec0660))

### [3.0.2](https://github.com/kintone/plugin-manifest-validator/compare/v3.0.1...v3.0.2) (2020-03-24)

### [3.0.1](https://github.com/kintone/plugin-manifest-validator/compare/v3.0.0...v3.0.1) (2020-02-25)

### Bug Fixes

- **deps:** update dependency ajv to ^6.11.0 ([#249](https://github.com/kintone/plugin-manifest-validator/issues/249)) ([5068890](https://github.com/kintone/plugin-manifest-validator/commit/50688906a0936d0292ed78ab462a195454f2c562))
- **deps:** update dependency ajv to ^6.12.0 ([#257](https://github.com/kintone/plugin-manifest-validator/issues/257)) ([28c4a69](https://github.com/kintone/plugin-manifest-validator/commit/28c4a691d4a8e31f6f9a376f338e31e1072d889d))

## [3.0.0](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.10...v3.0.0) (2020-01-28)

### ⚠ BREAKING CHANGES

- drop Node v8 support

- drop Node v8 support ([#252](https://github.com/kintone/plugin-manifest-validator/issues/252)) ([3fee857](https://github.com/kintone/plugin-manifest-validator/commit/3fee8574921960d8a5ad30fcf0217190f69ab6b1))

### [2.0.10](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.9...v2.0.10) (2019-12-24)

### [2.0.9](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.8...v2.0.9) (2019-12-03)

### Bug Fixes

- change validateHttpsUrl logic ([#237](https://github.com/kintone/plugin-manifest-validator/issues/237)) ([58e3bc9](https://github.com/kintone/plugin-manifest-validator/commit/58e3bc91605f9c06f4f1030b367d67f9f04b8f6c)), closes [#175](https://github.com/kintone/plugin-manifest-validator/issues/175)

### [2.0.8](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.7...v2.0.8) (2019-11-26)

### [2.0.7](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.6...v2.0.7) (2019-10-23)

### [2.0.6](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.5...v2.0.6) (2019-10-01)

### Bug Fixes

- Suppress `schema $id ignored ...` log ([#228](https://github.com/kintone/plugin-manifest-validator/issues/228)) ([7a6e095](https://github.com/kintone/plugin-manifest-validator/commit/7a6e095))

### [2.0.5](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.4...v2.0.5) (2019-09-24)

### [2.0.4](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.3...v2.0.4) (2019-08-27)

### [2.0.3](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.2...v2.0.3) (2019-08-27)

### [2.0.2](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.1...v2.0.2) (2019-07-23)

### Bug Fixes

- **deps:** update dependency ajv to ^6.10.1 ([b44d393](https://github.com/kintone/plugin-manifest-validator/commit/b44d393))
- **deps:** update dependency ajv to ^6.10.2 ([ae1ea30](https://github.com/kintone/plugin-manifest-validator/commit/ae1ea30))

## [2.0.1](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.0...v2.0.1) (2019-06-25)

# [2.0.0](https://github.com/kintone/plugin-manifest-validator/compare/v1.1.0-alpha.0...v2.0.0) (2019-06-11)

### Continuous Integration

- drop Node v6 and add Node v12 as a supporting version ([#180](https://github.com/kintone/plugin-manifest-validator/issues/180)) ([d53311b](https://github.com/kintone/plugin-manifest-validator/commit/d53311b))

### BREAKING CHANGES

- drop Node v6 support

# [1.1.0-alpha.0](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.8...v1.1.0-alpha.0) (2019-05-14)

### Features

- support mobile css ([6a90db8](https://github.com/kintone/plugin-manifest-validator/commit/6a90db8))
- update file size limit to 20MB ([dc6adb2](https://github.com/kintone/plugin-manifest-validator/commit/dc6adb2))

## [1.0.8](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.7...v1.0.8) (2019-04-23)

## [1.0.7](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.6...v1.0.7) (2019-03-26)

### Bug Fixes

- **deps:** Fix `release` script ([3afc4f7](https://github.com/kintone/plugin-manifest-validator/commit/3afc4f7))
- **deps:** update dependency ajv to ^6.10.0 ([#145](https://github.com/kintone/plugin-manifest-validator/issues/145)) ([aa8a90f](https://github.com/kintone/plugin-manifest-validator/commit/aa8a90f))
- **deps:** update dependency ajv to ^6.9.2 ([#136](https://github.com/kintone/plugin-manifest-validator/issues/136)) ([b39d773](https://github.com/kintone/plugin-manifest-validator/commit/b39d773))

## [1.0.6](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.5...v1.0.6) (2019-02-26)

### Bug Fixes

- **deps:** update dependency ajv to ^6.8.1 ([#128](https://github.com/kintone/plugin-manifest-validator/issues/128)) ([c3b2cd6](https://github.com/kintone/plugin-manifest-validator/commit/c3b2cd6))
- **deps:** update dependency bytes to ^3.1.0 ([#130](https://github.com/kintone/plugin-manifest-validator/issues/130)) ([bc06f36](https://github.com/kintone/plugin-manifest-validator/commit/bc06f36))

<a name="1.0.5"></a>

## [1.0.5](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.4...v1.0.5) (2018-12-26)

### Bug Fixes

- **deps:** update dependency ajv to ^6.6.2 ([#117](https://github.com/kintone/plugin-manifest-validator/issues/117)) ([b6d5a5c](https://github.com/kintone/plugin-manifest-validator/commit/b6d5a5c))

<a name="1.0.4"></a>

## [1.0.4](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.3...v1.0.4) (2018-11-20)

### Bug Fixes

- **deps:** update dependency ajv to ^6.5.5 ([7f72ee8](https://github.com/kintone/plugin-manifest-validator/commit/7f72ee8))

<a name="1.0.3"></a>

## [1.0.3](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.2...v1.0.3) (2018-10-10)

### Bug Fixes

- **deps:** update dependency ajv to ^6.5.4 ([e7a632b](https://github.com/kintone/plugin-manifest-validator/commit/e7a632b))

<a name="1.0.2"></a>

## [1.0.2](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.1...v1.0.2) (2018-09-12)

### Bug Fixes

- **deps:** update dependency ajv to ^6.5.3 ([59733ec](https://github.com/kintone/plugin-manifest-validator/commit/59733ec))

<a name="1.0.1"></a>

## [1.0.1](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.0...v1.0.1) (2018-08-07)

### Bug Fixes

- **deps:** update dependency ajv to ^6.5.2 ([10ad0d3](https://github.com/kintone/plugin-manifest-validator/commit/10ad0d3))
- **eslint:** fix eslintrc for eslint@5 ([#71](https://github.com/kintone/plugin-manifest-validator/issues/71)) ([52ad801](https://github.com/kintone/plugin-manifest-validator/commit/52ad801))

## Before 1.0.1

The changelog are in the GitHub's release page.

https://github.com/kintone/plugin-manifest-validator/releases
