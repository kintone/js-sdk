# Field Type Definition Guide

When you generate field types, you can set some option:

- `namespace` (defaults: kintone.types)
- `type-name` (defaults: Fields)

If you set options with `namespace=com.cybozu.kintone` and `type-name=AwesomeFields`,
you will get definition like below:

## com.cybozu.kintone.AwesomeFields

This fields type definition which defined in kintone app.

## com.cybozu.kintone.SavedAwesomeFields

Additional to fields of `com.cybozu.kintone.AwesomeFields`,
this type includes `$id`, `$revision`, create time, creator, update time and update time fields.

This fields will be included when you refer to a saved record.

## Notes

`namespace` and `type-name` convention:

- Starts with a letter (`a-z` or `A-Z`), underscore (`_`), or dollar sign (`$`).
- Can be followed by any alphanumeric, underscores, or dollar signs.
