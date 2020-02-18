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

After you have approved a PR, please merge the PR using **Squash and merge** with [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.

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

