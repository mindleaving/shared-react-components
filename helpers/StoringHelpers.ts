import { apiClient } from "../communication/ApiClient";
import { NotificationManager } from 'react-notifications';

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
        NotificationManager.success(successText);
        if(onSuccess) {
            onSuccess(item);
        }
    } catch(error: any) {
        NotificationManager.error(error.message, errorText);
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
    onFinally?: () => void
) => {
    try {
        const response = await apiClient.instance!.put(apiPath, {}, item);
        if(handleResponse) {
            handleResponse(response);
        }
    } catch(error: any) {
        NotificationManager.error(error.message, errorText);
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
    handleResponse?: (response: Response) => void,
    onFinally?: () => void
) => {
    try {
        const response = await apiClient.instance!.post(apiPath, {}, body);
        if(handleResponse) {
            handleResponse(response);
        }
    } catch(error: any) {
        NotificationManager.error(error.message, errorText);
    } finally {
        if(onFinally) {
            onFinally();
        }
    }
}