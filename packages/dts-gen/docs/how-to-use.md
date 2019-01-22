# kintone-typlify

Type definition for kintone customize and 
Type definition generation tool from kintone form settings.


## Write kintone customize with TypeScript

In kintone JavaScript customize, there are functions which is defined in kintone.
When user try to write JavaScript customize, there are no definitions on typescript compile context.

So This tools has `kintone.d.ts` files which has a global function definition in TypeScript syntax manner. And then, you can write JavaScripot customize with TypeScript.

And This tools also contains command-line tool for type definition generator which 
uses kintone form settings api.

## How to generate kintone-typelify

you can generate `sample-field.d.ts` like below:

```bash
kintone-typelify --host http://***.cybozu.com \
                 -u username \
                 -p password \
                 --app-id 12 \
                 --type-name SampleFields
                 --namespace company.name.types \
                 -o sample-fields.d.ts
```

kintone-typelify generates record field definition from kintone form settings.
And from this command line option, record field type definition(`company.name.types.SampleFields`) 
is defined in `sample-fields.d.ts`.

**If you change form settings in kintone, Please re-generate type definition files**

### demo mode
If you won't have a kintone, you can try with demo mode. 
you can generate demo type definition like below:

```bash
kintone-typelify --demo
```

kintone-typelify generates demo record field definition from demo data.
record field type definition(`kintone.types.Fields`)  is defined in `fields.d.ts`

### command line options
You can confirm command line options with `kintone-typlify --help`

### Write kintone JavaScript customize with TypeScript

```typescript
/// <reference types="kintone-typlify/kintone" />
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

1. Write a comment which indicate type definition of kintone built-in functions at your TypeScript file header.

kintone-typlify has defenition of kintone builtin functions.
So you can refer type defenition in `.ts` files like below:

`/// <reference types="kintone-typlify/kintone" />`

2. Write a comment which indicaste field type defenition of kintone app record fields at your TypeScript file header.

Using kintone-typlify, You can generate Field Type Definition file.

If you generate field type defition from kintone form setttings api, you can write type safe code as to kintone app fields. 

For example, you generate `demo-fields.d.ts`,
And You can write comment as a field type definition.

`/// <reference path="./demo-fields.d.ts" />`

3. Comiple With TypeScript
And then, You can compile with `tsc` command!
Welcome to TypeSafe kintone coding world!

### Write kintone JavaScript customize with JavaScript

If there are some reasons why you can't use TypeScript, you can use Type Definition as a types in jsdoc.
If you work with VSCode, webstorm IDE or some IDE,you can gain power of code completion!

This is JavaScript coding sample:

```javascript

/// <reference types="kintone-typlify/kintone" />
/// <reference path="./demo-fields.d.ts" />


(function() {
    kintone.events.on("test", function(event){
        /**
         * @type {DemoEvent}
         */
        const record = ev.record;
    });
})();
```
