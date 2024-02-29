# Space

- [getSpace](#getSpace)
- [deleteSpace](#deleteSpace)

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

| Name                         |  Type   | Description                                                                                                                                                                                                                                                                                              |
| ---------------------------- | :-----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                           | String  | The space ID.                                                                                                                                                                                                                                                                                            |
| name                         | String  | The name of the space.                                                                                                                                                                                                                                                                                   |
| defaultThread                | String  | The Thread ID of the default thread that was created when the Space was made.                                                                                                                                                                                                                            |
| isPrivate                    | Boolean | The "Private" settings of the Space.<br /><strong>true</strong>: The Space is private.<br /><strong>false</strong>: The Space is not private.                                                                                                                                                            |
| creator                      | Object  | The information of the user who created the space.                                                                                                                                                                                                                                                       |
| creator.code                 | String  | The login name of the creator.<br />An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                    |
| creator.name                 | String  | The display name of the creator.<br />An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                  |
| modifier                     | Object  | The information of the user who last modified the space.                                                                                                                                                                                                                                                 |
| modifier.code                | String  | The login name of the modifier.<br />An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                   |
| modifier.name                | String  | The display name of the modifier.<br />An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                 |
| memberCount                  | String  | The number of members of the Space.                                                                                                                                                                                                                                                                      |
| coverType                    | String  | The image type of the Cover Photo.<br /><strong>BLOB</strong>: An uploaded image.<br /><strong>PRESET</strong>: A preset image.                                                                                                                                                                          |
| coverKey                     | String  | The key of the Cover Photo.                                                                                                                                                                                                                                                                              |
| coverUrl                     | String  | The URL of the Cover Photo.                                                                                                                                                                                                                                                                              |
| body                         | String  | The HTML of the Space body.                                                                                                                                                                                                                                                                              |
| useMultiThread               | Boolean | The "Enable multiple threads." setting.<br /><strong>true</strong>: The Space is a Multi-threaded Space.<br /><strong>false</strong>: The Space is a Single-threaded Space.                                                                                                                              |
| isGuest                      | Boolean | The Guest Space setting.<br /><strong>true</strong>: The Space is a Guest Space.<br /><strong>false</strong>: The Space is not a Guest Space.                                                                                                                                                            |
| attachedApps                 | Object  | A list of Apps that are in the thread.<br />This does not include Apps that are not live yet.                                                                                                                                                                                                            |
| attachedApps[].threadId      | String  | The Thread ID of the thread that the App was created in.<br />Apps that are created inside Spaces using the GUI will be automatically allocated to the default Thread.                                                                                                                                   |
| attachedApps[].appId         | String  | The App ID.                                                                                                                                                                                                                                                                                              |
| attachedApps[].code          | String  | The App Code of the App.<br />An empty string is returned if an App Code is not set in the App's settings.                                                                                                                                                                                               |
| attachedApps[].name          | String  | The name of the App.<br />If the App has localization settings, the localized name will be returned.                                                                                                                                                                                                     |
| attachedApps[].description   | String  | The description of the App.<br />If the App has localization settings, the localized description will be returned.                                                                                                                                                                                       |
| attachedApps[].createdAt     | String  | The date of when the App was created.                                                                                                                                                                                                                                                                    |
| attachedApps[].creator       | Object  | The information of the user who created the App.                                                                                                                                                                                                                                                         |
| attachedApps[].creator.code  | String  | The log in name of the creator.<br />An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                   |
| attachedApps[].creator.name  | String  | The display name of the creator.<br />An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                  |
| attachedApps[].modifiedAt    | String  | The date of when the app was last modified.                                                                                                                                                                                                                                                              |
| attachedApps[].modifier      | Object  | The information of the user who last updated the app.                                                                                                                                                                                                                                                    |
| attachedApps[].modifier.code | String  | The login name of the last updater. An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                    |
| attachedApps[].modifier.name | String  | The display name of the last updater. An empty string is returned for inactive users and deleted users.                                                                                                                                                                                                  |
| fixedMember                  | Boolean | The "Block users from joining or leaving the space and following or unfollowing the threads." setting.<br /><strong>true</strong>: Users cannot join/leave the Space or follow/unfollow threads.<br /><strong>false</strong>: Users can join/leave the Space and follow/unfollow threads.                |
| showAnnouncement             | Boolean | Display status of "Announcement" for portals of spaces with "Enable multiple threads. Note: This setting cannot be reverted." enabled<br /><strong>true</strong>: display<br /><strong>false</strong>: not displayed<br />For spaces/guest spaces that use only one thread, "null" is returned.          |
| showThreadList               | Boolean | Display status of "Threads" for portals of spaces with "Enable multiple threads. Note: This setting cannot be reverted." enabled<br /><strong>true</strong>: display<br /><strong>false</strong>: not displayed<br />For spaces/guest spaces that use only one thread, "null" is returned.               |
| showAppList                  | Boolean | Display status of "Apps" for portals of spaces with "Enable multiple threads. Note: This setting cannot be reverted." enabled<br /><strong>true</strong>: display<br /><strong>false</strong>: not displayed<br />For spaces/guest spaces that use only one thread, "null" is returned.                  |
| showMemberList               | Boolean | Display status of "People" for portals of spaces with "Enable multiple threads. Note: This setting cannot be reverted." enabled<br /><strong>true</strong>: display<br /><strong>false</strong>: not displayed<br />For spaces/guest spaces that use only one thread, "null" is returned.                |
| showRelatedLinkList          | Boolean | Display status of "Related Apps & Spaces" for portals of spaces with "Enable multiple threads. Note: This setting cannot be reverted." enabled<br /><strong>true</strong>: display<br /><strong>false</strong>: not displayed<br />For spaces/guest spaces that use only one thread, "null" is returned. |

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
