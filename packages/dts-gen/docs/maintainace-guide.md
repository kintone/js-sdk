# Maintainance Guide

## How to build
Just run `npm run build`.

You can artifact in `dist` directory.

After build process finished, `dist/kintone-typlify-integration-test.js` would be generated from `src/integration-tests/kintone-typlify-integration-test.ts`

this code has assertion checks for kintone builtin function exists,
And for field defenition.

## Half automated testing tool

With testing tool, you can prepare test kintone app.
Testing tool try to settting app
which has JavaScript and field defenition, sample record.

```
node ./dist/integration-tests/setup-test-app.js \
    -u *** \
    -p *** \
    --host https://****.cybozu.com \
    --integration-test-js-file ./dist/kintone-typlify-integration-test.js
```

```
Preparing for App(ID:93)
Preparing for field settings(ID:93)
Uploading kintone-typlify-integration-test.js
Finish Uploading kintone-typlify-integration-test.js(1b71b877-61ae-4ac1-9333-a00a97ff0db0)
Waiting for Deploy complete...
Adding Demo Record
```

At this output, this tool generate App(ID:93) and field settings corrsponsds to `src/integration-test/testfields.d.ts` ,upload JavaScript customize file(`dist/kintone-typlify-integration-test.js`) and add sample record to kintone test app.

After Having prepared kintone test app, you should modify added record to 
set user select, organization select, group select fields.

With opening kintone record list page, Test code will run.
And if there are no `AssertionError`, Integration tests success.

## How to run unit tests
Just run `npm run test`

## Write document

I use `docsify`. See Reference: [Quick Start](https://docsify.js.org/#/quickstart)

