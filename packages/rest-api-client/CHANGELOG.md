# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.1.0](https://github.com/kintone/js-sdk/compare/@kintone/rest-api-client@1.0.0...@kintone/rest-api-client@1.1.0) (2020-04-01)


### Bug Fixes

* **deps:** update dependency axios to ^0.19.2 ([a9366e3](https://github.com/kintone/js-sdk/commit/a9366e35e18c19deb0eba469b747b68660254524))
* **deps:** update dependency core-js to ^3.6.4 ([#89](https://github.com/kintone/js-sdk/issues/89)) ([e0df15a](https://github.com/kintone/js-sdk/commit/e0df15a4559f15ae7a1091a8291749125778041e))
* **deps:** update dependency js-base64 to ^2.5.2 ([d621c86](https://github.com/kintone/js-sdk/commit/d621c86efb7731fe8d8b1366669f8909d43161bb))
* **deps:** update dependency qs to ^6.9.1 ([b8ad488](https://github.com/kintone/js-sdk/commit/b8ad488fcdc87aa0fe3594b5aeac028d3fc55b5f))
* **deps:** update dependency qs to ^6.9.2 ([c1b51c3](https://github.com/kintone/js-sdk/commit/c1b51c37aa6cc264e297cbdde582dbaade339942))
* **deps:** update dependency qs to ^6.9.3 ([80597a2](https://github.com/kintone/js-sdk/commit/80597a28dc70a162f368afa5e9fcead51a3f8d94))
* consider when error.bulkRequestIndex = 0 ([#126](https://github.com/kintone/js-sdk/issues/126)) ([4f29b27](https://github.com/kintone/js-sdk/commit/4f29b27f2ab51d45111d5dce28de0f7185b9552d))
* make the type of form fields & layout have properties ([#123](https://github.com/kintone/js-sdk/issues/123)) ([1ac0e72](https://github.com/kintone/js-sdk/commit/1ac0e7232868b48660c8c206c21984dd3219c943))
* response types of RecordClient.updateRecords & BulkRequestClient.send ([#72](https://github.com/kintone/js-sdk/issues/72)) ([1b37c0a](https://github.com/kintone/js-sdk/commit/1b37c0aa79758a32c7f1fcb26a03e0a8bdbba1c8))
* upsertRecord adds a record with the updateKey field ([#117](https://github.com/kintone/js-sdk/issues/117)) ([cf17607](https://github.com/kintone/js-sdk/commit/cf17607abd1507165d2acef3d34c550c2b816d19))


### Features

* add records property into addRecords response ([#73](https://github.com/kintone/js-sdk/issues/73)) ([00f67e3](https://github.com/kintone/js-sdk/commit/00f67e3930a55b44f42298b317af5f9069128b7c))
* deleteAllRecords ([#120](https://github.com/kintone/js-sdk/issues/120)) ([634b9d7](https://github.com/kintone/js-sdk/commit/634b9d78d1b81808488ff6f023ed2568e24b1e4a))
* implement updateAllRecords ([#109](https://github.com/kintone/js-sdk/issues/109)) ([132ccbd](https://github.com/kintone/js-sdk/commit/132ccbd12bde85b156363638c4c4dd2bad9d9ff9))
* implement upsertRecord ([#101](https://github.com/kintone/js-sdk/issues/101)) ([72a17b6](https://github.com/kintone/js-sdk/commit/72a17b63d68a1674bf3f6dc053d0ba9c4650d8ce))
* implements addAllRecords. ([#70](https://github.com/kintone/js-sdk/issues/70)) ([6c7006b](https://github.com/kintone/js-sdk/commit/6c7006b05ef6763b0ceeb8baaf51541e4c8a8375)), closes [#92](https://github.com/kintone/js-sdk/issues/92)
* make the type of `updateKey` more specific ([#144](https://github.com/kintone/js-sdk/issues/144)) ([af69d3f](https://github.com/kintone/js-sdk/commit/af69d3f572f75861bcb96a7128c6fc2250862d05))
* support upload file with file path ([#116](https://github.com/kintone/js-sdk/issues/116)) ([bffc827](https://github.com/kintone/js-sdk/commit/bffc82739d76c60bbb4328f3428a33451d8a89e2))
* Support X-HTTP-Method-Override ([#63](https://github.com/kintone/js-sdk/issues/63)) ([8b4f7c3](https://github.com/kintone/js-sdk/commit/8b4f7c34072e0c932b94f2cac689670c178af1b0))





# [1.0.0](https://github.com/kintone/js-sdk/compare/@kintone/rest-api-client@0.3.0...@kintone/rest-api-client@1.0.0) (2020-02-18)


### Bug Fixes

* better error message ([0b9c2c5](https://github.com/kintone/js-sdk/commit/0b9c2c590ea63f1dd75ca2f00be22e80951ed046))
* incorrect return type of app.getAppSettings ([12a7512](https://github.com/kintone/js-sdk/commit/12a751200e838f5318458305a94e6c931df531ae))
* incorrect return type of app.updateAppSettings ([d59b0ee](https://github.com/kintone/js-sdk/commit/d59b0ee978cb71eebdb2adb165035f4b7410a69d))
* print an appropriate error message when an error response doesn't exist ([f177bb4](https://github.com/kintone/js-sdk/commit/f177bb4025dafc240e56045d66d3b0982862ec69))
* remove unnecessary whitespace ([1608c4e](https://github.com/kintone/js-sdk/commit/1608c4e32c1511bd6704609418cc5aa0a9da5aa1))
* return type of buildDataFromBulkRequestResults ([5c2fb95](https://github.com/kintone/js-sdk/commit/5c2fb95465d1219fdb05f05e0a17a157044efac5))
* type definition of Comment.id ([1d8e28a](https://github.com/kintone/js-sdk/commit/1d8e28a7eb233fb69864f87fddf7d10bd60e0ea8))
* type definition of ErrorResponse ([3ed4846](https://github.com/kintone/js-sdk/commit/3ed484653a1e635bd062bd81f95c4fea80d8ce40))
* type of ErrorResponseData array ([21aaad3](https://github.com/kintone/js-sdk/commit/21aaad3fee29411ea2e42a909a0393fbfdcd652a))


### Features

* add basicAuth to KintoneRestAPIClient ([4a354d0](https://github.com/kintone/js-sdk/commit/4a354d064a27235708dbe0465da87c06d8402420))
* display warning when using getRecords with large offset ([#58](https://github.com/kintone/js-sdk/issues/58)) ([b3a4711](https://github.com/kintone/js-sdk/commit/b3a47118d8fb109e5d27b5d7a1e5f1a39059c9da))
* handle error response of bulkRequest API ([8ade572](https://github.com/kintone/js-sdk/commit/8ade5724417237ec105a9a97819693470c3a5a73))
* improve error message format ([aa76409](https://github.com/kintone/js-sdk/commit/aa76409900a533669ac36faaa761fa211843e648))
* improve the type definition of ErrorResponse.data ([78f48ca](https://github.com/kintone/js-sdk/commit/78f48caa019467a197e62f00c9d4d5b788c01703))
* set bulkRequestIndex in KintoneRestAPIError ([6dd83f1](https://github.com/kintone/js-sdk/commit/6dd83f18b5e091c8ca7c534b2987409d83271145))





# [0.3.0](https://github.com/kintone/js-sdk/compare/@kintone/rest-api-client@0.2.0...@kintone/rest-api-client@0.3.0) (2020-01-15)


### chore

* drop support Node v8 ([4c2d9f7](https://github.com/kintone/js-sdk/commit/4c2d9f7f4b39b66d65f13487d85b31ef82c65596))


### Features

* enable to omit the `baseUrl` parameter in the browser environment ([680e383](https://github.com/kintone/js-sdk/commit/680e383ece2d09a16752a8739dbe4b55c14b7de7))
* make options optional ([ae52d02](https://github.com/kintone/js-sdk/commit/ae52d02dba4791e4d6bb4098d60cce24c1e2170e))
* rename the `host` parameter of KintoneRestAPIClient to `baseUrl` ([efe62cf](https://github.com/kintone/js-sdk/commit/efe62cf76f6e082f5c0db6fb18e87906c256d3a9))


### BREAKING CHANGES

* no longer support Node v8





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
