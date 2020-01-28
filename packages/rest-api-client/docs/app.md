# App

- [getAppCustomize](#getAppCustomize)
- [updateAppCustomize](#updateAppCustomize)
- [getAppSettings](#getAppSettings)

## Overview

```ts
const client = new KintoneRestAPIClient();

(async () => {
  // TODO
})();
```

- All methods are defined on the `app` property.
- This method returns a Promise object that is resolved with an object having properties in each `Returns` section.

## Methods

### getAppCustomize

Gets the JavaScript and CSS Customization settings of an App.

#### Parameters

| Name    |       Type       | Required | Description                                                               |
| ------- | :--------------: | :------: | ------------------------------------------------------------------------- |
| app     | Number or String |   Yes    | The app ID.                                                               |
| preview |     Boolean      |          | A flag whether to get the customization settings for pre-live environment |

#### Returns

| Name        |            Type            | Description                                                                                                                           |
| ----------- | :------------------------: | ------------------------------------------------------------------------------------------------------------------------------------- |
| desktop     |           Object           | An object containing data of JavaScript and CSS files for the desktop.                                                                |
| desktop.css | Array\<CustomizationFile\> | An array listing data of CSS files for desktop.                                                                                       |
| desktop.js  | Array\<CustomizationFile\> | An array listing data of JavaScript files for desktop.                                                                                |
| mobile      |           Object           | An object containing data of JavaScript and CSS files for the mobile.                                                                 |
| mobile.css  | Array\<CustomizationFile\> | An array listing data of CSS files for mobile.                                                                                        |
| mobile.js   | Array\<CustomizationFile\> | An array listing data of JavaScript files for mobile.                                                                                 |  |
| revision    |           String           | The revision number of the app settings.                                                                                              |
| scope       |           String           | The scope of customization<ul><li>ALL: Affect all users</li><li>ADMIN: Affect only app administrators</li><li>NONE: Disable</li></ul> |

A `CustomizationFile` object has the following properties:

| Name             |  Type  | Description                                                                                                                                                                                  |
| ---------------- | :----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| file             | Object | An Object containing data of an uploaded JavaScript or CSS file, which exists if `type` property is "FILE".                                                                                  |
| file.contentType | String | The MIME type of the uploaded JavaScript or CSS file.                                                                                                                                        |
| file.fileKey     | String | The fileKey of the uploaded JavaScript or CSS file.                                                                                                                                          |
| file.name        | String | The file name of the uploaded JavaScript or CSS file.                                                                                                                                        |
| file.size        | String | The byte size of the uploaded JavaScript or CSS file.                                                                                                                                        |
| type             | String | The end-point type of the JavaScript or CSS file:<ul><li>URL: the JavaScript or CSS file is specified with a URL.</li><li>FILE: the JavaScript or CSS file is uploaded to the app.</li></ul> |
| url              | String | The URL of the JavaScript or CSS file, which exists if `type` property is "URL".                                                                                                             |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/115004704967

### updateAppCustomize

Updates the JavaScript and CSS Customization settings of an App.

#### Parameters

| Name        |                Type                 | Required | Description                                                                                                                                                                                                                    |
| ----------- | :---------------------------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| app         |          Number or String           |   Yes    | The App ID.                                                                                                                                                                                                                    |
| desktop     |               Object                |          | An object containing data of JavaScript and CSS files for the desktop.                                                                                                                                                         |
| desktop.css | Array\<CustomizationFileForUpdate\> |          | An array listing data of CSS files for desktop.                                                                                                                                                                                |
| desktop.js  | Array\<CustomizationFileForUpdate\> |          | An array listing data of JavaScript files for desktop.                                                                                                                                                                         |
| mobile      |               Object                |          | An object containing data of JavaScript and CSS files for the mobile.                                                                                                                                                          |
| mobile.css  | Array\<CustomizationFileForUpdate\> |          | An array listing data of CSS files for mobile.                                                                                                                                                                                 |
| mobile.js   | Array\<CustomizationFileForUpdate\> |          | An array listing data of JavaScript files for mobile.                                                                                                                                                                          |
| revision    |          Number or String           |          | Specify the revision number of the settings that will be deployed. The request will fail if the revision number is not the latest revision. The revision will not be checked if this parameter is ignored, or -1 is specified. |
| scope       |               String                |          | The scope of customization<ul><li>ALL: Affect all users</li><li>ADMIN: Affect only App administrators</li><li>NONE: Disable</li></ul>                                                                                          |

A `CustomizationFileForUpdate` object has the following properties:

| Name         |  Type  |          Required           | Description                                                                                                                                                                                                                                                                                                          |
| ------------ | :----: | :-------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| file         | Object | Conditionally<br />Required | An Object containing data of JavaScript or CSS file uploads. Required, if `type` property is "FILE".                                                                                                                                                                                                                 |
| file.fileKey | String | Conditionally<br />Required | The fileKey of the JavaScript or CSS file. To attach a file, specify the fileKey that is responded when using the Upload File API. To keep the current JavaScript or CSS files that are attached to the App, specify the fileKeys that are responded when using the Get Customization API for the Pre-live settings. |
| type         | String | Conditionally<br />Required | The end-point type of the JavaScript or CSS file:<ul><li>URL: the JavaScript or CSS file is specified with a URL.</li><li>FILE: the JavaScript or CSS file is uploaded to the App.</li></ul>                                                                                                                         |
| url          | String | Conditionally<br />Required | The URL of the JavaScript or CSS file. Required, if `type` property is "URL".                                                                                                                                                                                                                                        |

#### Returns

| Name     |  Type  | Description                              |
| -------- | :----: | ---------------------------------------- |
| revision | String | The revision number of the App settings. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/115004873968

### getAppSettings

Gets the description, name, icon, revision and color theme of an App.

#### Parameters

| Name    |       Type       | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------- | :--------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app     | Number or String |   Yes    | The App ID.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| lang    |      String      |          | The localized language to retrieve the data in:<br />- `default`: retrieves the default names<br />- `en`: retrieves the localized English names<br />- `zh`: retrieves the localized Chinese names<br />- `ja`: retrieves the localized Japanese names<br />- `user`: retrieves the localized names, in the same language as the language setting\* set on the user used for the authentication.<br /><br />If ignored, the default names will be retrieved. |
| preview |     Boolean      |          | A flag whether to get the customization settings for pre-live environment                                                                                                                                                                                                                                                                                                                                                                                     |

\*If the user language setting is set to "Use Web browser settings", the settings set in the Accept-Language header will be used. If there is no Accept-Language header, the language set in the "Localization" settings in the System Administrator's menu will be used.

#### Returns

| Name                  |  Type  | Description                                                                                                                                                                                                              |
| --------------------- | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| name                  | String | The App name.                                                                                                                                                                                                            |
| description           | String | The App description in HTML format.                                                                                                                                                                                      |
| icon                  | Object | An object containing data of the App icon.                                                                                                                                                                               |
| icon.file             | Object | An object containing data of uploaded icon files.                                                                                                                                                                        |
| icon.file.contentType | String | The MIME type of the uploaded icon file.                                                                                                                                                                                 |
| icon.file.fileKey     | String | The fileKey of the uploaded icon file.                                                                                                                                                                                   |
| icon.file.name        | String | The file name of the uploaded icon file.                                                                                                                                                                                 |
| icon.file.size        | String | The byte size of the uploaded icon file.                                                                                                                                                                                 |
| icon.key              | String | The key identifier of the icon.<br />Responded, if the preset icons within kintone are used.                                                                                                                             |
| icon.type             | String | The icon type:<br />- `FILE`: An uploaded image.<br />- `PRESET`: A preset icon within kintone.                                                                                                                          |
| revision              | String | The revision number of the App settings.                                                                                                                                                                                 |
| theme                 | String | The color theme. Possible values are: `WHITE`, `RED`, `BLUE`, `GREEN`, `YELLOW`, `BLACK`.<br />Apps created before February 2017 may respond with the following classic themes:`CLIPBOARD`, `BINDER`, `PENCIL`, `CLIPS`. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/115004811668
