declare namespace kintone {
    namespace events {
        function on(
            event: string | string[],
            handler: (event: any) => any
        ): void;
        function off(
            event: string | string[],
            handler: (event: any) => any
        ): boolean;
        function off(event: string | string[]): boolean;
        function off(): boolean;
    }

    namespace api {
        function url(
            path: string,
            detectGuestSpace?: boolean
        ): string;
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

    function api(
        pathOrUrl: string,
        method: string,
        params: any
    ): Promise<any>;

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
        catch(
            callback: (rejected: any) => any
        ): Promise<any>;

        static resolve(resolved: any): Promise<any>;
        static reject(rejected: any): Promise<any>;
        static all(
            listOfPromise: Promise<any>[]
        ): Promise<any>;
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
        function getFieldElements(
            fieldCode: string
        ): HTMLElement[] | null;
        function getHeaderMenuSpaceElement(): HTMLElement | null;
        function getHeaderSpaceElement(): HTMLElement | null;
        function getId(): number | null;
        function getLookupTargetAppId(
            fieldCode: string
        ): string | null;
        function getQuery(): string | null;
        function getQueryCondition(): string | null;
        function getRelatedRecordsTargetAppId(
            fieldCode: string
        ): string | null;

        namespace record {
            function getId(): number | null;
            function get(): any | null;
            function getHeaderMenuSpaceElement(): HTMLElement | null;
            function getFieldElement(
                fieldCode: string
            ): HTMLElement | null;
            function set(record: any): void;
            function getSpaceElement(
                id: string
            ): HTMLElement | null;
            function setFieldShown(
                fieldCode: string,
                isShwon: boolean
            ): void;
            function setGroupFieldOpen(
                fieldCode: string,
                isOpen: boolean
            ): void;
        }
    }

    namespace mobile {
        namespace app {
            function getHeaderSpaceElement(): HTMLElement | null;
            function getId(): number | null;
            function getLookupTargetAppId(
                fieldCode: string
            ): string | null;
            function getQuery(): string | null;
            function getQueryCondition(): string | null;
            function getRelatedRecordsTargetAppId(
                fieldCode: string
            ): string | null;

            namespace record {
                function getId(): number | null;
                function get(): any | null;
                function set(record: any): void;
                function getSpaceElement(
                    id: string
                ): HTMLElement | null;
                function setFieldShown(
                    fieldCode: string,
                    isShwon: boolean
                ): void;
                function setGroupFieldOpen(
                    fieldCode: string,
                    isOpen: boolean
                ): void;
            }
        }

        namespace portal {
            function getContentSpaceElement(): HTMLElement | null;
        }
    }

    namespace plugin {
        namespace app {
            function getConfig(pluginId: string): any;
            function setConfig(
                config: any,
                callback?: () => void
            ): void;

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

            function getProxyConfig(
                url: string,
                method: string
            ): any;

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
}
