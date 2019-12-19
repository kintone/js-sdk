# Contributing Guide

Thank you for your contribution!

## Setup

This repository is a monorepo using Lerna and Yarn Workspaces.

```sh
% cd js-sdk
% yarn install
```

## Development

We use conventional commits for our commit messages.
So if you are not familiar with it, please see the following resource.

https://www.conventionalcommits.org/

## Test

```sh
% cd js-sdk
% yarn test
% yarn lint
```

## Release (for maintainers)

```
% cd js-sdk
% yarn release
```

If you'd like to release a new package.

```
% cd js-sdk
% yarn initial:release
```

