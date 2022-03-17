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
    } catch(error) {
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
    } catch(error) {
        NotificationManager.error(error.message, errorText);
    } finally {
        if(onFinally) {
            onFinally();
        }
    }
}