# App

## Overview

```ts
const client = new KintoneRestAPIClient();

(async () => {
  // TODO
})();
```

- This method returns a Promise object that is resolved with an object having properties in each `Returns` section.

## Methods

### getAppCustomize

Gets the JavaScript and CSS Customization settings of an App.

#### Parameters

| Name |       Type       | Required | Description |
| ---- | :--------------: | :------: | ----------- |
| app  | Number or String |   Yes    | The app ID. |

#### Returns

| Name                           |  Type  | Description                                                                                                                                                              |
| ------------------------------ | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| desktop                        | Object | An object containing data of JavaScript and CSS files for the desktop.                                                                                                   |
| desktop.css                    | Array  | An array listing data of CSS files for desktop.                                                                                                                          |
| desktop.css[].file             | Object | An Object containing data of an uploaded CSS file.                                                                                                                       |
| desktop.css[].file.contentType | String | The MIME type of the uploaded CSS file.                                                                                                                                  |
| desktop.css[].file.fileKey     | String | The fileKey of the uploaded CSS file.                                                                                                                                    |
| desktop.css[].file.name        | String | The file name of the uploaded CSS file.                                                                                                                                  |
| desktop.css[].file.size        | String | The byte size of the uploaded CSS file.                                                                                                                                  |
| desktop.css[].type             | String | The end-point type of the CSS file:<ul><li>URL: the CSS file is specified with a URL.</li><li>FILE: the CSS file is uploaded to the app.</li></ul>                       |
| desktop.css[].url              | String | The URL of the CSS file.                                                                                                                                                 |
| desktop.js                     | Array  | An array listing data of JavaScript files.                                                                                                                               |
| desktop.js[].file              | Object | An Object containing data of an uploaded JavaScript file.                                                                                                                |
| desktop.js[].file.contentType  | String | The MIME type of the uploaded JavaScript file.                                                                                                                           |
| desktop.js[].file.fileKey      | String | The fileKey of the uploaded JavaScript file.                                                                                                                             |
| desktop.js[].file.name         | String | The file name of the uploaded JavaScript file.                                                                                                                           |
| desktop.js[].file.size         | String | The byte size of the uploaded JavaScript file.                                                                                                                           |
| desktop.js[].type              | String | The end-point type of the JavaScript file:<ul><li>URL: the JavaScript file is specified with a URL.</li><li>FILE: the JavaScript file is uploaded to the app.</li></ul>  |
| desktop.js[].url               | String | The URL of the JavaScript file.                                                                                                                                          |
| mobile                         | Object | An object containing data of JavaScript and CSS files for the mobile.                                                                                                    |
| mobile.css                     | Array  | An array listing data of CSS files for mobile.                                                                                                                           |
| mobile.css[].file              | Object | An Object containing data of an uploaded CSS file.                                                                                                                       |
| mobile.css[].file.contentType  | String | The MIME type of the uploaded CSS file.                                                                                                                                  |
| mobile.css[].file.fileKey      | String | The fileKey of the uploaded CSS file.                                                                                                                                    |
| mobile.css[].file.name         | String | The file name of the uploaded CSS file.                                                                                                                                  |
| mobile.css[].file.size         | String | The byte size of the uploaded CSS file.                                                                                                                                  |
| mobile.css[].type              | String | The end-point type of the CSS file: <ul><li>URL: the CSS file is specified with a URL.</li><li>FILE: the CSS file is uploaded to the app.</li></ul>                      |
| mobile.css[].url               | String | The URL of the CSS file.                                                                                                                                                 |
| mobile.js                      | Array  | An array listing data of JavaScript files.                                                                                                                               |
| mobile.js[].file               | Object | An Object containing data of an uploaded JavaScript file.                                                                                                                |
| mobile.js[].file.contentType   | String | The MIME type of the uploaded JavaScript file.                                                                                                                           |
| mobile.js[].file.fileKey       | String | The fileKey of the uploaded JavaScript file.                                                                                                                             |
| mobile.js[].file.name          | String | The file name of the uploaded JavaScript file.                                                                                                                           |
| mobile.js[].file.size          | String | The byte size of the uploaded JavaScript file.                                                                                                                           |
| mobile.js[].type               | String | The end-point type of the JavaScript file: <ul><li>URL: the JavaScript file is specified with a URL.</li><li>FILE: the JavaScript file is uploaded to the app.</li></ul> |
| mobile.js[].url                | String | The URL of the JavaScript file.                                                                                                                                          |
| revision                       | String | The revision number of the app settings.                                                                                                                                 |
| scope                          | String | The scope of customization<ul><li>ALL: Affect all users</li><li>ADMIN: Affect only app administrators</li><li>NONE: Disable</li></ul>                                    |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/115004704967

### updateAppCustomize

Updates the JavaScript and CSS Customization settings of an App.

#### Parameters

