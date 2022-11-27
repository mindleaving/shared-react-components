import { apiClient } from "../communication/ApiClient";
import { showSuccessAlert, showErrorAlert } from "./AlertHelpers";

export const buildAndStoreObject = async <T extends unknown>(
    apiPath: string,
    successText: string,
    errorText: string,
    itemBuilder: () => T,
    onSuccess?: (item: T) => void,
    onFinally?: () => void
) => {
    try {
        const item = itemBuilder();
        await apiClient.instance!.put(apiPath, {}, item);
        showSuccessAlert(successText);
        if(onSuccess) {
            onSuccess(item);
        }
    } catch(error: any) {
        showErrorAlert(error.message, errorText);
    } finally {
        if(onFinally) {
            onFinally();
        }
    }
}

export const sendPutRequest = async <T extends unknown>(
    apiPath: string,
    errorText: string,
    item: T,
    handleResponse?: (response: Response) => void,
    onFailure?: () => void,
    onFinally?: () => void
) => {
    try {
        const response = await apiClient.instance!.put(apiPath, {}, item);
        if(handleResponse) {
            handleResponse(response);
        }
    } catch(error: any) {
        if(onFailure) {
            onFailure();
        }
        showErrorAlert(error.message, errorText);
    } finally {
        if(onFinally) {
            onFinally();
        }
    }
}

export const sendPostRequest = async (
    apiPath: string,
    errorText: string,
    body: any,
    onSuccess?: (response: Response) => void,
    onFailure?: () => void,
    onFinally?: () => void
) => {
    try {
        const response = await apiClient.instance!.post(apiPath, {}, body);
        if(onSuccess) {
            onSuccess(response);
        }
    } catch(error: any) {
        if(onFailure) {
            onFailure();
        }
        showErrorAlert(error.message, errorText);
    } finally {
        if(onFinally) {
            onFinally();
        }
    }
}