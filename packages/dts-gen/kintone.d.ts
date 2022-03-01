declare namespace kintone {
  namespace events {
    function on(event: string | string[], handler: (event: any) => any): void;
    function off(
      event: string | string[],
      handler: (event: any) => any
    ): boolean;
    function off(event: string | string[]): boolean;
    function off(): boolean;
  }

  namespace api {
    function url(path: string, detectGuestSpace?: boolean): string;
    function urlForGet(
      path: string,
      params: any,
      detectGuestSpace?: boolean
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
    errback: (err: any) => void
  ): void;

  function getRequestToken(): string;

  function proxy(
    url: string,
    method: string,
    headers: any,
    data: any
  ): Promise<any>;

  function proxy(
    url: string,
    method: string,
    headers: any,
    data: any,
    callback: (resp: any) => void,
    errback: (err: any) => void
  ): void;

  class Promise<T> {
    constructor(
      callback: (
        resolve: (resolved: T) => any,
        reject: (rejected: any) => any
      ) => void
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
      errback: (err: any) => void
    ): void;

    function upload(
      url: string,
      method: string,
      headers: any,
      data: any
    ): Promise<any>;
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

    namespace record {
      function getId(): number | null;
      function get(): any | null;
      function getHeaderMenuSpaceElement(): HTMLElement | null;
      function getFieldElement(fieldCode: string): HTMLElement | null;
      function set(record: any): void;
      function getSpaceElement(id: string): HTMLElement | null;
      function setFieldShown(fieldCode: string, isShown: boolean): void;
      function setGroupFieldOpen(fieldCode: string, isOpen: boolean): void;
    }
  }

  namespace mobile {
    namespace app {
      function getFieldElements(fieldCode: string): HTMLElement[] | null;
      function getHeaderSpaceElement(): HTMLElement | null;
      function getId(): number | null;
      function getLookupTargetAppId(fieldCode: string): string | null;
      function getQuery(): string | null;
      function getQueryCondition(): string | null;
      function getRelatedRecordsTargetAppId(fieldCode: string): string | null;

      namespace record {
        function getId(): number | null;
        function get(): any | null;
        function getFieldElement(fieldCode: string): HTMLElement | null;
        function set(record: any): void;
        function getSpaceElement(id: string): HTMLElement | null;
        function setFieldShown(fieldCode: string, isShown: boolean): void;
        function setGroupFieldOpen(fieldCode: string, isOpen: boolean): void;
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
        data: any
      ): Promise<any>;

      function proxy(
        pluginId: string,
        url: string,
        method: string,
        headers: any,
        data: any,
        callback: (resp: any) => void,
        error: (err: any) => void
      ): void;

      function setProxyConfig(
        url: string,
        method: string,
        headers: any,
        data: any,
        callback?: () => void
      ): void;

      function getProxyConfig(url: string, method: string): any;

      namespace proxy {
        function upload(
          pluginId: any,
          url: string,
          method: string,
          headers: any,
          data: any
        ): Promise<any>;

        function upload(
          pluginId: any,
          url: string,
          method: string,
          headers: any,
          data: any,
          callback: (resp: any) => void,
          error: (err: any) => void
        ): void;
      }
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

  namespace fieldTypes {
    interface SingleLineText {
      type?: "SINGLE_LINE_TEXT";
      value: string;
      disabled?: boolean;
      error?: string;
    }

    interface RichText {
      type?: "RICH_TEXT";
      value: string;
      disabled?: boolean;
      error?: string;
    }

    interface MultiLineText {
      type?: "MULTI_LINE_TEXT";
      value: string;
      disabled?: boolean;
      error?: string;
    }

    interface Number {
      type?: "NUMBER";
      value: string;
      disabled?: boolean;
      error?: string;
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
      error?: string;
    }

    interface DropDown {
      type?: "DROP_DOWN";
      value: string;
      disabled?: boolean;
      error?: string;
    }

    interface Date {
      type?: "DATE";
      value: string;
      disabled?: boolean;
      error?: string;
    }

    interface Time {
      type?: "TIME";
      value: string;
      disabled?: boolean;
      error?: string;
    }

    interface DateTime {
      type?: "DATETIME";
      value: string;
      disabled?: boolean;
      error?: string;
    }

    interface Link {
      type?: "LINK";
      value: string;
      disabled?: boolean;
      error?: string;
    }

    interface CheckBox {
      type?: "CHECK_BOX";
      value: string[];
      disabled?: boolean;
      error?: string;
    }

    interface MultiSelect {
      type?: "MULTI_SELECT";
      value: string[];
      disabled?: boolean;
      error?: string;
    }

    interface UserSelect {
      type?: "USER_SELECT";
      value: Array<{ code: string; name: string }>;
      disabled?: boolean;
      error?: string;
    }

    interface OrganizationSelect {
      type?: "ORGANIZATION_SELECT";
      value: Array<{ code: string; name: string }>;
      disabled?: boolean;
      error?: string;
    }

    interface GroupSelect {
      type?: "GROUP_SELECT";
      value: Array<{ code: string; name: string }>;
      disabled?: boolean;
      error?: string;
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
      error?: string;
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
      error?: string;
    }

    interface UpdatedTime {
      type: "UPDATED_TIME";
      value: string;
      error?: string;
    }

    interface CreatedTime {
      type: "CREATED_TIME";
      value: string;
      error?: string;
    }
  }
}
