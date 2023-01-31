import { apiClient } from "../communication/ApiClient";
import { showSuccessAlert, showErrorAlert } from "./AlertHelpers";

export const buildAndStoreObject = async <T extends unknown>(
    apiPath: string,
    params: QueryParameters,
    successText: string,
    errorText: string,
    itemBuilder: () => T,
    onSuccess?: (item: T) => void,
    onFinally?: () => void
) => {
    try {
        const item = itemBuilder();
        await apiClient.instance!.put(apiPath, item, params);
        showSuccessAlert(successText);
        if(onSuccess) {
            onSuccess(item);
        }
    } catch(error: any) {
        showErrorAlert(errorText, error.message);
    } finally {
        if(onFinally) {
            onFinally();
        }
    }
}

export const sendPutRequest = async <T extends unknown>(
    apiPath: string,
    params: QueryParameters,
    errorText: string,
    item: T,
    handleResponse?: (response: Response) => void,
    onFailure?: () => void,
    onFinally?: () => void
) => {
    try {
        const response = await apiClient.instance!.put(apiPath, item, params);
        if(handleResponse) {
            handleResponse(response);
        }
    } catch(error: any) {
        if(onFailure) {
            onFailure();
        }
        showErrorAlert(errorText, error.message);
    } finally {
        if(onFinally) {
            onFinally();
        }
    }
}

export const sendPostRequest = async (
    apiPath: string,
    params: QueryParameters,
    errorText: string,
    body: any,
    onSuccess?: (response: Response) => void,
    onFailure?: (response: Response | undefined) => void,
    onFinally?: () => void
) => {
    try {
        const response = await apiClient.instance!.post(apiPath, body, params, { handleError: false });
        if(response.ok) {
            if(onSuccess) {
                onSuccess(response);
            }
        } else {
            if(onFailure) {
                onFailure(response);
            } else {
                try {
                    const errorDescription = await response.text();
                    showErrorAlert(errorText, errorDescription);
                } catch {
                    showErrorAlert(errorText);
                    // Ignore
                }
            }
        }
    } catch(error: any) {
        if(onFailure) {
            onFailure(undefined);
        }
        showErrorAlert(errorText, error.message);
    } finally {
        if(onFinally) {
            onFinally();
        }
    }
}