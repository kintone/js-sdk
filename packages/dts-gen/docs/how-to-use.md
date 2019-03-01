# dts-gen

Type definition for kintone customize and
Type definition generation tool from kintone form settings.


## Write kintone customize with TypeScript

In kintone JavaScript customize, there are functions which are defined in kintone.
When a user tries to write JavaScript customize, there are no definitions on typescript compile context.

So This tools has `kintone.d.ts` files which has a global function definition in TypeScript syntax manner. And then, you can write JavaScript customize with TypeScript.

And This tools also contains a command-line tool for type definition generator which
uses kintone form settings API.

## How to generate kintone-dts-gen

you can generate `sample-field.d.ts` like below:

```bash
$ kintone-dts-gen --host http://***.cybozu.com \
                 -u username \
                 -p password \
                 --app-id 12 \
                 --type-name SampleFields
                 --namespace company.name.types \
                 -o sample-fields.d.ts
```

kintone-dts-gen generates record field definition from kintone form settings.
And from this command line option, record field type definition(`company.name.types.SampleFields`)
is defined in `sample-fields.d.ts`.

**If you change form settings in kintone, Please re-generate type definition files**

### demo mode
If you won't have a kintone, you can try with demo mode.
you can generate demo type definition like below:

```bash
$ kintone-dts-gen --demo
```

kintone-dts-gen generates demo record field definition from demo data.
record field type definition(`kintone.types.Fields`)  is defined in `fields.d.ts`

### command line options
You can confirm command line options with `kintone-dts-gen --help`

### Write kintone JavaScript customize with TypeScript

```typescript
/// <reference types="./node_modules/@kintone/dts-gen/kintone" /> // TODO fix path
/// <reference path="./demo-fields.d.ts" />

interface Event {
    appId: number;
    recordId: number;
    record: kintone.types.SavedDemoFields;
}

(() => {
    kintone.events.on("app.record.create.show", (event: Event) => {
        const appId = event.appId;
        const recordId = event.recordId;
        const type = event.record.Record_number.value;
    });
})();
```

1. Write a comment which indicates type definition of kintone built-in functions at your TypeScript file header.

typdef-generator has type definitions of kintone builtin functions.
So you can refer type definition in `.ts` files like below:

```typescript
/// <reference types="./node_modules/@kintone/dts-gen/kintone" />
```

2. Write a comment which indicates field type definition of kintone app record fields at your TypeScript file header.

Using typdef-generator, You can generate Field Type Definition file.

If you generate field type definition from kintone form settings API, you can write type-safe code as to kintone app fields.

For example, you generate `demo-fields.d.ts`,
and you can write a comment as a field type definition.

```typescript
/// <reference path="./demo-fields.d.ts" />
```

3. Compile With TypeScript
And then, You can compile with `tsc` command!
Welcome to TypeSafe kintone coding world!

### Write kintone JavaScript customize with JavaScript

If there are some reasons why you can't use TypeScript, you can use the Type Definition as a type in jsdoc.
If you work with VSCode, WebStorm IDE or some editor, you can gain the power of code completion!

This is a JavaScript coding sample:

```javascript
/// <reference types="./node_modules/@kintone/dts-gen/kintone" />
/// <reference path="./demo-fields.d.ts" />


(function() {
    kintone.events.on("test", function(event){
        /**
         * @type {DemoEvent}
         */
        const record = event.record;
    });
})();
```
