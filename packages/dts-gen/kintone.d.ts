declare namespace kintone {
  namespace events {
    function on(event: string | string[], handler: (event: any) => any): void;
    function off(
      event: string | string[],
      handler: (event: any) => any,
    ): boolean;
    function off(event: string | string[]): boolean;
    function off(): boolean;
  }

  namespace api {
    function url(path: string, detectGuestSpace?: boolean): string;
    function urlForGet(
      path: string,
      params: any,
      detectGuestSpace?: boolean,
    ): string;

    function getConcurrencyLimit(): Promise<{
      limit: number;
      running: number;
    }>;
  }

  function api(pathOrUrl: string, method: string, params: any): Promise<any>;

  function api(
    pathOrUrl: string,
    method: string,
    params: any,
    callback: (resp: any) => void,
    errback: (err: any) => void,
  ): void;

  function getRequestToken(): string;

  function proxy(
    url: string,
    method: string,
    headers: any,
    data: any,
  ): Promise<any>;

  function proxy(
    url: string,
    method: string,
    headers: any,
    data: any,
    callback: (resp: any) => void,
    errback: (err: any) => void,
  ): void;

  class Promise<T> {
    constructor(
      callback: (
        resolve: (resolved: T) => any,
        reject: (rejected: any) => any,
      ) => void,
    );

    then(callback: (resolved: T) => any): Promise<any>;
    catch(callback: (rejected: any) => any): Promise<any>;

    static resolve(resolved: any): Promise<any>;
    static reject(rejected: any): Promise<any>;
    static all(listOfPromise: Array<Promise<any>>): Promise<any>;
  }

  namespace proxy {
    function upload(
      url: string,
      method: string,
      headers: any,
      data: any,
      callback: (resp: any) => void,
      errback: (err: any) => void,
    ): void;

    function upload(
      url: string,
      method: string,
      headers: any,
      data: any,
    ): Promise<any>;
  }

  function getUserPreference(): Promise<UserPreference>;
  function isUsersAndSystemAdministrator(): Promise<boolean>;
  function getAvailableServices(): Promise<AvailableServices>;
  function getDomain(): Promise<KintoneDomain>;
  function getAvailableApiTypes(): Promise<KintoneApiType[]>;
  function isAccessWithClientCertificateAuthentication(): Promise<boolean>;
  function isMobileApp(): Promise<boolean>;
  function isMobilePage(): Promise<boolean>;
  function isRevampedUI(): Promise<boolean>;
  function getPageType(): Promise<PageTypeResult>;
  function showConfirmDialog(
    config: ConfirmDialogConfig,
  ): Promise<ConfirmDialogResult>;
  function createDialog(config: CreateDialogConfig): Promise<Dialog>;
  function showNotification(
    type: NotificationType,
    message: string,
  ): Promise<void>;
  function showLoading(state: "VISIBLE" | "HIDDEN"): Promise<void>;
  function buildPageUrl(
    page: PageType,
    params: BuildPageUrlParams,
  ): Promise<string>;
  function setKeyboardShortcuts(
    config: boolean | Partial<Record<ShortcutName, boolean>>,
  ): Promise<void>;
  function getKeyboardShortcuts(): Promise<
    Partial<Record<ShortcutName, boolean>>
  >;

  namespace user {
    function getOrganizations(code?: string): Promise<OrganizationMembership[]>;
    function getGroups(code?: string): Promise<KintoneGroup[]>;
    function getCustomFields(code?: string): Promise<KintoneCustomField[]>;
    function getIcons(params: { users: string[] }): Promise<KintoneUserIcon[]>;
  }

  namespace app {
    function getFieldElements(fieldCode: string): HTMLElement[] | null;
    function getHeaderMenuSpaceElement(): HTMLElement | null;
    function getHeaderSpaceElement(): HTMLElement | null;
    function getId(): number | null;
    function getLookupTargetAppId(fieldCode: string): string | null;
    function getQuery(): string | null;
    function getQueryCondition(): string | null;
    function getRelatedRecordsTargetAppId(fieldCode: string): string | null;

    function get(): Promise<AppInfo>;
    function getFormFields(): Promise<any>;
    function getFormLayout(): Promise<any>;
    function isTestEnvironment(): Promise<boolean>;
    function isMaintenanceMode(): Promise<boolean>;
    function showDescription(state: "OPEN" | "CLOSED"): Promise<void>;
    function getDescriptionDisplayState(): Promise<
      "OPEN" | "CLOSED" | "HIDDEN"
    >;
    function getIcons(apps: number[]): Promise<AppIcon[]>;
    function getView(): Promise<RecordListView>;
    function getViews(): Promise<View[]>;
    function getReports(): Promise<Report[]>;
    function getStatus(): Promise<any>;
    function getCategories(): Promise<Categories>;
    function getPermissions(): Promise<AppPermissions>;
    function showAddRecordButton(state: DisplayState): Promise<void>;
    function getAddRecordButtonDisplayState(): Promise<DisplayState>;
    function showAppSettingsButton(state: DisplayState): Promise<void>;
    function getAppSettingsButtonDisplayState(): Promise<DisplayState>;
    function showOptionsButton(state: DisplayState): Promise<void>;
    function getOptionsButtonDisplayState(): Promise<DisplayState>;
    function showFilterButton(state: DisplayState): Promise<void>;
    function getFilterButtonDisplayState(): Promise<DisplayState>;
    function showReportButton(state: DisplayState): Promise<void>;
    function getReportButtonDisplayState(): Promise<DisplayState>;
    function showViewAndReportSelector(state: DisplayState): Promise<void>;
    function getViewAndReportSelectorDisplayState(): Promise<DisplayState>;
    function showViewSelectorItems(
      config: Record<string, DisplayState>,
    ): Promise<void>;
    function getViewSelectorItemsDisplayState(): Promise<
      Record<string, DisplayState>
    >;
    function showReportSelectorItems(
      config: Record<string, DisplayState>,
    ): Promise<void>;
    function getReportSelectorItemsDisplayState(): Promise<
      Record<string, DisplayState>
    >;
    function setRecordListStyle(
      config: RecordListStyleConfig | "DEFAULT",
    ): Promise<void>;
    function getRecordListStyle(): Promise<RecordListStyleResult>;

    namespace record {
      function getId(): number | null;
      function get(): any | null;
      function getHeaderMenuSpaceElement(): HTMLElement | null;
      function getFieldElement(fieldCode: string): HTMLElement | null;
      function set(record: any): void;
      function getSpaceElement(id: string): HTMLElement | null;
      function setFieldShown(fieldCode: string, isShown: boolean): void;
      function setGroupFieldOpen(fieldCode: string, isOpen: boolean): void;

      function isGroupFieldOpen(fieldCode: string): Promise<boolean>;
      function getPermissions(): Promise<RecordPermissions>;
      function getFieldPermissions(): Promise<
        Record<string, { readField: boolean; editField: boolean }>
      >;
      function getStatusHistory(
        offset?: number,
        limit?: number,
      ): Promise<StatusHistoryEntry[]>;
      function getStatusActions(): Promise<StatusAction[]>;
      function getAssignees(): Promise<Assignee[]>;
      function getActions(): Promise<Array<{ name: string; id: string }>>;
      function isFieldVisible(fieldCode: string): Promise<boolean>;
      function showEditRecordButton(state: DisplayState): Promise<void>;
      function getEditRecordButtonDisplayState(): Promise<DisplayState>;
      function showDuplicateRecordButton(state: DisplayState): Promise<void>;
      function getDuplicateRecordButtonDisplayState(): Promise<DisplayState>;
      function showPager(state: DisplayState): Promise<void>;
      function getPagerDisplayState(): Promise<DisplayState>;
      function showSideBar(state: SideBarDisplayState): Promise<void>;
      function getSideBarDisplayState(): Promise<SideBarDisplayState>;
      function showChangeAssigneeButton(state: DisplayState): Promise<void>;
      function getChangeAssigneeButtonDisplayState(): Promise<DisplayState>;
      function showActionButton(
        action: string,
        state: DisplayState,
      ): Promise<void>;
      function getActionButtonDisplayState(
        action: string,
      ): Promise<DisplayState>;
      function showStatusActionButton(
        action: string,
        state: DisplayState,
      ): Promise<void>;
      function getStatusActionButtonDisplayState(
        action: string,
      ): Promise<DisplayState>;
      function setFieldStyle(
        fieldCode: string,
        config: FieldStyleConfig | "DEFAULT",
      ): Promise<void>;
      function getFieldStyle(fieldCode: string): Promise<FieldStyleResult>;
    }
  }

  namespace mobile {
    function showNotification(
      type: NotificationType,
      message: string,
    ): Promise<void>;
    function showLoading(state: "VISIBLE" | "HIDDEN"): Promise<void>;
    function showConfirmBottomSheet(
      config: ConfirmBottomSheetConfig,
    ): Promise<ConfirmDialogResult>;
    function createBottomSheet(
      config: CreateBottomSheetConfig,
    ): Promise<BottomSheet>;

    namespace app {
      function getFieldElements(fieldCode: string): HTMLElement[] | null;
      function getHeaderSpaceElement(): HTMLElement | null;
      function getId(): number | null;
      function getLookupTargetAppId(fieldCode: string): string | null;
      function getQuery(): string | null;
      function getQueryCondition(): string | null;
      function getRelatedRecordsTargetAppId(fieldCode: string): string | null;

      function get(): Promise<AppInfo>;
      function getFormFields(): Promise<any>;
      function getFormLayout(): Promise<any>;
      function isTestEnvironment(): Promise<boolean>;
      function isMaintenanceMode(): Promise<boolean>;
      function getIcons(apps: number[]): Promise<AppIcon[]>;
      function getView(): Promise<RecordListView>;
      function getViews(): Promise<View[]>;
      function getReports(): Promise<Report[]>;
      function getStatus(): Promise<any>;
      function getCategories(): Promise<Categories>;
      function getPermissions(): Promise<AppPermissions>;
      function showAddRecordButton(state: DisplayState): Promise<void>;
      function getAddRecordButtonDisplayState(): Promise<DisplayState>;
      function showOptionsButton(state: DisplayState): Promise<void>;
      function getOptionsButtonDisplayState(): Promise<DisplayState>;
      function showFilterButton(state: DisplayState): Promise<void>;
      function getFilterButtonDisplayState(): Promise<DisplayState>;
      function showViewSelector(state: DisplayState): Promise<void>;
      function getViewSelectorDisplayState(): Promise<DisplayState>;
      function showViewSelectorItems(
        config: Record<string, DisplayState>,
      ): Promise<void>;
      function getViewSelectorItemsDisplayState(): Promise<
        Record<string, DisplayState>
      >;
      function showReportSelector(state: DisplayState): Promise<void>;
      function getReportSelectorDisplayState(): Promise<DisplayState>;
      function showReportSelectorItems(
        config: Record<string, DisplayState>,
      ): Promise<void>;
      function getReportSelectorItemsDisplayState(): Promise<
        Record<string, DisplayState>
      >;
      function setRecordListStyle(
        config: RecordListStyleConfig | "DEFAULT",
      ): Promise<void>;
      function getRecordListStyle(): Promise<RecordListStyleResult>;

      namespace record {
        function getId(): number | null;
        function get(): any | null;
        function getFieldElement(fieldCode: string): HTMLElement | null;
        function set(record: any): void;
        function getSpaceElement(id: string): HTMLElement | null;
        function setFieldShown(fieldCode: string, isShown: boolean): void;
        function setGroupFieldOpen(fieldCode: string, isOpen: boolean): void;

        function isGroupFieldOpen(fieldCode: string): Promise<boolean>;
        function getPermissions(): Promise<RecordPermissions>;
        function getFieldPermissions(): Promise<
          Record<string, { readField: boolean; editField: boolean }>
        >;
        function getStatusHistory(
          offset?: number,
          limit?: number,
        ): Promise<StatusHistoryEntry[]>;
        function getStatusActions(): Promise<StatusAction[]>;
        function getAssignees(): Promise<Assignee[]>;
        function isFieldVisible(fieldCode: string): Promise<boolean>;
        function showEditRecordButton(state: DisplayState): Promise<void>;
        function getEditRecordButtonDisplayState(): Promise<DisplayState>;
        function showPager(state: DisplayState): Promise<void>;
        function getPagerDisplayState(): Promise<DisplayState>;
        function showActionButton(
          action: string,
          state: DisplayState,
        ): Promise<void>;
        function getActionButtonDisplayState(
          action: string,
        ): Promise<DisplayState>;
        function showStatusActionButton(
          action: string,
          state: DisplayState,
        ): Promise<void>;
        function getStatusActionButtonDisplayState(
          action: string,
        ): Promise<DisplayState>;
        function setFieldStyle(
          fieldCode: string,
          config: FieldStyleConfig | "DEFAULT",
        ): Promise<void>;
        function getFieldStyle(fieldCode: string): Promise<FieldStyleResult>;
      }
    }

    namespace portal {
      function getContentSpaceElement(): HTMLElement | null;
    }

    namespace space {
      namespace portal {
        function getContentSpaceElement(): HTMLElement | null;
      }
    }
  }

  namespace plugin {
    namespace app {
      function getConfig(pluginId: string): any;
      function setConfig(config: any, callback?: () => void): void;

      function proxy(
        pluginId: string,
        url: string,
        method: string,
        headers: any,
        data: any,
      ): Promise<any>;

      function proxy(
        pluginId: string,
        url: string,
        method: string,
        headers: any,
        data: any,
        callback: (resp: any) => void,
        error: (err: any) => void,
      ): void;

      function setProxyConfig(
        url: string,
        method: string,
        headers: any,
        data: any,
        callback?: () => void,
      ): void;

      function getProxyConfig(url: string, method: string): any;

      namespace proxy {
        function upload(
          pluginId: any,
          url: string,
          method: string,
          headers: any,
          data: any,
        ): Promise<any>;

        function upload(
          pluginId: any,
          url: string,
          method: string,
          headers: any,
          data: any,
          callback: (resp: any) => void,
          error: (err: any) => void,
        ): void;
      }
    }
  }

  namespace portal {
    function getContentSpaceElement(): HTMLElement | null;
  }

  namespace space {
    function get(): Promise<SpaceInfo>;
    function getPermissions(): Promise<SpacePermissions>;

    namespace portal {
      function getContentSpaceElement(): HTMLElement | null;
    }
  }

  namespace system {
    function getAvailableFeatures(): Promise<AvailableFeatures>;
    function getPermissions(): Promise<SystemPermissions>;
  }

  namespace license {
    function isTrial(): Promise<boolean>;
    function getSubscriptionPlan(): Promise<SubscriptionPlan>;
  }

  interface LoginUser {
    id: string;
    code: string;
    name: string;
    email: string;
    url: string;
    employeeNumber: string;
    phone: string;
    mobilePhone: string;
    extensionNumber: string;
    timezone: string;
    isGuest: boolean;
    language: string;
  }

  function getLoginUser(): LoginUser;
  function getUiVersion(): 1 | 2;

  const $PLUGIN_ID: string;

  // ---- Shared types ----

  type DisplayState = "VISIBLE" | "HIDDEN";
  type SideBarDisplayState = "CLOSED" | "COMMENTS" | "HISTORY" | "HIDDEN";
  type ConfirmDialogResult = "OK" | "CANCEL" | "CLOSE";
  type NotificationType = "ERROR" | "SUCCESS" | "INFO";
  type SubscriptionPlan = "STANDARD" | "WIDE";
  type KintoneApiType = "CORE" | "WIDE";
  type ShortcutName =
    | "SHOW_RECORD"
    | "FOCUS_SEARCH_BOX"
    | "SHORTCUTS_HELP"
    | "CREATE_RECORD"
    | "EDIT_RECORD"
    | "NEXT_RECORD"
    | "PREVIOUS_RECORD"
    | "NEXT_PAGE"
    | "PREVIOUS_PAGE"
    | "CANCEL_EDITING"
    | "SHOW_VIEW"
    | "SHOW_FILTER"
    | "SAVE_RECORD";
  type PageType =
    | "APP_INDEX"
    | "APP_CREATE"
    | "APP_DETAIL"
    | "APP_EDIT"
    | "APP_PRINT"
    | "APP_REPORT"
    | "APP_INDEX_MOBILE"
    | "APP_CREATE_MOBILE"
    | "APP_DETAIL_MOBILE"
    | "APP_EDIT_MOBILE"
    | "APP_REPORT_MOBILE"
    | "PORTAL_TOP"
    | "PORTAL_TOP_MOBILE"
    | "SPACE_PORTAL"
    | "SPACE_THREAD"
    | "SPACE_PORTAL_MOBILE"
    | "SPACE_THREAD_MOBILE"
    | "PEOPLE_TOP"
    | "PEOPLE_TOP_MOBILE"
    | "MESSAGE_TOP"
    | "MESSAGE_TOP_MOBILE"
    | "SEARCH_TOP"
    | "SEARCH_TOP_MOBILE"
    | "NOTIFICATION_TOP"
    | "APP_MARKETPLACE_TOP"
    | "APP_MARKETPLACE_CATEGORY"
    | "APP_MARKETPLACE_SEARCH"
    | "APP_MARKETPLACE_DETAIL"
    | "APP_SETTINGS_PLUGIN_SETTINGS";

  // ---- Interfaces ----

  interface UserPreference {
    timeFormat: "TWELVE" | "TWENTY_FOUR";
    desktopNotifications: {
      enabled: boolean;
    };
    emailNotifications: {
      enabled: boolean;
      condition: "TO_ME" | "ALL";
      format: "HTML" | "TEXT";
    };
  }

  interface OrganizationMembership {
    organization: {
      id: string;
      code: string;
      name: string;
      primary: boolean;
    };
    title: {
      id: string;
      code: string;
      name: string;
    } | null;
  }

  interface KintoneGroup {
    id: string;
    code: string;
    name: string;
  }

  interface KintoneCustomField {
    code: string;
    name: string;
    type: "SINGLE_LINE_TEXT" | "USER_SELECT";
    value: string | { code: string; name: string };
    visibility: "PUBLIC" | "PRIVATE";
  }

  interface KintoneUserIcon {
    user: string;
    url: string;
  }

  interface AvailableServices {
    garoon: boolean;
    office: boolean;
    mailwise: boolean;
  }

  interface KintoneDomain {
    subdomain: string;
    baseDomain: "cybozu.com" | "cybozu.cn" | "kintone.com";
  }

  interface PageTypeResult {
    type:
      | "APP"
      | "PORTAL"
      | "SPACE"
      | "PEOPLE"
      | "MESSAGE"
      | "SEARCH"
      | "NOTIFICATION"
      | "APP_MARKETPLACE"
      | "APP_SETTINGS";
    page: PageType;
  }

  interface ConfirmDialogConfig {
    title?: string;
    body?: string;
    showOkButton?: boolean;
    okButtonText?: string;
    showCancelButton?: boolean;
    cancelButtonText?: string;
    showCloseButton?: boolean;
  }

  interface ConfirmBottomSheetConfig {
    title?: string;
    body?: string;
    showOkButton?: boolean;
    okButtonText?: string;
    showCancelButton?: boolean;
    cancelButtonText?: string;
    showCloseButton?: boolean;
  }

  type DialogCloseResult = "OK" | "CANCEL" | "CLOSE" | "FUNCTION";

  interface CreateDialogConfig {
    title?: string;
    body?: Element;
    showOkButton?: boolean;
    okButtonText?: string;
    showCancelButton?: boolean;
    cancelButtonText?: string;
    showCloseButton?: boolean;
    beforeClose?: (
      action: "OK" | "CANCEL" | "CLOSE",
    ) => boolean | void | Promise<boolean | void>;
  }

  interface Dialog {
    show(): Promise<DialogCloseResult>;
    close(): void;
  }

  interface CreateBottomSheetConfig {
    title?: string;
    body?: Element;
    showOkButton?: boolean;
    okButtonText?: string;
    showCancelButton?: boolean;
    cancelButtonText?: string;
    showCloseButton?: boolean;
    beforeClose?: (
      action: "OK" | "CANCEL" | "CLOSE",
    ) => boolean | void | Promise<boolean | void>;
  }

  interface BottomSheet {
    show(): Promise<DialogCloseResult>;
    close(): void;
  }

  interface BuildPageUrlParams {
    appId?: string;
    recordId?: string;
    viewId?: string;
    reportId?: string;
    spaceId?: string;
    threadId?: string;
    userCode?: string;
  }

  interface AppInfo {
    id: string;
    name: string;
    description: string;
    code: string | null;
    numberPrecision: {
      digits: number;
      decimalPlaces: number;
      roundingMode: "HALF_EVEN" | "UP" | "DOWN";
    };
    enableComments: boolean;
    enableThumbnails: boolean;
    enableChangeHistory: boolean;
    enableInlineRecordEditing: boolean;
    createdAt: string;
    creator: { code: string; name: string };
    modifiedAt: string;
    modifier: { code: string; name: string };
    spaceId: string | null;
    revision: string;
  }

  interface AppIcon {
    app: number;
    url: string;
  }

  interface RecordListView {
    type: "LIST" | "CALENDAR" | "CUSTOM";
    builtinType?: "ASSIGNEE" | "ALL";
    name: string;
    id: string;
    fields?: string[];
    date?: string;
    title?: string;
    html?: string;
    pager?: boolean;
    device?: "DESKTOP" | "ANY";
    filterCond: string;
    sort: string;
  }

  interface View {
    type: "LIST" | "CALENDAR" | "CUSTOM";
    builtinType?: "ASSIGNEE" | "ALL";
    name: string;
    id: string;
  }

  interface Report {
    name: string;
    id: string;
    chartType:
      | "BAR"
      | "COLUMN"
      | "PIE"
      | "LINE"
      | "PIVOT_TABLE"
      | "TABLE"
      | "AREA"
      | "SPLINE"
      | "SPLINE_AREA";
    periodicReport: boolean;
  }

  interface AppPermissions {
    addRecord: boolean;
    editApp: boolean;
  }

  interface Categories {
    enabled: boolean;
    categories: Record<
      string,
      {
        name: string;
        index: string;
        children: Record<string, any>;
      }
    >;
  }

  interface RecordPermissions {
    editRecord: boolean;
    deleteRecord: boolean;
  }

  interface StatusHistoryEntry {
    changedAt: string;
    assignees: Array<{ code: string; name: string }>;
    status: string;
  }

  interface StatusAction {
    name: string;
    nextStatus: {
      name: string;
      type: "ONE" | "ALL" | "ANY";
      assignees: Array<{ code: string; name: string }>;
    };
  }

  interface Assignee {
    assignee: { code: string; name: string };
    action: string | null;
  }

  interface FieldStyleConfig {
    content?:
      | {
          backgroundColor?: string;
          color?: string;
          fontWeight?: "normal" | "bold";
          textDecoration?: "none" | "underline" | "line-through";
          borderColor?: string;
        }
      | "DEFAULT";
    background?: { backgroundColor?: string } | "DEFAULT";
    label?:
      | {
          color?: string;
          fontWeight?: "normal" | "bold";
          textDecoration?: "none" | "underline" | "line-through";
        }
      | "DEFAULT";
  }

  interface FieldStyleResult {
    content: {
      backgroundColor: string;
      color: string;
      fontWeight: string;
      textDecoration: string;
      borderColor: string;
    };
    background: {
      backgroundColor: string;
    };
    label: {
      color: string;
      fontWeight: string;
      textDecoration: string;
    };
  }

  interface RecordListStyleConfig {
    header?:
      | Array<{
          columnType?: "FIELD" | "ACTION";
          column?: string;
          content?:
            | { color?: string; fontWeight?: string; textDecoration?: string }
            | "DEFAULT";
          background?: { backgroundColor?: string } | "DEFAULT";
        }>
      | "DEFAULT";
    body?:
      | Array<{
          recordId?: string;
          style?:
            | Array<{
                columnType?: "FIELD" | "ACTION";
                column?: string;
                content?:
                  | {
                      color?: string;
                      fontWeight?: string;
                      textDecoration?: string;
                      backgroundColor?: string;
                      borderColor?: string;
                    }
                  | "DEFAULT";
                background?: { backgroundColor?: string } | "DEFAULT";
              }>
            | "DEFAULT";
        }>
      | "DEFAULT";
  }

  interface RecordListStyleResult {
    header: Array<{
      columnType: "FIELD" | "ACTION";
      column: string;
      content: { color: string; fontWeight: string; textDecoration: string };
      background: { backgroundColor: string };
    }>;
    body: Array<{
      recordId: string;
      style: Array<{
        columnType: "FIELD" | "ACTION";
        column: string;
        content: {
          color: string;
          fontWeight: string;
          textDecoration: string;
          backgroundColor: string;
          borderColor: string;
        };
        background: { backgroundColor: string };
      }>;
    }>;
  }

  interface SpaceInfo {
    id: string;
    name: string;
    isGuest: boolean;
  }

  interface SpacePermissions {
    administration: boolean;
  }

  interface AvailableFeatures {
    space: { enabled: boolean };
    guestSpace: { enabled: boolean };
    people: { enabled: boolean };
    message: { enabled: boolean };
  }

  interface SystemPermissions {
    administration: boolean;
  }

  namespace fieldTypes {
    interface SingleLineText {
      type?: "SINGLE_LINE_TEXT";
      value: string;
      disabled?: boolean;
      error?: string | null;
    }

    interface RichText {
      type?: "RICH_TEXT";
      value: string;
      disabled?: boolean;
      error?: string | null;
    }

    interface MultiLineText {
      type?: "MULTI_LINE_TEXT";
      value: string;
      disabled?: boolean;
      error?: string | null;
    }

    interface Number {
      type?: "NUMBER";
      value: string;
      disabled?: boolean;
      error?: string | null;
    }

    interface Calc {
      type: "CALC";
      value: string;
      disabled?: boolean;
    }

    interface RadioButton {
      type?: "RADIO_BUTTON";
      value: string;
      disabled?: boolean;
      error?: string | null;
    }

    interface DropDown {
      type?: "DROP_DOWN";
      value: string;
      disabled?: boolean;
      error?: string | null;
    }

    interface Date {
      type?: "DATE";
      value: string;
      disabled?: boolean;
      error?: string | null;
    }

    interface Time {
      type?: "TIME";
      value: string;
      disabled?: boolean;
      error?: string | null;
    }

    interface DateTime {
      type?: "DATETIME";
      value: string;
      disabled?: boolean;
      error?: string | null;
    }

    interface Link {
      type?: "LINK";
      value: string;
      disabled?: boolean;
      error?: string | null;
    }

    interface CheckBox {
      type?: "CHECK_BOX";
      value: string[];
      disabled?: boolean;
      error?: string | null;
    }

    interface MultiSelect {
      type?: "MULTI_SELECT";
      value: string[];
      disabled?: boolean;
      error?: string | null;
    }

    interface UserSelect {
      type?: "USER_SELECT";
      value: Array<{ code: string; name: string }>;
      disabled?: boolean;
      error?: string | null;
    }

    interface OrganizationSelect {
      type?: "ORGANIZATION_SELECT";
      value: Array<{ code: string; name: string }>;
      disabled?: boolean;
      error?: string | null;
    }

    interface GroupSelect {
      type?: "GROUP_SELECT";
      value: Array<{ code: string; name: string }>;
      disabled?: boolean;
      error?: string | null;
    }

    interface File {
      type: "FILE";
      value: Array<{
        contentType: string;
        fileKey: string;
        name: string;
        size: string;
      }>;
      disabled?: boolean;
      error?: string | null;
    }

    interface Id {
      type: "__ID__";
      value: string;
    }

    interface Revision {
      type: "__REVISION__";
      value: string;
    }

    /**
     * field type of UserField is MODIFIER.
     * So error property not exists.
     */
    interface Modifier {
      type: "MODIFIER";
      value: { code: string; name: string };
    }

    /**
     * field type of UserField is CREATOR.
     * So error property not exists.
     */
    interface Creator {
      type: "CREATOR";
      value: { code: string; name: string };
    }

    interface RecordNumber {
      type: "RECORD_NUMBER";
      value: string;
    }

    interface UpdatedTime {
      type: "UPDATED_TIME";
      value: string;
    }

    interface CreatedTime {
      type: "CREATED_TIME";
      value: string;
    }
  }
}
