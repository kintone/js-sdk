# Contributing Guide

## For Contributors

Thank you for your contribution!

### Setup

This repository is a monorepo using Lerna and Yarn Workspaces.

```sh
% cd js-sdk
% yarn install
```

### Test

```sh
% cd js-sdk
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

- `build`
- `lint`
- `test`
- `test:ci`
- `prerelease`

## Import a package into `kintone/js-sdk`

You can import an exsiting package with `lerna import path/to/package`.

After the PR has been merged, you have to create a tag at the last commit where the package had been released.
The tag format is `package-name@version`
