# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.2.0](https://github.com/kintone/js-sdk/compare/@kintone/rest-api-client@0.1.0...@kintone/rest-api-client@0.2.0) (2020-01-09)


### Bug Fixes

* enable updateAppSettings to receive all color theme ([7668730](https://github.com/kintone/js-sdk/commit/76687300ff8b6f8ad9a8c588601cf3ad1a2cb626))
* make `auth` optional and set default value ([35e87be](https://github.com/kintone/js-sdk/commit/35e87be524dce44c63226e37afb0b42b8fe80a99))
* modify getAllRecordsRecursiveWithOffset to be private ([943c5e5](https://github.com/kintone/js-sdk/commit/943c5e5afc06a399ffe256f5da55b5a7404ad55d))
* returned `id` and `revision` are always string ([eb006e9](https://github.com/kintone/js-sdk/commit/eb006e9e708d42ef599f18381dfa4a1878697f18))


### Features

* enable AppClient to receive guestSpaceId ([b1e4cc8](https://github.com/kintone/js-sdk/commit/b1e4cc8a334b84a20f9019b4dbe95c2a95467eec))
* enable BulkRequestClient to receive guestSpaceId ([bc60b66](https://github.com/kintone/js-sdk/commit/bc60b661c3314640a79720768dc4095f09ea6d13))
* enable FileClient to receive guestSpaceId ([890c3cc](https://github.com/kintone/js-sdk/commit/890c3cc013d11cf8c4e3e06db95116e46ce87a12))
* enable RecordClient to receive guestSpaceId ([3436237](https://github.com/kintone/js-sdk/commit/3436237ac37a0c9ad9da0f0b51709124742443c2))
* implement buildPath ([75b9b82](https://github.com/kintone/js-sdk/commit/75b9b826fbcb4e6ece80ed9bcfb6f85750aadd13))
* implemet methods for GET & PUT /app/settings.json ([ccba739](https://github.com/kintone/js-sdk/commit/ccba7392f1f2ffd79aafbd79b523d158842ac441))





# 0.1.0 (2019-12-25)


### Bug Fixes

* add esm and umd directory into a npm package ([7f67812](https://github.com/kintone/js-sdk/commit/7f67812e9e09aa988f46111fdfea8c42819cff9f))
* app is required for updateRecordAcl and updateFieldAcl ([41cc86a](https://github.com/kintone/js-sdk/commit/41cc86acaa2f55df7f4b56f71555244c4649b349))
* don't generate source-map on production ([c6088e2](https://github.com/kintone/js-sdk/commit/c6088e2144be9fe264121b675db0df861c7051e4))
* homepage url ([0715f8e](https://github.com/kintone/js-sdk/commit/0715f8ec8c77d7f75dd31f8fef71b65981114441))
* rename KintoneAPIClient|KintoneAPIError -> KintoneRestAPIClient|KintoneRestAPIError ([89de578](https://github.com/kintone/js-sdk/commit/89de578894ffa201d7ababb10a2c410ea88246fc))


### Features

* add umd build environment ([86b39cb](https://github.com/kintone/js-sdk/commit/86b39cb4307c90bb39f10d5ba7fdd5b156283747))
* implement method for GET /app/customize.json ([8837793](https://github.com/kintone/js-sdk/commit/8837793538c8b25d99f0ac3e2f293af54ab6ddbb))
* implement method for PUT /app/customize.json ([c14c8e2](https://github.com/kintone/js-sdk/commit/c14c8e297b39ed27a131a3a88cab0dab42a5558a))
* rename the package name to @kintone/rest-api-client ([075345c](https://github.com/kintone/js-sdk/commit/075345c7f10d5ecbb7f48089bab02cb03ed548cc))
