import { Client, FetchResponse, MaybeOptionalInit } from "openapi-fetch";
import { HttpMethod, MediaType, PathsWithMethod } from "openapi-typescript-helpers";
type InitParam<Init> = Init & {
    [key: string]: unknown;
};
type CreateIteratorMethod<Paths extends Record<string, Record<HttpMethod, {}>>, Method extends HttpMethod, Media extends MediaType> = <Path extends PathsWithMethod<Paths, Method>, Init extends MaybeOptionalInit<Paths[Path], Method>>(url: Path, handleRequest: (previousInit: InitParam<Init>, previousResult: FetchResponse<Paths[Path][Method], Init, Media> | null) => InitParam<Init>, hasNext: (init: InitParam<Init>, response: FetchResponse<Paths[Path][Method], Init, Media> | null) => boolean, init: InitParam<Init>) => AsyncGenerator<FetchResponse<Paths[Path][Method], Init, Media>>;
interface ClientIterator<Paths extends {} = any, Media extends MediaType = any> {
    GET: CreateIteratorMethod<Paths, "get", Media>;
    PUT: CreateIteratorMethod<Paths, "put", Media>;
    POST: CreateIteratorMethod<Paths, "post", Media>;
    DELETE: CreateIteratorMethod<Paths, "delete", Media>;
    OPTIONS: CreateIteratorMethod<Paths, "options", Media>;
    HEAD: CreateIteratorMethod<Paths, "head", Media>;
    PATCH: CreateIteratorMethod<Paths, "patch", Media>;
    TRACE: CreateIteratorMethod<Paths, "trace", Media>;
}
export declare function iterator<Paths extends {} = any, Media extends MediaType = any>(client: Client<Paths, Media>): ClientIterator<Paths, Media>;
export {};
