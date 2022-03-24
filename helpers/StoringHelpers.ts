import { apiClient } from "../communication/ApiClient";
import { NotificationManager } from 'react-notifications';

export const buildAndStoreObject = async <T extends unknown>(
    apiPath: string,
    successText: string,
    errorText: string,
    itemBuilder: () => T,
    onSuccess?: () => void,
    onFinally?: () => void
) => {
    try {
        const item = itemBuilder();
        await apiClient.instance!.put(apiPath, {}, item);
        NotificationManager.success(successText);
        if(onSuccess) {
            onSuccess();
        }
    } catch(error: any) {
        NotificationManager.error(error.message, errorText);
    } finally {
        if(onFinally) {
            onFinally();
        }
    }
}

export const storeObject = async <T extends unknown>(
    apiPath: string,
    errorText: string,
    item: T,
    onFinally?: () => void
) => {
    try {
        await apiClient.instance!.put(apiPath, {}, item);
    } catch(error: any) {
        NotificationManager.error(error.message, errorText);
    } finally {
        if(onFinally) {
            onFinally();
        }
    }
}

export const submitPostRequest = async (
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