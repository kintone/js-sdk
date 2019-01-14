import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {Promise} from 'es6-promise';

import {FormsClient, FetchFormPropertiesInput, FieldType, SubTableFieldType} from './forms-client';

interface NewInstanceInput {
    host: string,
    username: string,
    password: string
}

export class FormsClientImpl implements FormsClient {
    readonly client: AxiosInstance;
    static newClient(input: NewInstanceInput) : FormsClientImpl {
        return new FormsClientImpl(input);
    }

    constructor(input: NewInstanceInput) {
        const token = Buffer.from(`${input.username}:${input.password}`).toString('base64');
        this.client = axios.create({
            baseURL: input.host,
            headers: {
                "X-Cybozu-Authorization": token
            }
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
        if(input.guest && input.preview) {
            return `/k/guest/${input.guestSpaceId}/v1/preview/app/form/fields.json`;
        } else if(input.guest) {
            return `/k/guest/${input.guestSpaceId}/v1/app/form/fields.json`;
        }else if(input.preview) {
            return `/k/v1/preview/app/form/fields.json`;
        } else {
            return `/k/v1/app/form/fields.json`;
        }
    }
}