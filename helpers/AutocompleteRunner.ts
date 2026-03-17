import { apiClient } from "../communication/ApiClient";
import { QueryParameter } from "../types/frontendTypes";

export class AutocompleteRunner<T> {
    url: string;
    searchParameter: string;
    maxSuggestions?: number;
    orderBy?: string;
    additionalParameters: QueryParameter[];

    constructor(
        url: string, 
        searchParameter: string, 
        maxSuggestions?: number,
        orderBy?: string,
        additionalParameters?: QueryParameter[]) {
        this.url = url;
        this.searchParameter = searchParameter;
        this.maxSuggestions = maxSuggestions;
        this.orderBy = orderBy;
        this.additionalParameters = additionalParameters ?? [];
    }

    search = async (searchText: string): Promise<T[]> => {
        const params = this.additionalParameters.concat([
            { key: this.searchParameter, value: searchText }
        ]);
        if(this.maxSuggestions) {
            params.push({ key: 'count', value: this.maxSuggestions + '' });
        }
        if(this.orderBy) {
            params.push({ key: 'orderBy', value: this.orderBy });
        }
        const response = await apiClient.instance!.get(this.url, params);
        const items = await response.json() as T[];
        return items;
    }
}