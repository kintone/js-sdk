# Contributing Guide

## For Contributors

Thank you for your contribution!

### Setup

This repository is a monorepo using Lerna and Yarn Workspaces.

```sh
% cd js-sdk
% yarn install
```

### Develop

```sh
% cd js-sdk
% yarn start
```

### Test

Before run `lint` and `test` scripts, you have to run `build`.

```sh
% cd js-sdk
% yarn build
% yarn test
% yarn lint
```

## For Maintainers

### Merge

After you have approved a PR, please merge the PR using **Squash and merge** with [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format. The commit message should include the target package name as the scope.

```sh
# rest-api-client is the scope of this commit
feat(rest-api-client): add record.getRecord()
```

### Release

```
% cd js-sdk
% yarn release
```

If you'd like to release a new package.

```
% cd js-sdk
% yarn initial:release
```

## Create a new package

When you create a new package, you must define the following npm-scripts, otherwise CI would be failed.

### `build`

You have to define `build` script to build source files.
In most cases, the script would be `tsc --build --force`.

Actually, the script isn't run when releasing new versions of packages, so it's not necessary.
But it might be helpful when you want to build only specific packages rather than all pacakges, I'm not sure there is any case it is necessary though.

But `prebuild` and `postbuild` are important.

`prebuild` is run before `build`, so it's useful to clean build assets before running a new build.
In most cases, the script would be `yarn clean`, which runs `rimraf` for build assets directories.

`postbuild` is run after `build`, so it's useful to build other assets like ESM and UMD builds.

### `lint`

You have to define `lint` script to lint source files.
In most cases, the script would be the `eslint` command.

You don't have to `tsc --noEmit` as the `lint` script because `tsc` is run as the `build` script that is run before the `lint` script.

### `test`

You have to define `test` script to test source files.
In most cases, the script would be the `jest` command.

### `test:ci`

You have to define `test` script to test source files on CI environments.
In most cases, the script would be the `jest --runInBand` command.

**GitHub Actions might not need the `--runInBand` to run Jest successfully, so we might remove the script in the future.**

### Configure TypeScript Project References

You have to add the new package into the `references` field in `packages/tsconfig.json`, and its dependencies in `kintone/js-sdk` have to be added into the `references` field in the package's `tsconfig.json`.
The `tsconfig.json` has to extend `packages/tsconfig-base.json`.

## Import a package into `kintone/js-sdk`

You can import an exsiting package with `lerna import path/to/package`.

After the PR has been merged, you have to create a tag at the last commit where the package had been released.
The tag format is `package-name@version`
