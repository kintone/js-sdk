# Plug-in

- [getPlugins](#getPlugins)

## Overview

```ts
const client = new KintoneRestAPIClient();

(async () => {
  try {
    console.log(await client.plugin.getPlugins({ offset: 1, limit: 10 }));
  } catch (error) {
    console.log(error);
  }
})();
```

- All methods are defined on the `plugin` property.
- This method returns a Promise object that is resolved with an object having properties in each `Returns` section.

## Methods

### getPlugins

Gets the list of plug-ins imported into Kintone.

#### Parameters

| Name   |  Type  | Required | Description                                                                                                |
| ------ | :----: | :------: | ---------------------------------------------------------------------------------------------------------- |
| offset | Number |          | The number of plug-ins to skip from the list of installed plug-ins.<br />If ignored, this value is 0.      |
| limit  | Number |          | The maximum number of plug-ins to retrieve.<br />Must be between 1 and 100.The default<br />number is 100. |

#### Returns

| Name                     |  Type   | Description                                                                                                                                                                                          |
| ------------------------ | :-----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| plugins                  |  Array  | A list of Plug-ins added to the App.<br />Plug-ins are listed in descending order of the datetime they are added.                                                                                    |
| plugins[].id             | String  | The Plugin ID.                                                                                                                                                                                       |
| plugins[].name           | String  | The name of the Plugin.                                                                                                                                                                              |
| plugins[].isMarketPlugin | Boolean | States whether or not the plug-in is a Marketplace plug-in.<br /><strong>true</strong>: The plug-in is a Marketplace plug-in.<br /><strong>false</strong>: The plug-in is not a Marketplace plug-in. |
| plugins[].version        | String  | The version number of the plug-in                                                                                                                                                                    |

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/plugins/get-installed-plugins/
