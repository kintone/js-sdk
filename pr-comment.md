<!-- Thank you for sending a pull request! -->

## Why

<!-- Why do you want the feature and why does it make sense for the package? -->

Migrate JavaScript script files (bin/cli.js, build scripts, etc.) to TypeScript to improve codebase consistency and type safety.

## What

<!-- What is a solution you want to add? -->

### Migrate bin/cli.js to TypeScript

Unified to the plugin-uploader pattern (thin wrapper):

- **plugin-packer**: Reduced bin/cli.js to a 3-line wrapper, moved meow parsing to src/cli.ts
- **create-plugin**: Reduced bin/cli.js to a 3-line wrapper, created new src/cli.ts
- **customize-uploader**: Reduced bin/cli.js to a 3-line wrapper, created new src/cli.ts

### Migrate other JS scripts

- **plugin-manifest-validator**: script/generate-dts.js → script/generate-dts.ts
  - Added `with { type: "json" }` for Node.js v24 compatibility
- **plugin-packer**: Removed from-manifest.js, using package.json exports field instead
- **dts-gen**: bin/npm-build.js → scripts/npm-build.ts
  - Using `import.meta.url` for ESM compatibility

## How to test

<!-- How can we test this pull request? -->

```bash
# Build and test each package
pnpm --filter @kintone/plugin-packer build && pnpm --filter @kintone/plugin-packer test
pnpm --filter @kintone/create-plugin build && pnpm --filter @kintone/create-plugin test
pnpm --filter @kintone/customize-uploader build && pnpm --filter @kintone/customize-uploader test
pnpm --filter @kintone/plugin-manifest-validator build && pnpm --filter @kintone/plugin-manifest-validator test
pnpm --filter @kintone/dts-gen build && pnpm --filter @kintone/dts-gen test
```

## Checklist

- [x] Read [CONTRIBUTING.md](https://github.com/kintone/js-sdk/blob/main/CONTRIBUTING.md)
- [x] Updated documentation if it is required.
- [x] Added tests if it is required.
- [ ] Passed `pnpm lint` and `pnpm test` on the root directory.
