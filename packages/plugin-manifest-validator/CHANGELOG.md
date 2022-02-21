# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 6.1.12 (2022-02-14)


### Bug Fixes

* **deps:** update dependency @kintone/rest-api-client to ^2.0.34 ([#1341](https://github.com/kintone/js-sdk/issues/1341)) ([0e01847](https://github.com/kintone/js-sdk/commit/0e018475d77c68f42d414d563377aef56a7a1d41))





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

* **deps:** update dependency bytes to ^3.1.1 ([#1205](https://github.com/kintone/js-sdk/issues/1205)) ([d33b967](https://github.com/kintone/js-sdk/commit/d33b967e50b7a676b4288cb33ab336767262e1a8))





## [6.1.3](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.1.2...@kintone/plugin-manifest-validator@6.1.3) (2021-09-15)

**Note:** Version bump only for package @kintone/plugin-manifest-validator





## [6.1.2](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.1.1...@kintone/plugin-manifest-validator@6.1.2) (2021-08-11)

**Note:** Version bump only for package @kintone/plugin-manifest-validator





## [6.1.1](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.1.0...@kintone/plugin-manifest-validator@6.1.1) (2021-07-28)

**Note:** Version bump only for package @kintone/plugin-manifest-validator





# [6.1.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.0.1...@kintone/plugin-manifest-validator@6.1.0) (2021-07-12)


### Features

* **plugin-manifest-validator:** accept new format plugin versions ([#972](https://github.com/kintone/js-sdk/issues/972)) ([66b3398](https://github.com/kintone/js-sdk/commit/66b3398e07e9779a630176450224060908b63249))





## [6.0.1](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@6.0.0...@kintone/plugin-manifest-validator@6.0.1) (2021-06-15)

**Note:** Version bump only for package @kintone/plugin-manifest-validator





# [6.0.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@5.0.2...@kintone/plugin-manifest-validator@6.0.0) (2021-05-11)


### chore

* drop Node v10 support ([#870](https://github.com/kintone/js-sdk/issues/870)) ([5263389](https://github.com/kintone/js-sdk/commit/526338928e5a89a1f24c7458fc0c7c2452e36cc1))


### BREAKING CHANGES

* drop Node v10 support because of the EOL.





## [5.0.2](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@5.0.1...@kintone/plugin-manifest-validator@5.0.2) (2021-04-13)

**Note:** Version bump only for package @kintone/plugin-manifest-validator





## [5.0.1](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@5.0.0...@kintone/plugin-manifest-validator@5.0.1) (2021-03-31)

**Note:** Version bump only for package @kintone/plugin-manifest-validator





# [5.0.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@4.0.2...@kintone/plugin-manifest-validator@5.0.0) (2021-03-09)


### Bug Fixes

* **deps:** update dependency ajv to ^7.0.4 ([10cb494](https://github.com/kintone/js-sdk/commit/10cb4943f2446a8e3170759d5da8cc2390a3eeef))


### chore

* **deps:** update dependency ajv to v7 ([#636](https://github.com/kintone/js-sdk/issues/636)) ([a5490d5](https://github.com/kintone/js-sdk/commit/a5490d5702de9f32b06e1511f1e924388e7510c4))


### BREAKING CHANGES

* **deps:** The format of dataPath and message in an error object have been changed.
dataPath: .desktop.css[0] -> /desktop/css/0
message: *** is a required property -> *** should have required property 'version'

* fix: put maxItems in the correct location

* refactor: remove unnecessary code

* refactor: define SchemaValidateFunction locally

* test: add a test for maxItems

* chore: add a note for PR that expose SchemaValidateFunction

* types: regenerate manifest-schema.d.ts

* docs: update an error object format

* docs: update a link to the documentation for validation errors

Co-authored-by: Renovate Bot <bot@renovateapp.com>
Co-authored-by: Toru Kobayashi <koba0004@gmail.com>





## [4.0.2](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@4.0.1...@kintone/plugin-manifest-validator@4.0.2) (2021-03-02)

**Note:** Version bump only for package @kintone/plugin-manifest-validator





## [4.0.1](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@4.0.0...@kintone/plugin-manifest-validator@4.0.1) (2021-02-17)

**Note:** Version bump only for package @kintone/plugin-manifest-validator





# [4.0.0](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@3.0.12...@kintone/plugin-manifest-validator@4.0.0) (2021-02-09)


### Features

* **plugin-manifest-validator:** bump the JSON Schema version from draft4 to draft7 ([#652](https://github.com/kintone/js-sdk/issues/652)) ([1545f94](https://github.com/kintone/js-sdk/commit/1545f94d76dc8f7b5b863748d5f78005091bed01))
* **plugin-manifest-validator:** Generate declaration file for TS interface ([#670](https://github.com/kintone/js-sdk/issues/670)) ([2b2ce2a](https://github.com/kintone/js-sdk/commit/2b2ce2acf0c5a4eccd2c15c12595e5cbcf064bad))


### BREAKING CHANGES

* **plugin-manifest-validator:** bump the JSON Schema version from draft4 to draft7





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

* **deps:** update dependency ajv to ^6.12.5 ([845fe92](https://github.com/kintone/js-sdk/commit/845fe929325eeb2459d1963f4a0ccfd7f525c2b2))
* **deps:** update dependency ajv to ^6.12.6 ([e0f700f](https://github.com/kintone/js-sdk/commit/e0f700fbed73d692c30eac25e7c9e8401d9645ee))





## [3.0.7](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@3.0.6...@kintone/plugin-manifest-validator@3.0.7) (2020-08-28)


### Bug Fixes

* **deps:** update dependency ajv to ^6.12.4 ([f6dccab](https://github.com/kintone/js-sdk/commit/f6dccab51d5168606a71430256c6e580f390f7c3))
* **deps:** update dependency ts-node to v9 ([#370](https://github.com/kintone/js-sdk/issues/370)) ([cf5f38b](https://github.com/kintone/js-sdk/commit/cf5f38bb67eaaa38eaa77f67394dcf79c3cb0306))





## [3.0.6](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@3.0.5...@kintone/plugin-manifest-validator@3.0.6) (2020-07-29)


### Bug Fixes

* **deps:** update dependency ajv to ^6.12.3 ([159759b](https://github.com/kintone/js-sdk/commit/159759bb45b9c34686228bcf7a790743b19d9197))





## [3.0.5](https://github.com/kintone/js-sdk/compare/@kintone/plugin-manifest-validator@3.0.4...@kintone/plugin-manifest-validator@3.0.5) (2020-06-12)

**Note:** Version bump only for package @kintone/plugin-manifest-validator





# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.0.4](https://github.com/kintone/plugin-manifest-validator/compare/v3.0.3...v3.0.4) (2020-06-02)

### [3.0.3](https://github.com/kintone/plugin-manifest-validator/compare/v3.0.2...v3.0.3) (2020-04-28)


### Bug Fixes

* **deps:** update dependency ajv to ^6.12.2 ([86dbf90](https://github.com/kintone/plugin-manifest-validator/commit/86dbf90bc35514d0517a418bb14876f92cec0660))

### [3.0.2](https://github.com/kintone/plugin-manifest-validator/compare/v3.0.1...v3.0.2) (2020-03-24)

### [3.0.1](https://github.com/kintone/plugin-manifest-validator/compare/v3.0.0...v3.0.1) (2020-02-25)


### Bug Fixes

* **deps:** update dependency ajv to ^6.11.0 ([#249](https://github.com/kintone/plugin-manifest-validator/issues/249)) ([5068890](https://github.com/kintone/plugin-manifest-validator/commit/50688906a0936d0292ed78ab462a195454f2c562))
* **deps:** update dependency ajv to ^6.12.0 ([#257](https://github.com/kintone/plugin-manifest-validator/issues/257)) ([28c4a69](https://github.com/kintone/plugin-manifest-validator/commit/28c4a691d4a8e31f6f9a376f338e31e1072d889d))

## [3.0.0](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.10...v3.0.0) (2020-01-28)


### ⚠ BREAKING CHANGES

* drop Node v8 support

* drop Node v8 support ([#252](https://github.com/kintone/plugin-manifest-validator/issues/252)) ([3fee857](https://github.com/kintone/plugin-manifest-validator/commit/3fee8574921960d8a5ad30fcf0217190f69ab6b1))

### [2.0.10](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.9...v2.0.10) (2019-12-24)

### [2.0.9](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.8...v2.0.9) (2019-12-03)


### Bug Fixes

* change validateHttpsUrl logic ([#237](https://github.com/kintone/plugin-manifest-validator/issues/237)) ([58e3bc9](https://github.com/kintone/plugin-manifest-validator/commit/58e3bc91605f9c06f4f1030b367d67f9f04b8f6c)), closes [#175](https://github.com/kintone/plugin-manifest-validator/issues/175)

### [2.0.8](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.7...v2.0.8) (2019-11-26)

### [2.0.7](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.6...v2.0.7) (2019-10-23)

### [2.0.6](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.5...v2.0.6) (2019-10-01)


### Bug Fixes

* Suppress `schema $id ignored ...` log ([#228](https://github.com/kintone/plugin-manifest-validator/issues/228)) ([7a6e095](https://github.com/kintone/plugin-manifest-validator/commit/7a6e095))

### [2.0.5](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.4...v2.0.5) (2019-09-24)

### [2.0.4](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.3...v2.0.4) (2019-08-27)



### [2.0.3](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.2...v2.0.3) (2019-08-27)



### [2.0.2](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.1...v2.0.2) (2019-07-23)


### Bug Fixes

* **deps:** update dependency ajv to ^6.10.1 ([b44d393](https://github.com/kintone/plugin-manifest-validator/commit/b44d393))
* **deps:** update dependency ajv to ^6.10.2 ([ae1ea30](https://github.com/kintone/plugin-manifest-validator/commit/ae1ea30))



## [2.0.1](https://github.com/kintone/plugin-manifest-validator/compare/v2.0.0...v2.0.1) (2019-06-25)



# [2.0.0](https://github.com/kintone/plugin-manifest-validator/compare/v1.1.0-alpha.0...v2.0.0) (2019-06-11)


### Continuous Integration

* drop Node v6 and add Node v12 as a supporting version ([#180](https://github.com/kintone/plugin-manifest-validator/issues/180)) ([d53311b](https://github.com/kintone/plugin-manifest-validator/commit/d53311b))


### BREAKING CHANGES

* drop Node v6 support



# [1.1.0-alpha.0](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.8...v1.1.0-alpha.0) (2019-05-14)


### Features

* support mobile css ([6a90db8](https://github.com/kintone/plugin-manifest-validator/commit/6a90db8))
* update file size limit to 20MB ([dc6adb2](https://github.com/kintone/plugin-manifest-validator/commit/dc6adb2))



## [1.0.8](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.7...v1.0.8) (2019-04-23)



## [1.0.7](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.6...v1.0.7) (2019-03-26)


### Bug Fixes

* **deps:** Fix `release` script ([3afc4f7](https://github.com/kintone/plugin-manifest-validator/commit/3afc4f7))
* **deps:** update dependency ajv to ^6.10.0 ([#145](https://github.com/kintone/plugin-manifest-validator/issues/145)) ([aa8a90f](https://github.com/kintone/plugin-manifest-validator/commit/aa8a90f))
* **deps:** update dependency ajv to ^6.9.2 ([#136](https://github.com/kintone/plugin-manifest-validator/issues/136)) ([b39d773](https://github.com/kintone/plugin-manifest-validator/commit/b39d773))



## [1.0.6](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.5...v1.0.6) (2019-02-26)


### Bug Fixes

* **deps:** update dependency ajv to ^6.8.1 ([#128](https://github.com/kintone/plugin-manifest-validator/issues/128)) ([c3b2cd6](https://github.com/kintone/plugin-manifest-validator/commit/c3b2cd6))
* **deps:** update dependency bytes to ^3.1.0 ([#130](https://github.com/kintone/plugin-manifest-validator/issues/130)) ([bc06f36](https://github.com/kintone/plugin-manifest-validator/commit/bc06f36))



<a name="1.0.5"></a>
## [1.0.5](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.4...v1.0.5) (2018-12-26)


### Bug Fixes

* **deps:** update dependency ajv to ^6.6.2 ([#117](https://github.com/kintone/plugin-manifest-validator/issues/117)) ([b6d5a5c](https://github.com/kintone/plugin-manifest-validator/commit/b6d5a5c))



<a name="1.0.4"></a>
## [1.0.4](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.3...v1.0.4) (2018-11-20)


### Bug Fixes

* **deps:** update dependency ajv to ^6.5.5 ([7f72ee8](https://github.com/kintone/plugin-manifest-validator/commit/7f72ee8))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.2...v1.0.3) (2018-10-10)


### Bug Fixes

* **deps:** update dependency ajv to ^6.5.4 ([e7a632b](https://github.com/kintone/plugin-manifest-validator/commit/e7a632b))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.1...v1.0.2) (2018-09-12)


### Bug Fixes

* **deps:** update dependency ajv to ^6.5.3 ([59733ec](https://github.com/kintone/plugin-manifest-validator/commit/59733ec))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/kintone/plugin-manifest-validator/compare/v1.0.0...v1.0.1) (2018-08-07)


### Bug Fixes

* **deps:** update dependency ajv to ^6.5.2 ([10ad0d3](https://github.com/kintone/plugin-manifest-validator/commit/10ad0d3))
* **eslint:** fix eslintrc for eslint@5 ([#71](https://github.com/kintone/plugin-manifest-validator/issues/71)) ([52ad801](https://github.com/kintone/plugin-manifest-validator/commit/52ad801))

## Before 1.0.1

The changelog are in the GitHub's release page.

https://github.com/kintone/plugin-manifest-validator/releases