| Name                       |       Type       | Required | Description                                                                                                                                                                                                                                                                                            |
| -------------------------- | :--------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| app                        | Number or String |   Yes    | The App ID.                                                                                                                                                                                                                                                                                            |
| desktop                    |      Object      |          | An object containing data of JavaScript and CSS files for the desktop.                                                                                                                                                                                                                                 |
| desktop.css                |      Array       |          | An array listing data of CSS files for desktop.                                                                                                                                                                                                                                                        |
| desktop.css[].file         |      Object      |          | An Object containing data of CSS file uploads. Specify, if "FILE" is selected for desktop.css[].type .                                                                                                                                                                                                 |
| desktop.css[].file.fileKey |      String      |          | The fileKey of the CSS file. To attach a file, specify the fileKey that is responded when using the Upload File API. To keep the current CSS files that are attached to the App, specify the fileKeys that are responded when using the Get Customization API for the Pre-live settings.               |
| desktop.css[].type         |      String      |          | The end-point type of the CSS file:<ul><li>URL: the CSS file is specified with a URL.</li><li>FILE: the CSS file is uploaded to the App.</li></ul>                                                                                                                                                     |
| desktop.css[].url          |      String      |          | The URL of the CSS file. Specify, if "URL" is selected for desktop.css[].type .                                                                                                                                                                                                                        |
| desktop.js                 |      Array       |          | An array listing data of JavaScript files.                                                                                                                                                                                                                                                             |
| desktop.js[].file          |      Object      |          | An Object containing data of an uploaded JavaScript file. Specify, if "FILE" is selected for desktop.js[].type .                                                                                                                                                                                       |
| desktop.js[].file.fileKey  |      String      |          | The fileKey of the JavaScript file. To attach a file, specify the fileKey that is responded when using the Upload File API. To keep the current JavaScript files that are attached to the App, specify the fileKeys that are responded when using the Get Customization API for the Pre-live settings. |
| desktop.js[].type          |      String      |          | The end-point type of the JavaScript file:<ul><li>URL: the JavaScript file is specified with a URL.</li><li>FILE: the JavaScript file is uploaded to the App.</li></ul>                                                                                                                                |
| desktop.js[].url           |      String      |          | The URL of the JavaScript file. Specify, if "URL" is selected for desktop.js[].type .                                                                                                                                                                                                                  |
| mobile                     |      Object      |          | An object containing data of JavaScript and CSS files for the mobile.                                                                                                                                                                                                                                  |
| mobile.css                 |      Array       |          | An array listing data of CSS files for mobile.                                                                                                                                                                                                                                                         |
| mobile.css[].file          |      Object      |          | An Object containing data of CSS file uploads. Specify, if "FILE" is selected for mobile.css[].type .                                                                                                                                                                                                  |
| mobile.css[].file.fileKey  |      String      |          | The fileKey of the CSS file. To attach a file, specify the fileKey that is responded when using the Upload File API. To keep the current CSS files that are attached to the App, specify the fileKeys that are responded when using the Get Customization API for the Pre-live settings.               |
| mobile.css[].type          |      String      |          | The end-point type of the CSS file:<ul><li>URL: the CSS file is specified with a URL.</li><li>FILE: the CSS file is uploaded to the App.</li></ul>                                                                                                                                                     |
| mobile.css[].url           |      String      |          | The URL of the CSS file. Specify, if "URL" is selected for mobile.css[].type .                                                                                                                                                                                                                         |
| mobile.js                  |      Array       |          | An array listing data of JavaScript files.                                                                                                                                                                                                                                                             |
| mobile.js[].file           |      Object      |          | An Object containing data of JavaScript file uploads. Specify, if "FILE" is selected for mobile.js[].type .                                                                                                                                                                                            |
| mobile.js[].file.fileKey   |      String      |          | The fileKey of the JavaScript file. To attach a file, specify the fileKey that is responded when using the Upload File API. To keep the current JavaScript files that are attached to the App, specify the fileKeys that are responded when using the Get Customization API for the Pre-live settings. |
| mobile.js[].type           |      String      |          | The end-point type of the JavaScript file:<ul><li>URL: the JavaScript file is specified with a URL.</li><li>FILE: the JavaScript file is uploaded to the App.</li></ul>                                                                                                                                |
| mobile.js[].url            |      String      |          | The URL of the JavaScript file. Specify, if "URL" is selected for mobile.js[].type .                                                                                                                                                                                                                   |
| revision                   | Number or String |          | Specify the revision number of the settings that will be deployed. The request will fail if the revision number is not the latest revision. The revision will not be checked if this parameter is ignored, or -1 is specified.                                                                         |
| scope                      |      String      |          | The scope of customization<ul><li>ALL: Affect all users</li><li>ADMIN: Affect only App administrators</li><li>NONE: Disable</li></ul>                                                                                                                                                                  |

#### Returns

| Name     |  Type  | Description                              |
| -------- | :----: | ---------------------------------------- |
| revision | String | The revision number of the App settings. |

#### Reference

- https://developer.kintone.io/hc/en-us/articles/115004873968
