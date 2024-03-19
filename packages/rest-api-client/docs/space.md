# Space

- [getSpace](#getSpace)
- [deleteSpace](#deleteSpace)
- [updateSpaceBody](#updateSpaceBody)
- [getSpaceMembers](#getSpaceMembers)
- [updateSpaceMembers](#updateSpaceMembers)
- [updateThread](#updateThread)
- [addThreadComment](#addThreadComment)
- [addGuests](#addGuests)

## Overview

```ts
const client = new KintoneRestAPIClient();

(async () => {
  try {
    console.log(await client.space.getSpace({ id: "1" }));
  } catch (error) {
    console.log(error);
  }
})();
```

- All methods are defined on the `space` property.
- All methods return a Promise object that is resolved with an object having properties in each `Returns` section.
- If the Space or Guest Space feature is turned off, an error will be returned.

## Methods

### getSpace

Gets general information of a space.

#### Parameters

| Name |       Type       | Required | Description   |
| ---- | :--------------: | :------: | ------------- |
| id   | Number or String |   Yes    | The space ID. |

#### Returns

| Name                         |  Type   | Description                                                                                                                                                                                                                                                                                                               |
| ---------------------------- | :-----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                           | String  | The space ID.                                                                                                                                                                                                                                                                                                             |
| name                         | String  | The name of the space.                                                                                                                                                                                                                                                                                                    |
| defaultThread                | String  | The Thread ID of the default thread that was created when the Space was made.                                                                                                                                                                                                                                             |
| isPrivate                    | Boolean | The "Private" settings of the Space.<br /><strong>true</strong>: The Space is private.<br /><strong>false</strong>: The Space is not private.                                                                                                                                                                             |
| creator                      | Object  | The information of the user who created the space.                                                                                                                                                                                                                                                                        |
| creator.code                 | String  | The login name of the creator.<br />An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                                     |
| creator.name                 | String  | The display name of the creator.<br />An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                                   |
| modifier                     | Object  | The information of the user who last modified the space.                                                                                                                                                                                                                                                                  |
| modifier.code                | String  | The login name of the modifier.<br />An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                                    |
| modifier.name                | String  | The display name of the modifier.<br />An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                                  |
| memberCount                  | String  | The number of members of the Space.                                                                                                                                                                                                                                                                                       |
| coverType                    | String  | The image type of the Cover Photo.<br /><strong>BLOB</strong>: An uploaded image.<br /><strong>PRESET</strong>: A preset image.                                                                                                                                                                                           |
| coverKey                     | String  | The key of the Cover Photo.                                                                                                                                                                                                                                                                                               |
| coverUrl                     | String  | The URL of the Cover Photo.                                                                                                                                                                                                                                                                                               |
| body                         | String  | The HTML of the Space body.                                                                                                                                                                                                                                                                                               |
| useMultiThread               | Boolean | The "Enable multiple threads." setting.<br /><strong>true</strong>: The Space is a Multi-threaded Space.<br /><strong>false</strong>: The Space is a Single-threaded Space.                                                                                                                                               |
| isGuest                      | Boolean | The Guest Space setting.<br /><strong>true</strong>: The Space is a Guest Space.<br /><strong>false</strong>: The Space is not a Guest Space.                                                                                                                                                                             |
| attachedApps                 | Object  | A list of Apps that are in the thread.<br />This does not include Apps that are not live yet.                                                                                                                                                                                                                             |
| attachedApps[].threadId      | String  | The Thread ID of the thread that the App was created in.<br />Apps that are created inside Spaces using the GUI will be automatically allocated to the default Thread.                                                                                                                                                    |
| attachedApps[].appId         | String  | The App ID.                                                                                                                                                                                                                                                                                                               |
| attachedApps[].code          | String  | The App Code of the App.<br />An empty string is returned if an App Code is not set in the App's settings.                                                                                                                                                                                                                |
| attachedApps[].name          | String  | The name of the App.<br />If the App has localization settings, the localized name will be returned.                                                                                                                                                                                                                      |
| attachedApps[].description   | String  | The description of the App.<br />If the App has localization settings, the localized description will be returned.                                                                                                                                                                                                        |
| attachedApps[].createdAt     | String  | The date of when the App was created.                                                                                                                                                                                                                                                                                     |
| attachedApps[].creator       | Object  | The information of the user who created the App.                                                                                                                                                                                                                                                                          |
| attachedApps[].creator.code  | String  | The log in name of the creator.<br />An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                                    |
| attachedApps[].creator.name  | String  | The display name of the creator.<br />An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                                   |
| attachedApps[].modifiedAt    | String  | The date of when the app was last modified.                                                                                                                                                                                                                                                                               |
| attachedApps[].modifier      | Object  | The information of the user who last updated the app.                                                                                                                                                                                                                                                                     |
| attachedApps[].modifier.code | String  | The login name of the last updater. An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                                     |
| attachedApps[].modifier.name | String  | The display name of the last updater. An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                                   |
| fixedMember                  | Boolean | The "Block users from joining or leaving the space and following or unfollowing the threads." setting.<br /><strong>true</strong>: Users cannot join/leave the Space or follow/unfollow threads.<br /><strong>false</strong>: Users can join/leave the Space and follow/unfollow threads.                                 |
| showAnnouncement             | Boolean | The display status for the Announcement widget.<br /><strong>true</strong>: The Announcement widget is displayed.<br /><strong>false</strong>: The Announcement widget is not displayed.<br /><strong>null</strong> is returned for Spaces with the Enable multiple threads option turned off.                            |
| showThreadList               | Boolean | The display status for the Threads widget.<br /><strong>true</strong>: The Threads widget is displayed.<br /><strong>false</strong>: The Threads widget is not displayed.<br /><strong>null</strong> is returned for Spaces with the Enable multiple threads option turned off.                                           |
| showAppList                  | Boolean | The display status for the Apps widget.<br /><strong>true</strong>: The Apps widget is displayed.<br /><strong>false</strong>: The Apps widget is not displayed.<br /><strong>null</strong> is returned for Spaces with the Enable multiple threads option turned off.                                                    |
| showMemberList               | Boolean | The display status for the People widget.<br /><strong>true</strong>: The People widget is displayed.<br /><strong>false</strong>: The People widget is not displayed.<br /><strong>null</strong> is returned for Spaces with the Enable multiple threads option turned off.                                              |
| showRelatedLinkList          | Boolean | The display status for the Related Apps & Spaces widget.<br /><strong>true</strong>: The Related Apps & Spaces widget is displayed.<br /><strong>false</strong>: The Related Apps & Spaces widget is not displayed.<br /><strong>null</strong> is returned for Spaces with the Enable multiple threads option turned off. |

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/spaces/get-space/

### deleteSpace

Deletes a space.

#### Parameters

| Name |       Type       | Required | Description   |
| ---- | :--------------: | :------: | ------------- |
| id   | Number or String |   Yes    | The space ID. |

#### Returns

An empty object.

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/spaces/delete-space/

### updateSpaceBody

Updates the body of a Space.

#### Parameters

| Name |       Type       | Required | Description                                                                                                                                                                                                                                    |
| ---- | :--------------: | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id   | Number or String |   Yes    | The space ID.                                                                                                                                                                                                                                  |
| body |      String      |   Yes    | The contents of the body as an HTML string.<br />HTML tags that cannot be used will be automatically removed.<br />HTML can be used to attach Apps, files and Emoji.<br />The usage of the @ mark to mention a user will not notify that user. |

#### Returns

An empty object.

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/spaces/update-space-body/

### getSpaceMembers

Gets the list of Space Members of a Space.

#### Parameters

| Name |       Type       | Required | Description   |
| ---- | :--------------: | :------: | ------------- |
| id   | Number or String |   Yes    | The space ID. |

#### Returns

| Name                  |  Type   | Description                                                                                                                                                                                                                                                                                                                                        |
| --------------------- | :-----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| members               |  Array  | A list of Space members.<br />Guest users, inactive users and deleted users will not be included.                                                                                                                                                                                                                                                  |
| members[].entity      | Object  | The entity information of the Space member.                                                                                                                                                                                                                                                                                                        |
| members[].entity.type | String  | The entity type of the Space member.<br /><br /><strong>USER</strong>: User<br /><strong>GROUP</strong>: Group<br /><strong>ORGANIZATION</strong>: Department                                                                                                                                                                                      |
| members[].entity.code | String  | The code of the Space member.                                                                                                                                                                                                                                                                                                                      |
| members[].isAdmin     | Boolean | The Space Admin settings of the Space member.<br /><br /><strong>true</strong>: The Space Member is the Space Administrator.<br /><strong>false</strong>: The Space Member is not the Space Administrator.                                                                                                                                         |
| members[].isImplicit  | Boolean | If the Space Member is added as a User or not.<br /><br /><strong>true</strong>: The Space Member is not added as a user, and is added as part of a Group or Department.<br /><strong>false</strong>: The Space Member is added as a User.<br /><br />This is not responded for <strong>GROUP</strong> and <strong>ORGANIZATION</strong> entities. |
| members[].includeSubs | Boolean | The "Include Affiliated Departments" setting of the Department Space Member.<br /><br /><strong>true</strong>: Affiliated Departments are included.<br /><strong>false</strong>: Affiliated Departments are not included.                                                                                                                          |

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/spaces/get-space-members/

### updateSpaceMembers

Updates the members of a Space.

#### Parameters

| Name                  |       Type       |  Required   | Description                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | :--------------: | :---------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                    | Number or String |     Yes     | The space ID.                                                                                                                                                                                                                                                                                                                                        |
| members               |      Array       |     Yes     | A list of members of the Space. <br />At least one Space Administrator must be specified.<br /> Inactive and deleted users cannot be specified.                                                                                                                                                                                                      |
| members[].entity      |      Object      |     Yes     | The entity information of the Space member. <br />Guest users cannot be specified.                                                                                                                                                                                                                                                                   |
| members[].entity.type |      String      |     Yes     | The entity type of the Space member.<br /><ul><li><strong>USER</strong>: User</li><strong>Group</strong>: Group</li><strong>ORGANIZATION</strong>: Department</li><ul>                                                                                                                                                                               |
| members[].entity.code |      String      |     Yes     | The code of the entity.                                                                                                                                                                                                                                                                                                                              |
| members[].isAdmin     |     Boolean      | Conditional | The Space Administration settings of the user.<br /><ul><strong>true</strong>: The member will be the Administrator of the Space.<br /><li><strong>false</strong>: The member will not be the Administrator of the Space.<br />At least 1 Space Administrator is required to be set in the API call.</li></ul><br />If ignored, this value is false. |
| members[].includeSubs |     Boolean      |  Optional   | The "Include Affiliated Departments" settings of the department.<br /><ul><strong>true</strong>: Affiliated departments will be included.<br /><li><strong>false</strong>: Affiliated departments will not be included.</li></ul><br />If ignored, this value is false.                                                                              |

#### Returns

An empty object.

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/spaces/update-space-members/

### updateThread

Updates a Thread of a Space.

#### Parameters

| Name |       Type       | Required | Description                                                                                                                                                                                                                                                                                            |
| ---- | :--------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id   | Number or String |   Yes    | The Thread ID.<br />The Thread ID can be found in the URL of the Thread.<br />A Space with the URL of https://{domainname}.kintone.com/k/#/space/111/thread/222 has a Space ID of 111 and a Thread ID of 222.                                                                                          |
| name |      String      |          | The new name of the Thread.<br />Must be between 1 - 128 characters.<br />The name will not be updated if this parameter is ignored.<br />The Thread name of single threaded Spaces cannot be updated.                                                                                                 |
| body |      String      |          | The contents of the Thread body.<br />Write the contents as an HTML string, within 65535 characters<br />HTML tags that cannot be used will be automatically removed.<br />HTML can be used to attach Apps, files and Emoji.<br />The usage of the @ mark to mention a user will not notify that user. |

#### Returns

An empty object.

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/spaces/update-thread/

### addThreadComment

Adds a comment to a Thread of a Space.

#### Parameters

| Name                    |       Type       |          Required           | Description                                                                                                                                                                                                                                                                                                                                          |
| ----------------------- | :--------------: | :-------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                      | Number or String |             Yes             | The space ID.                                                                                                                                                                                                                                                                                                                                        |
| thread                  | Number or String |             Yes             | The thread ID.                                                                                                                                                                                                                                                                                                                                       |
| comment                 |      Object      |                             | An object including comment details.                                                                                                                                                                                                                                                                                                                 |
| comment.text            |      String      | Conditionally<br />Required | The comment contents.<br />A line break can be specified by LF.<br />The maximum characters of the comment is 65535. Required, if comment.files is not set.                                                                                                                                                                                          |
| comment.files           |      Array       | Conditionally<br />Required | An array including data of attachment files.<br />The maximum number of the files is 5.<br />Required, if comment.text is not set.                                                                                                                                                                                                                   |
| comment.files[].fileKey |      String      |                             | The fileKey of the attachment file.<br />Use the fileKey that is responded from the [Upload File API](https://kintone.dev/en/docs/kintone/rest-api/files/upload-file/).                                                                                                                                                                              |
| comment.files[].width   | Number or String |                             | A width can be specified if the attachment file is an image.<br />The minimum is 100, and the maximum is 750.<br />If this parameter is ignored, the original width will be set (this width is the same size as the size when "Original" is chosen when adding an image to a thread via GUI). This parameter is ignored if the file is not an image. |
| comment.mentions        |      Array       |                             | An array including mentions, that notify other Kintone users.                                                                                                                                                                                                                                                                                        |
| comment.mentions[].code |      String      |                             | The code of the user, group or department that will be mentioned.<br />The maximum number of mentions is 10.<br />The mentioned users will be placed in front of the comment text in the output.                                                                                                                                                     |
| comment.mentions[].type |      String      |                             | The entity type of the mentioned target.<br><ul><li><strong>USER</strong>: User<li><strong>GROUP</strong>: Group<li><strong>ORGANIZATION</strong>: Department                                                                                                                                                                                        |

#### Returns

| Name |  Type  | Description                            |
| ---- | :----: | -------------------------------------- |
| id   | String | The comment ID of the created comment. |

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/spaces/add-thread-comment/

### addGuests

Adds Guest users to Kintone.<br>
This does not affiliate Guest users with any Guest Spaces, and does not send any invitation emails.<br>
To affiliate a Guest user with a Guest Space, use the Update Guest Members API.<br>

#### Parameters

| Name                      |  Type  | Required | Description                                                                                                                                                                                                                                                       |
| ------------------------- | :----: | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| guests                    | Array  |   Yes    | A list of Guest user data.                                                                                                                                                                                                                                        |
| guests[].name             | String |   Yes    | The display name of the user.<br />Must be between 1 - 128 characters.                                                                                                                                                                                            |
| guests[].code             | String |   Yes    | The email address (log in name) of the Guest user.                                                                                                                                                                                                                |
| guests[].password         | String |   Yes    | The log in password of the Guest user.                                                                                                                                                                                                                            |
| guests[].timezone         | String |   Yes    | The timezone of the Guest user.                                                                                                                                                                                                                                   |
| guests[].locale           | String |          | The language settings of the Guest user.<br/>- <strong>auto</strong>: Use web browser settings.<br />- <strong>en</strong>: English<br />- <strong>zh</strong>: Chinese<br />- <strong>ja</strong>: Japanese<br />If ignored, <strong>auto</strong> will be set.  |
| guests[].image            | String |          | The profile image of the Guest user.<br />Specify a fileKey of an uploaded file. fileKeys can be found from the response of the [Upload File API](https://kintone.dev/en/docs/kintone/rest-api/files/upload-file/).<br />If ignored, a default image will be set. |
| guests[].surNameReading   | String |          | The Phonetic Surname settings of the Guest User. The maximum limit is 64 characters.                                                                                                                                                                              |
| guests[].givenNameReading | String |          | The Phonetic Given Name settings of the Guest User. The maximum limit is 64 characters.                                                                                                                                                                           |
| guests[].company          | String |          | The Company name to display on the Guest User's profile.<br />The maximum limit is 100 characters.                                                                                                                                                                |
| guests[].division         | String |          | The Department name to display on the Guest User's profile.<br />The maximum limit is 100 characters.                                                                                                                                                             |
| guests[].phone            | String |          | The Phone number to display on the Guest User's profile.<br />The maximum limit is 100 characters.                                                                                                                                                                |
| guests[].callto           | String |          | The Skype Name of the Guest user.<br />The maximum limit is 256 characters.                                                                                                                                                                                       |

#### Returns

An empty object.

#### Reference

- https://kintone.dev/en/docs/kintone/rest-api/spaces/add-guests/
