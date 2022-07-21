# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.12.0](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.11.1...@kintone/data-loader@0.12.0) (2022-07-21)


### Features

* **data-loader:** add executables to releases ([#1601](https://github.com/kintone/js-sdk/issues/1601)) ([f766792](https://github.com/kintone/js-sdk/commit/f76679212cf6b8971d75526dc55a25282189e0be))





## [0.11.1](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.11.0...@kintone/data-loader@0.11.1) (2022-06-29)

**Note:** Version bump only for package @kintone/data-loader





# [0.11.0](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.10.3...@kintone/data-loader@0.11.0) (2022-06-22)


### Features

* **data-loader:** support specify character encoding when import ([#1458](https://github.com/kintone/js-sdk/issues/1458)) ([1f55967](https://github.com/kintone/js-sdk/commit/1f5596770a73495a3ada12a7abf589946aeebdde))





## [0.10.3](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.10.2...@kintone/data-loader@0.10.3) (2022-06-08)

**Note:** Version bump only for package @kintone/data-loader





## [0.10.2](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.10.1...@kintone/data-loader@0.10.2) (2022-06-01)

**Note:** Version bump only for package @kintone/data-loader





## [0.10.1](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.10.0...@kintone/data-loader@0.10.1) (2022-05-20)


### Bug Fixes

* **deps:** update dependency yargs to ^17.5.1 ([#1507](https://github.com/kintone/js-sdk/issues/1507)) ([21e80f1](https://github.com/kintone/js-sdk/commit/21e80f122c498027b144255aab31f9d39166b783))





# [0.10.0](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.9.0...@kintone/data-loader@0.10.0) (2022-05-13)


* chore!: drop Node v12 support because of the EOL (BREAKING CHANGE) (#1493) ([0d9dae1](https://github.com/kintone/js-sdk/commit/0d9dae10582fc40d89a1af8db4a2efc1d776a456)), closes [#1493](https://github.com/kintone/js-sdk/issues/1493)


### Bug Fixes

* **deps:** update dependency yargs to ^17.4.1 ([#1420](https://github.com/kintone/js-sdk/issues/1420)) ([615b57b](https://github.com/kintone/js-sdk/commit/615b57b39a6d0b5bbc689c8021080ca0c10bc5c1))
* **deps:** update dependency yargs to ^17.5.0 ([#1494](https://github.com/kintone/js-sdk/issues/1494)) ([43fed86](https://github.com/kintone/js-sdk/commit/43fed86cf50beee1eac1d6a7406dd09530297bdb))


### Features

* **data-loader:** support datetime related field ([#1451](https://github.com/kintone/js-sdk/issues/1451)) ([21f6eb1](https://github.com/kintone/js-sdk/commit/21f6eb17c61a9f1ea0b6c22bd9b932c21353621d))


### BREAKING CHANGES

* drop Node v12 support because of the EOL.

* ci: update Node version 14 -> 16

* ci: remove Node 18.x from test workflow





# [0.9.0](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.8.0...@kintone/data-loader@0.9.0) (2022-04-28)


### Features

* **data-loader:** support upsert records ([#1449](https://github.com/kintone/js-sdk/issues/1449)) ([35bfe07](https://github.com/kintone/js-sdk/commit/35bfe0757e2ff3172246b170305bc4483326247e)), closes [#1421](https://github.com/kintone/js-sdk/issues/1421) [#1423](https://github.com/kintone/js-sdk/issues/1423)





# [0.8.0](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.7.1...@kintone/data-loader@0.8.0) (2022-03-18)


### Features

* **support:** import Attachment field ([#1404](https://github.com/kintone/js-sdk/issues/1404)) ([2568eb9](https://github.com/kintone/js-sdk/commit/2568eb9fad906be168443667f763b5796d30471f)), closes [#1381](https://github.com/kintone/js-sdk/issues/1381) [#1397](https://github.com/kintone/js-sdk/issues/1397)





## [0.7.1](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.7.0...@kintone/data-loader@0.7.1) (2022-03-04)

**Note:** Version bump only for package @kintone/data-loader





# [0.7.0](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.6.0...@kintone/data-loader@0.7.0) (2022-02-25)


### Bug Fixes

* **data-loader:** export csv correctly when Table value is empty array ([#1349](https://github.com/kintone/js-sdk/issues/1349)) ([0f1371e](https://github.com/kintone/js-sdk/commit/0f1371e54ecdf64b57dba5d3c9307e1b4a6923a1))


### Features

* **data-loader:** support User/Department/Group Selection Field ([#1345](https://github.com/kintone/js-sdk/issues/1345)) ([7ebe9c7](https://github.com/kintone/js-sdk/commit/7ebe9c7b1aa1852569f125736b3e646e4d9e79ad)), closes [#1332](https://github.com/kintone/js-sdk/issues/1332) [#1335](https://github.com/kintone/js-sdk/issues/1335)





# [0.6.0](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.34...@kintone/data-loader@0.6.0) (2022-02-18)


### Features

* **data-loader:** support Attachments fields in CSV export ([#1347](https://github.com/kintone/js-sdk/issues/1347)) ([43aa526](https://github.com/kintone/js-sdk/commit/43aa526e7267aaf77102f1031b2ea9724a850173)), closes [#1332](https://github.com/kintone/js-sdk/issues/1332) [#1335](https://github.com/kintone/js-sdk/issues/1335) [#1346](https://github.com/kintone/js-sdk/issues/1346)





## 0.5.34 (2022-02-14)


### Bug Fixes

* **deps:** update dependency @kintone/rest-api-client to ^2.0.34 ([#1341](https://github.com/kintone/js-sdk/issues/1341)) ([0e01847](https://github.com/kintone/js-sdk/commit/0e018475d77c68f42d414d563377aef56a7a1d41))





## 0.5.33 (2022-02-04)

**Note:** Version bump only for package @kintone/data-loader





## 0.5.32 (2022-01-18)

**Note:** Version bump only for package @kintone/data-loader





## 0.5.31 (2022-01-11)

**Note:** Version bump only for package @kintone/data-loader





## 0.5.30 (2021-12-24)

**Note:** Version bump only for package @kintone/data-loader





## 0.5.29 (2021-12-24)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.28](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.27...@kintone/data-loader@0.5.28) (2021-12-21)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.27](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.26...@kintone/data-loader@0.5.27) (2021-12-15)


### Bug Fixes

* **deps:** update dependency yargs to ^17.3.0 ([#1242](https://github.com/kintone/js-sdk/issues/1242)) ([8c32641](https://github.com/kintone/js-sdk/commit/8c32641bd8d37298e9131ac952661a79d0ea023e))





## [0.5.26](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.25...@kintone/data-loader@0.5.26) (2021-12-07)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.25](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.24...@kintone/data-loader@0.5.25) (2021-12-01)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.24](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.23...@kintone/data-loader@0.5.24) (2021-11-24)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.23](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.22...@kintone/data-loader@0.5.23) (2021-11-17)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.22](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.21...@kintone/data-loader@0.5.22) (2021-11-09)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.21](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.20...@kintone/data-loader@0.5.21) (2021-10-27)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.20](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.19...@kintone/data-loader@0.5.20) (2021-10-20)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.19](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.18...@kintone/data-loader@0.5.19) (2021-10-13)


### Bug Fixes

* **deps:** update dependency yargs to ^17.2.1 ([#1123](https://github.com/kintone/js-sdk/issues/1123)) ([4eb77a1](https://github.com/kintone/js-sdk/commit/4eb77a15d8c39a7a29af2f991bd906ff732eac74))





## [0.5.18](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.17...@kintone/data-loader@0.5.18) (2021-10-06)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.17](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.16...@kintone/data-loader@0.5.17) (2021-09-29)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.16](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.15...@kintone/data-loader@0.5.16) (2021-09-15)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.15](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.14...@kintone/data-loader@0.5.15) (2021-09-08)


### Bug Fixes

* **deps:** update dependency csv-parse to ^4.16.3 ([#1084](https://github.com/kintone/js-sdk/issues/1084)) ([3cddfbf](https://github.com/kintone/js-sdk/commit/3cddfbfcf25d07bc7e6b063477e68f106032eccc))





## [0.5.14](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.13...@kintone/data-loader@0.5.14) (2021-09-01)


### Bug Fixes

* **deps:** update dependency csv-parse to ^4.16.2 ([#1075](https://github.com/kintone/js-sdk/issues/1075)) ([106373d](https://github.com/kintone/js-sdk/commit/106373d63cf5b39a21d8e242c14efd337c6efc1f))





## [0.5.13](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.12...@kintone/data-loader@0.5.13) (2021-08-25)


### Bug Fixes

* **deps:** update dependency yargs to ^17.1.1 ([#1054](https://github.com/kintone/js-sdk/issues/1054)) ([d8289ef](https://github.com/kintone/js-sdk/commit/d8289ef3a750ac6f9835183af471eca51cc5a1e9))





## [0.5.12](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.11...@kintone/data-loader@0.5.12) (2021-08-18)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.11](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.10...@kintone/data-loader@0.5.11) (2021-08-11)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.10](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.9...@kintone/data-loader@0.5.10) (2021-08-04)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.9](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.8...@kintone/data-loader@0.5.9) (2021-07-28)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.8](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.7...@kintone/data-loader@0.5.8) (2021-07-21)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.7](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.6...@kintone/data-loader@0.5.7) (2021-07-12)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.6](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.5...@kintone/data-loader@0.5.6) (2021-07-06)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.5](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.4...@kintone/data-loader@0.5.5) (2021-06-29)


### Bug Fixes

* **data-loader:** ignore unsupported fields from CSV export ([#954](https://github.com/kintone/js-sdk/issues/954)) ([073a977](https://github.com/kintone/js-sdk/commit/073a977b537b3f42124771eb820742a877cb1952))





## [0.5.4](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.3...@kintone/data-loader@0.5.4) (2021-06-22)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.3](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.2...@kintone/data-loader@0.5.3) (2021-06-15)


### Bug Fixes

* **deps:** update dependency csv-parse to ^4.16.0 ([#939](https://github.com/kintone/js-sdk/issues/939)) ([0a974f8](https://github.com/kintone/js-sdk/commit/0a974f8456f0113fc494890d02e31687a88af49b))





## [0.5.2](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.1...@kintone/data-loader@0.5.2) (2021-06-08)

**Note:** Version bump only for package @kintone/data-loader





## [0.5.1](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.5.0...@kintone/data-loader@0.5.1) (2021-06-04)

**Note:** Version bump only for package @kintone/data-loader





# [0.5.0](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.4.2...@kintone/data-loader@0.5.0) (2021-06-01)


### Features

* **data-loader:** add `--order-by` of export option (BREAKING CHANGE) ([#907](https://github.com/kintone/js-sdk/issues/907)) ([0bf641a](https://github.com/kintone/js-sdk/commit/0bf641a5cbddb47af18fc7abcf7d60e68b8eec2e))





## [0.4.2](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.4.1...@kintone/data-loader@0.4.2) (2021-05-25)


### Bug Fixes

* **data-loader:** apply @types/yargs bugfix (DefinitelyTyped/DefinitelyTyped[#52624](https://github.com/kintone/js-sdk/issues/52624)) ([#895](https://github.com/kintone/js-sdk/issues/895)) ([1ad2af5](https://github.com/kintone/js-sdk/commit/1ad2af5b0b1d88c038d9223aaab32986e58ec820))





## [0.4.1](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.4.0...@kintone/data-loader@0.4.1) (2021-05-18)

**Note:** Version bump only for package @kintone/data-loader





# [0.4.0](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.3.0...@kintone/data-loader@0.4.0) (2021-05-11)


### Bug Fixes

* **data-loader:** apply accurated types to CLI command builder ([#832](https://github.com/kintone/js-sdk/issues/832)) ([8487c12](https://github.com/kintone/js-sdk/commit/8487c12ecb88922b5612270d9489571cfab5c354))
* **deps:** update dependency yargs to v17 ([#856](https://github.com/kintone/js-sdk/issues/856)) ([8b9f290](https://github.com/kintone/js-sdk/commit/8b9f290c7ff0b70a6460843984bdd117a57760ea))


### chore

* drop Node v10 support ([#870](https://github.com/kintone/js-sdk/issues/870)) ([5263389](https://github.com/kintone/js-sdk/commit/526338928e5a89a1f24c7458fc0c7c2452e36cc1))


### Features

* **data-loader:** Support fields in table with CSV ([#760](https://github.com/kintone/js-sdk/issues/760)) ([c727b25](https://github.com/kintone/js-sdk/commit/c727b25e69607eae83e893a4289f57e36cfabc97))


### BREAKING CHANGES

* drop Node v10 support because of the EOL.





# [0.3.0](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.2.4...@kintone/data-loader@0.3.0) (2021-04-27)


### Features

* **data-loader:** enhance CLI help message (type and requirement of arguments) ([#828](https://github.com/kintone/js-sdk/issues/828)) ([d4599af](https://github.com/kintone/js-sdk/commit/d4599af06f86aec884c87625ed6a868cbf6f0924))





## [0.2.4](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.2.3...@kintone/data-loader@0.2.4) (2021-04-20)


### Bug Fixes

* **deps:** update dependency csv-parse to ^4.15.4 ([4f9ff54](https://github.com/kintone/js-sdk/commit/4f9ff541474a5c0ed74d7b1e949c42332ef45bd4))





## [0.2.3](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.2.2...@kintone/data-loader@0.2.3) (2021-04-13)

**Note:** Version bump only for package @kintone/data-loader





## [0.2.2](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.2.1...@kintone/data-loader@0.2.2) (2021-04-06)

**Note:** Version bump only for package @kintone/data-loader





## [0.2.1](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.2.0...@kintone/data-loader@0.2.1) (2021-03-31)

**Note:** Version bump only for package @kintone/data-loader





# [0.2.0](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.1.6...@kintone/data-loader@0.2.0) (2021-03-23)


### Features

* **data-loader:** Support CSV format ([#719](https://github.com/kintone/js-sdk/issues/719)) ([59fcab6](https://github.com/kintone/js-sdk/commit/59fcab6094078f1b629850d7d2f3e50ae8167f98))





## [0.1.6](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.1.5...@kintone/data-loader@0.1.6) (2021-03-18)


### Bug Fixes

* **deps:** update dependency yargs to v16 ([#758](https://github.com/kintone/js-sdk/issues/758)) ([b5a7546](https://github.com/kintone/js-sdk/commit/b5a754675449fd32499d3424ab8da52e6c27d379))





## [0.1.5](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.1.4...@kintone/data-loader@0.1.5) (2021-03-09)

**Note:** Version bump only for package @kintone/data-loader





## [0.1.4](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.1.3...@kintone/data-loader@0.1.4) (2021-03-02)


### Bug Fixes

* **data-loader:** add defaultDescription to hide actual default value ([#709](https://github.com/kintone/js-sdk/issues/709)) ([150b585](https://github.com/kintone/js-sdk/commit/150b58594767490d31a29204c866b708544955c4))
* **deps:** update dependency csv-parse to ^4.15.3 ([f54a4cc](https://github.com/kintone/js-sdk/commit/f54a4ccbaec43f90dceaf6533431f4951d37fa92))





## [0.1.3](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.1.2...@kintone/data-loader@0.1.3) (2021-02-17)

**Note:** Version bump only for package @kintone/data-loader





## [0.1.2](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.1.1...@kintone/data-loader@0.1.2) (2021-02-09)


### Bug Fixes

* **deps:** update dependency csv-parse to ^4.15.1 ([#659](https://github.com/kintone/js-sdk/issues/659)) ([4582cd3](https://github.com/kintone/js-sdk/commit/4582cd3ff7b7cd9c1dea41281386044b40a7efa5))
* **deps:** update dependency p-queue to ^6.6.2 ([fddb976](https://github.com/kintone/js-sdk/commit/fddb976a2218d8d7912e43f108127c312804832b))





## [0.1.1](https://github.com/kintone/js-sdk/compare/@kintone/data-loader@0.1.0...@kintone/data-loader@0.1.1) (2021-02-02)

**Note:** Version bump only for package @kintone/data-loader
