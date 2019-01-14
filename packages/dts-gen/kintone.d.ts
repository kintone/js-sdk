declare namespace kintone {

    namespace events {
        function on(event: string|string[], handler: (event: any) => any) : void;
        function off(event: string|string[], handler: (event: any) => any): boolean;
    }

    namespace api {
        function url(path : string): string;
        function urlForGet(
            path : string,
            params: any,
            detectGuestSpace: boolean | null
        ): string;
    }

    function api(
        pathOrUrl: string, 
        method: string, 
        params: any        
    ) : Promise<any>;

    function api(
        pathOrUrl: string, 
        method: string, 
        params: any, 
        callback: (resp: any) => void, 
        errback : (err: any) => void
    ) : void;
    
    function getRequestToken() : string;

    function proxy(
        url: string,
        method: string,
        headers: any,
        data: any
    ) : Promise<any>;

    function proxy(
        url: string,
        method: string,
        headers: any,
        data: any,
        callback: (resp: any) => void,
        errback: (err: any) => void
    ) : void;

    namespace proxy {
        function upload(
            url : string,
            method: string,
            headers: any,
            data: any,
            callback : (resp: any) => void,
            errback: (err: any) => void
        ) : void;

        function upload(
            url : string,
            method : string,
            headers: any,
            data: any
        ) : Promise<any>;
    }

    namespace app {
        namespace record {
            function getId() : number | null;
            function get() : any | null;
            function getFieldElement(fieldCode: string) : HTMLElement | null;
            function set(record: any) : void;
            function getHeaderMenuSpaceElement(): HTMLElement | null;
            function getSpaceElement(id : string): HTMLElement | null;
            function getRelatedRecordsTargetAppId(fieldCode: string) : string | null;
            function getLookupTargetAppId(fieldCode: string) : string | null;
            function setFieldShown(fieldCode: string, isShwon: boolean): void;
            
            function getFieldElements(fieldCode: string): HTMLElement[] | null;
        }
    }

    namespace mobile {
        namespace app {
            namespace record {
                function getId() : number | null;
                function get() : any | null;
                function set(record: any) : void;
                function getHeaderSpaceElement(): HTMLElement | null;
                function getSpaceElement(id: string) : HTMLElement | null;
                function getRelatedRecordsTargetAppId(fieldCode: string) : string | null;
                function getLookupTargetAppId(fieldCode: string) : string | null;
                function setFieldShown(fieldCode: string, isShwon: boolean): void;
            }
        }
    }

    namespace plugin {
        namespace app {
            function getConfig(pluginId : string) : any;
            function setConfig(config: any, callback:() => void): void;

            function proxy(
                pluginId: string,
                url: string,
                method: string,
                headers: any,
                data: any
            ) : Promise<any>

            function proxy(
                pluginId: string,
                url: string,
                method: string,
                headers: any,
                data: any,
                callback: (resp: any) => void,
                error: (err: any) => void
            ) : void;

            function setProxyConfig(
                url: string,
                method: string,
                headers: any,
                data: any,
                callback: () => void
            ) : void;
        }

        function getProxyCondig(url: string, method: string) : any;
        
        function upload(
            pluginId: any, 
            url: string,
            method: string,
            headers: any,
            data: any,
        ) : Promise<any>;

        function upload(
            pluginId: any, 
            url: string,
            method: string,
            headers: any,
            data: any,
            callback: (resp: any) => void,
            error: (err: any) => void
        ) : void;
    }

    interface LoginUser {
        id: string,
        code: string,
        name: string,
        email: string,
        url: string,
        employeeNumber: string,
        phone: string,
        mobilePhone: string,
        extensionNumber: string,
        timezone: string,
        isGuest: boolean,
        language: "ja" | "en" | "zh",
    }

    function getLoginUser() : LoginUser;
    function getUiVersion() : 1 | 2;
}