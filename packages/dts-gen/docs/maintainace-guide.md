# Maintainance Guide

## How to build
Just run `npm run build`.

You can artifact in `dist` directory.

After build process finished, build artifact are below:

- `dist/index.js` : entry point of kintone-typlify command line tool
- `dist/integration-tests/setup-test-app.js`: command-line utilify tool for integration test
- `dist/kintone-typlify-integration-test.js`: test code which will be uploaded as kintone js customize


`dist/kintone-typlify-integration-test.js` is build by webpack.
and this code includes some assertions: 

- assert reference for kintone builtin function(see: `src/integration-tests/kintone-typlify-api-test.ts`)
- assert reference for field reference(see: `src/integration-tests/kintone-typlify-fields-test.ts`)

### setup-test-app
with this command-line utilify tool, you can prepare test kintone app.

this command-line utilify will do:

1. create kintone app app for testing 
2. set field setting to (1) app.
3. upload file of `--integration-test-js-file`
4. deploy (1) app
5. add demo record for integration test.

Command line output like below:
```
Preparing for App(ID:93)
Preparing for field settings(ID:93)
Uploading kintone-typlify-integration-test.js
Finish Uploading kintone-typlify-integration-test.js(1b71b877-61ae-4ac1-9333-a00a97ff0db0)
Waiting for Deploy complete...
Adding Demo Record
```

After execute this tool, 

1. Access kintone app(at this example, ID:93), this app includes 1 demo record data.
2. Edit demo record, and you must set value to userSelect, groupSelect, titleSelect.
3. Open app recod list page, and open web console
4. Confirm No AssertionError happend.


You can execute this tools like below:

```
node ./dist/integration-tests/setup-test-app.js \
    -u *** \
    -p *** \
    --host https://****.cybozu.com \
    --integration-test-js-file ./dist/kintone-typlify-integration-test.js
```

`--integration-test-js-file` :

path of integration test which will be uploaded as kintone js customize file.
you can run test code as a kintone customize js customize code.

`-u, --p, --host`: 

username, password, host of kintone.

## How to run unit tests

Just run `npm run test`

## Write document

this document written by `docsify`. 

See Reference: [Quick Start](https://docsify.js.org/#/quickstart)

