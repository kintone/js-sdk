# eslint-plugin-roro

[![npm version](https://badge.fury.io/js/eslint-plugin-roro.svg?icon=si%3Anpm)](https://badge.fury.io/js/eslint-plugin-roro)
[![CI](https://github.com/tasshi-me/eslint-plugin-roro/actions/workflows/ci.yml/badge.svg)](https://github.com/tasshi-me/eslint-plugin-roro/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> This plugin provide rules to enforce the [RORO](https://medium.com/free-code-camp/elegant-patterns-in-modern-javascript-roro-be01e7669cbd) (Receive an Object, Return an Object) pattern.

## Usage

```shell
npm i -D eslint-plugin-roro
```

```javascript
// eslint.config.mjs
import eslintPluginRORO from "eslint-plugin-roro";

export default [eslintPluginRORO.configs.recommended];
```

## Rules

| Name                                           | Description                                        |
| ---------------------------------------------- | -------------------------------------------------- |
| [receive-object](docs/rules/receive-object.md) | Enforce functions to receive only a single object. |
| [return-object](docs/rules/return-object.md)   | Enforce functions to return an object.             |

## License

[MIT](LICENSE)
