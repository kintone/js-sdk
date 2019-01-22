# Field Type Defenition Guide

when you generate field types, you can set some option:

- `namespace` (defaults: kintone.types)
- `type-name` (defaults: Fields)

if you set options with `namespace=com.cybozu.kintone`, `type-name=AwesomeFields`,

you will get definition like below:

## com.cybozu.kintone.AwesomeFields
This fields type definition which defined in kintone app.

## com.cybozu.kintone.SavedAwesomeFields

Additional to fields of `com.cybozu.kintone.SavedAwesameFields`,
This type includes `$id` and `$revision` fields. 

This fields will be included when you refer to saved record.
