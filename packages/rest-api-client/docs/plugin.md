# Plug-in

- [getPlugins](#getPlugins)
- [getRequiredPlugins](#getRequiredPlugins)
- [getApps](#getApps)
- [updatePlugin](#updatePlugin)
- [installPlugin](#installPlugin)
- [uninstallPlugin](#uninstallPlugin)

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

### getRequiredPlugins

Gets the list of plug-ins that have been deleted from Kintone, but have already been added to Apps.
This can occur when a plug-in is installed, added to an App, and then proceeded to be uninstalled from the Kintone environment.

#### Parameters

| Name   |  Type  | Required | Description                                                                                                |
| ------ | :----: | :------: | ---------------------------------------------------------------------------------------------------------- |
| offset | Number |          | The number of plug-ins to skip from the list of required plug-ins.<br />If ignored, this value is 0.       |
| limit  | Number |          | The maximum number of plug-ins to retrieve.<br />Must be between 1 and 100.The default<br />number is 100. |

#### Returns

| Name                     |  Type   | Description                                                                                                                                                                                          |
| ------------------------ | :-----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| plugins                  |  Array  | A list of Plug-ins that needs to be installed.                                                                                                                                                       |
| plugins[].id             | String  | The Plugin ID.                                                                                                                                                                                       |
| plugins[].name           | String  | The name of the Plugin.                                                                                                                                                                              |
| plugins[].isMarketPlugin | Boolean | States whether or not the plug-in is a Marketplace plug-in.<br /><strong>true</strong>: The plug-in is a Marketplace plug-in.<br /><strong>false</strong>: The plug-in is not a Marketplace plug-in. |

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/plugins/get-required-plugins/

### getApps

Gets Apps that have the specified plug-in added.

#### Parameters

| Name   |  Type  | Required | Description                                                                                            |
| ------ | :----: | :------: | ------------------------------------------------------------------------------------------------------ |
| id     | String |   Yes    | The ID of the plug-in.                                                                                 |
| offset | Number |          | The number of apps to skip from the list of app.<br />If ignored, this value is 0.                     |
| limit  | Number |          | The maximum number of apps to retrieve.<br />Must be between 1 and 500.The default<br />number is 100. |

#### Returns

| Name        |  Type  | Description                                                                                                    |
| ----------- | :----: | -------------------------------------------------------------------------------------------------------------- |
| apps        | Array  | A list of objects containing the App ID and name.<br />Objects are listed in ascending order of their App IDs. |
| apps[].id   | String | The App ID.                                                                                                    |
| apps[].name | String | The name of the App.                                                                                           |

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/plugins/get-plugin-apps/

### updatePlugin

Updates an imported plug-in in the Kintone environment.

#### Parameters

| Name    |  Type  | Required | Description                                                                                                                                                                                       |
| ------- | :----: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id      | String |   Yes    | The ID of the plug-in to be updated.                                                                                                                                                              |
| fileKey | String |   Yes    | The fileKey representing an uploaded file.<br />Use the following API to upload the file and retrieve the fileKey: [Upload File](https://kintone.dev/en/docs/kintone/rest-api/files/upload-file/) |

#### Returns

| Name    |  Type  | Description                            |
| ------- | :----: | -------------------------------------- |
| id      | String | The plug-in ID of the updated plug-in. |
| version | String | The version number of the plug-in      |

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/plugins/update-plugin/

### installPlugin

Install an imported plug-in in the Kintone environment.

#### Parameters

| Name    |  Type  | Required | Description                                                                                                                                                                                       |
| ------- | :----: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fileKey | String |   Yes    | The fileKey representing an uploaded file.<br />Use the following API to upload the file and retrieve the fileKey: [Upload File](https://kintone.dev/en/docs/kintone/rest-api/files/upload-file/) |

#### Returns

| Name    |  Type  | Description                        |
| ------- | :----: | ---------------------------------- |
| id      | String | The installed plug-in ID.          |
| version | String | The version number of the plug-in. |

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/plugins/install-plugin/

### uninstallPlugin

Uninstalls a plug-in from the Kintone environment.

#### Parameters

| Name |  Type  | Required | Description            |
| ---- | :----: | :------: | ---------------------- |
| id   | String |   Yes    | The ID of the plug-in. |

#### Returns

An empty object.

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/plugins/uninstall-plugin/
