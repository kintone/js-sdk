import axios, {AxiosInstance, AxiosProxyConfig, AxiosRequestConfig} from 'axios';
import {Promise} from 'es6-promise';

import {FormsClient, FetchFormPropertiesInput, FieldType, SubTableFieldType} from './forms-client';

interface NewInstanceInput {
    host: string,
    username: string,
    password: string,
    proxyHost: string | null,
    proxyPort: string | null,
    basicAuthPassword: string | null,
    basicAuthUsername: string | null,
}

export class FormsClientImpl implements FormsClient {
    readonly client: AxiosInstance;
    static newClient(input: NewInstanceInput) : FormsClientImpl {
        return new FormsClientImpl(input);
    }

    constructor(input: NewInstanceInput) {

        let proxy : AxiosProxyConfig | false = false;
        if(input.proxyHost !== null && input.proxyPort !== null) {
            proxy = {
                host: input.proxyHost,
                port: parseInt(input.proxyPort)
            }
        }

        const headers = {
            "X-Cybozu-Authorization": Buffer.from(`${input.username}:${input.password}`).toString('base64'),
        };
        if(input.basicAuthPassword && input.basicAuthPassword) {
            headers["Authorization"] = "Basic " + Buffer.from(`${input.basicAuthUsername}:${input.basicAuthPassword}`);
        }
        this.client = axios.create({
            baseURL: input.host,
            headers,
            proxy
        });
    }
    
    fetchFormProperties(input: FetchFormPropertiesInput) : Promise<{[key:string]: FieldType|SubTableFieldType}> {
        const config : AxiosRequestConfig = {
            method: "GET",
            url: this.constructUrl(input),
            data: {
                app: input.appId
            }
        };

        return this.client.request(config)
                .then(resp => resp.data.properties) as Promise<{[key:string]: FieldType|SubTableFieldType}>;
    }

    private constructUrl(input: FetchFormPropertiesInput) : string {
        if(input.guestSpaceId !== null && input.preview) {
            return `/k/guest/${input.guestSpaceId}/v1/preview/app/form/fields.json`;
        } else if(input.guestSpaceId !== null) {
            return `/k/guest/${input.guestSpaceId}/v1/app/form/fields.json`;
        }else if(input.preview) {
            return `/k/v1/preview/app/form/fields.json`;
        } else {
            return `/k/v1/app/form/fields.json`;
        }
    }
}