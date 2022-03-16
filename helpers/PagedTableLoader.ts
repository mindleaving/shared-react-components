import { apiClient } from "../communication/ApiClient";
import { OrderDirection } from "../types/enums.d";
import { NotificationManager } from 'react-notifications';

export default class PagedTableLoader<T> {
    apiControllerPath: string;
    errorMessage: string;
    callback: (items: T[]) => void;
    filter?: any;

    constructor(
        apiPath: string,
        errorMessage: string,
        callback: (items: T[]) => void,
        filter?: any) {
        this.apiControllerPath = apiPath;
        this.errorMessage = errorMessage;
        this.callback = callback;
        this.filter = filter;
    }

    load = async (
        pageIndex: number, 
        entriesPerPage: number, 
        orderBy?: string, 
        orderDirection?: OrderDirection) => {
        try {
            let params: { [ key: string]: string } = {
                "count": entriesPerPage + '',
                "skip": (pageIndex * entriesPerPage) + ''
            }
            if(orderBy) {
                params["orderBy"] = orderBy;
                params["orderDirection"] = orderDirection ?? OrderDirection.Ascending;
            }
            let apiMethodPath = this.apiControllerPath;
            if(this.filter) {
                Object.assign(params, this.filter);
                if(this.filter.searchText) {
                    if(!apiMethodPath.endsWith('/')) {
                        apiMethodPath += '/';
                    }
                    apiMethodPath += 'search';
                }
            }
            const response = await apiClient.get(apiMethodPath, params);
            const items = await response.json() as T[];
            this.callback(items);
        } catch(error: any) {
            NotificationManager.error(error.message, this.errorMessage);
        }
    }
}