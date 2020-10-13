# Maintenance Guide

## How to build

This package is managed with `yarn`, so you have to install `yarn` to build `dts-gen`.

```
$ yarn
$ yarn build
```

You can see the build files in `dist` directory.

After build process finished, build artifact are below:

- `dist/index.js`: entry point of the dts-gen command line tool
- `dist/integration-tests/setup-test-app.js`: a command-line utility tool for integration test
- `dist/dts-gen-integration-test.js`: test code which will be uploaded as kintone js customize


`dist/dts-gen-integration-test.js` is built by webpack.
This code includes some assertions:

- assert reference for kintone builtin function (see: `src/integration-tests/dts-gen-api-test.ts`)
- assert reference for field reference (see: `src/integration-tests/dts-gen-fields-test.ts`)

### setup-test-app
With this command-line utility tool, you can prepare a test kintone app.

This command-line utility will do:

1. Create kintone app for testing
2. Set field setting to (1) app.
3. Upload file of `--integration-test-js-file`
4. Deploy (1) app
5. Add demo record for integration test.

Command line output like below:
```bash
Preparing for App(ID:93)
Preparing for field settings(ID:93)
Uploading dts-gen-integration-test.js
Finish Uploading dts-gen-integration-test.js(1b71b877-61ae-4ac1-9333-a00a97ff0db0)
Waiting for Deploy complete...
Adding Demo Record
```

After executing this tool,

1. Access kintone app(at this example, ID:93), this app includes 1 demo record data.
2. Edit demo record, and you must set a value to userSelect, groupSelect, titleSelect.
3. Open app record list page, and open web console
4. Confirm No AssertionError happens.


You can execute these tools like below:

```bash
$ node ./dist/integration-tests/setup-test-app.js \
    -u *** \
    -p *** \
    --host https://****.cybozu.com \
    --integration-test-js-file ./dist/dts-gen-integration-test.js
```

`--integration-test-js-file` :

path of integration test which will be uploaded as kintone js customize file.
You can run the test code as a kintone customize js customize code.

`-u, --p, --host`:

username, password, host of kintone.
