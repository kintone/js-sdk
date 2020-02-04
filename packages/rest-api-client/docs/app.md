# App

- [getAppCustomize](#getAppCustomize)
- [updateAppCustomize](#updateAppCustomize)
- [getAppSettings](#getAppSettings)
- [updateAppSettings](#updateAppSettings)
- [getProcessManagement](#getProcessManagement)
- [updateProcessManagement](#updateProcessManagement)

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

### updateAppSettings

Updates the description, name, icon, revision and color theme of an App.

#### Parameters

| Name              |       Type       |          Required           | Description                                                                                                                                                                                                                                                                                                            |
| ----------------- | :--------------: | :-------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app               | Number or String |             Yes             | The App ID.                                                                                                                                                                                                                                                                                                            |
| name              |      String      |                             | The App name.                                                                                                                                                                                                                                                                                                          |
| description       |      String      |                             | The App description. The maximum character limit is 10,000. HTML tags can be used.                                                                                                                                                                                                                                     |
| icon              |      Object      |                             | An object containing information of the App icon.                                                                                                                                                                                                                                                                      |
| icon.type         |      String      | Conditionally<br />Required | The icon type. Specify one of the following:<br />- `FILE`: An uploaded image.<br />- `PRESET`: A preset icon within kintone.<br />Required, if the "icon" parameter will be set.                                                                                                                                      |
| icon.key          |      String      | Conditionally<br />Required | The key identifier of the icon.<br />Required, if the `icon.type` parameter is set as `PRESET`.<br />(Preset icons have key identifiers that can be obtained using the [getAppSettings()](#getAppSettings))                                                                                                            |
| icon.file         |      Object      | Conditionally<br />Required | An object containing data of uploaded icon files.<br />Required, if the `icon.type` parameter is set as `FILE`.                                                                                                                                                                                                        |
| icon.file.fileKey |      String      | Conditionally<br />Required | The fileKey of the icon.<br />To attach a file, specify the fileKey responded when using [File#uploadFile()](https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/docs/file.md#uploadFile).<br />The maximum file size limit is 800KB.<br />Required, if the `icon.type` parameter is set as `FILE`. |
| theme             |      String      |                             | The color theme.<br />The following can be specified: `WHITE`, `RED`, `BLUE`, `GREEN`, `YELLOW`, `BLACK`<br /><br />If you specify values correspond to classic themes(`CLIPBOARD`, `BINDER`, `PENCIL`, `CLIPS`), the app is displayed as `WHITE` theme.                                                               |
| revision          |      String      |                             | Specify the revision number of the settings that will be deployed. The request will fail if the revision number is not the latest revision. The revision will not be checked if this parameter is ignored, or -1 is specified.                                                                                         |

#### Returns

| Name     |  Type  | Description                              |
| -------- | :----: | ---------------------------------------- |
| revision | String | The revision number of the App settings. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/115004868628

### getProcessManagement

Gets the process management settings of an App.

#### Parameters

| Name    |       Type       | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------- | :--------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app     | Number or String |   Yes    | The App ID.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| lang    |      String      |          | The localized language to retrieve the data in:<ul><li>`default`: retrieves the default names</li><li>`en`: retrieves the localized English names</li><li>`zh`: retrieves the localized Chinese names</li><li>`ja`: retrieves the localized Japanese names</li><li>`user`: retrieves the localized names, in the same language as the language setting set on the user used for the authentication.</li></ul>If ignored, the default names will be retrieved. |
| preview |     Boolean      |          | A flag whether to get the process management settings for pre-live environment                                                                                                                                                                                                                                                                                                                                                                                |

#### Returns

| Name                                                |  Type   | Description                                                                                                                                                                                                                                                                                             |
| --------------------------------------------------- | :-----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enable                                              | Boolean | It indicates whether the process management settings is enabled.                                                                                                                                                                                                                                        |
| states                                              | Object  | An object containing data of the process management statuses.<br />`null` is returned for Apps that have never enabled the process management settings before.                                                                                                                                          |
| states.{statusName}.name                            | String  | The status name.                                                                                                                                                                                                                                                                                        |
| states.{statusName}.index                           | String  | The display order (ascending) of the status, when listed with the other statuses.                                                                                                                                                                                                                       |
| states.{statusName}.assignee                        | Object  | An object containing data of the assignee settings.                                                                                                                                                                                                                                                     |
| states.{statusName}.assignee.type                   | String  | The assignee List type of the status.<br /><ul><li>`ONE`: User chooses one assignee from the list to take action</li><li>`ALL`: All assignees in the list must take action</li><li>`ANY`: One assignee in the list must take action</li></ul>The status with the lowest index will always return `ONE`. |
| states.{statusName}.assignee.entities               |  Array  | An array listing data of the assignees. They are listed in the same order as in the GUI.                                                                                                                                                                                                                |
| states.{statusName}.assignee.entities[].entity      | Object  | An object containing user data of the assignees.<br />Inactive users, deleted users/departments/groups and deleted Custom Fields will not be included in the response.                                                                                                                                  |
| states.{statusName}.assignee.entities[].entity.type | String  | The entity type of the assignee.<br /><ul><li>`USER`: User</li><li>`GROUP`: Group</li><li>`ORGANIZATION`: Department</li><li>`FIELD_ENTITY`: User/Group/Department selection field</li><li>`CREATOR`: Created by field</li><li>`CUSTOM_FIELD`: Custom Field</li></ul>                                   |
| states.{statusName}.assignee.entities[].entity.code | String  | The code of the assignee.<br />The following entities will return the following values:<ul><li>`FIELD_ENTITY`: The field code of the field</li><li>`CREATOR`: `null`</li><li>`CUSTOM_FIELD`: The field code of the Custom Field</li></ul>                                                               |
| states.{statusName}.assignee.entities[].includeSubs | Boolean | It indicates whether affiliated departments are included as assignees                                                                                                                                                                                                                                   |
| actions                                             |  Array  | An array containing data of the actions. They are listed in the same order as in the GUI.<br />`null` is returned for Apps that have never enabled the process management settings before.                                                                                                              |
| actions[].name                                      | String  | The action name.                                                                                                                                                                                                                                                                                        |
| actions[].from                                      | String  | The status before taking action.                                                                                                                                                                                                                                                                        |
| actions[].to                                        | String  | The status after taking action.                                                                                                                                                                                                                                                                         |
| actions[].filterCond                                | String  | The branch criteria of the action.                                                                                                                                                                                                                                                                      |
| revision                                            | String  | The revision number of the App settings.                                                                                                                                                                                                                                                                |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/115005238087

### updateProcessManagement

Updates the process management settings of an App.

#### Parameters

| Name                                                |       Type       |          Required           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------------------------------------- | :--------------: | :-------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app                                                 | Number or String |             Yes             | The App ID.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| enable                                              |     Boolean      |                             | It indicates whether the process management settings is enabled.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| states                                              |      Object      |                             | An object containing data of the process management statuses.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| states.{statusName}                                 |      Object      |                             | An object containing the settings of each status.<br />Specify the status before taking action, for `{statusName}`.<br />If a status that does not exist is specified for `{statusName}`, it will be added as a new status. If an existing status is not specified for `{statusName}`, that status will be deleted.                                                                                                                                                                                                             |
| states.{statusName}.name                            |      String      | Conditionally<br />Required | The status name.<br />The maximum length is 64 characters.<br />Required, if stating a new status for `states.{statusName}`. In this case, state the same value used for `states.{statusName}`.                                                                                                                                                                                                                                                                                                                                 |
| states.{statusName}.index                           | Number or String |             Yes             | The display order (ascending from 0) of the status, when listed with the other statuses.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| states.{statusName}.assignee                        |      Object      |                             | An object containing data of the assignee settings.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| states.{statusName}.assignee.type                   |      String      | Conditionally<br />Required | The assignee list type of the status.<br /></li><li>`ONE`: User chooses one assignee from the list to take action</li><li>`ALL`: All assignees in the list must take action</li><li>`ANY`: One assignee in the list must take action<br /><br />Required, if setting the `{statusName}.assignee` parameter.                                                                                                                                                                                                                     |
| states.{statusName}.assignee.entities               |      Array       | Conditionally<br />Required | An array listing data of the assignees.<br />Required, if setting the `{statusName}.assignee` parameter.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| states.{statusName}.assignee.entities[].entity      |      Object      | Conditionally<br />Required | An object containing user data of the assignees.<br />Required, if setting the `entities` parameter.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| states.{statusName}.assignee.entities[].entity.type |      String      | Conditionally<br />Required | The entity type of the assignee.<br /></li><li>`USER`: User</li><li>`GROUP`: Group</li><li>`ORGANIZATION`: Department</li><li>`FIELD_ENTITY`: User/Group/Department selection field</li><li>`CREATOR`: Created by field</li><li>`CUSTOM_FIELD`: Custom Field<br /><br />Required, for each entity stated.<br />Departments cannot be specified in guest space Apps.                                                                                                                                                             |
| states.{statusName}.assignee.entities[].entity.code |      String      | Conditionally<br />Required | The code of the assignee.<br />To specify guest space users, add the string "guest/" before the guest's log in name.<br />If `FIELD_ENTITY` is specified for the `entity.type`, state the field code of the following fields:</li><li>Created by</li><li>Updated by</li><li>User selection</li><li>Department selection</li><li>Group selection<br /><br />If `CUSTOM_FIELD` is specified for `entity.type`, state the field code of the Custom Field.<br />If `CREATOR` is specified for `entity.type`, ignore this parameter. |
| states.{statusName}.assignee.entities[].includeSubs |     Boolean      |                             | It indicates whether affiliated departments are included as assignees.<br />If ignored, this value is false.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| actions                                             |      Array       |                             | An array containing data of the Actions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| actions[].name                                      |      String      | Conditionally<br />Required | The action name.<br />The maximum length is 64 characters.<br />Required, if setting the `actions` parameter.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| actions[].from                                      |      String      | Conditionally<br />Required | The status name before taking action.<br />If a status name that you want to specify has been changed, place the changed value for this parameter.<br />Required, if setting the `actions` parameter.                                                                                                                                                                                                                                                                                                                           |
| actions[].to                                        |      String      | Conditionally<br />Required | The status name after taking action.<br />If a status name that you want to specify has been changed, place the changed value for this parameter.<br />Required, if setting the `actions` parameter.                                                                                                                                                                                                                                                                                                                            |
| actions[].filterCond                                |      String      |                             | The branch criteria of the action.<br />[Check here](https://developer.kintone.io/hc/en-us/articles/360019245194#optfunc) for more data on query formats.<br />The status field cannot be included in the query.                                                                                                                                                                                                                                                                                                                |
| revision                                            | Number or String |                             | Specify the revision number of the settings that will be deployed.<br />The request will fail if the revision number is not the latest revision.<br />The revision will not be checked if this parameter is ignored, or `-1` is specified.                                                                                                                                                                                                                                                                                      |

#### Returns

| Name     |  Type  | Description                              |
| -------- | :----: | ---------------------------------------- |
| revision | String | The revision number of the App settings. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/115005066028
