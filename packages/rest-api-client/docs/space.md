# Space

- [getSpace](#getSpace)
- [deleteSpace](#deleteSpace)
- [updateSpaceBody](#updateSpaceBody)
  <<<<<<< HEAD
- # [getSpaceMembers](#getSpaceMembers)
- [updateSpaceMembers](#updateSpaceMembers)
  > > > > > > > origin/master

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
