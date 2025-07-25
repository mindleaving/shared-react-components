import { apiClient } from '../communication/ApiClient';
import { showErrorAlert, showSuccessAlert } from './AlertHelpers';

export const deleteObject = async (
    apiPath: string,
    params: { [key: string]: string },
    errorText: string,
    onSuccess?: () => void,
    onFailure?: () => void,
    onFinally?: () => void
) => {
    try {
        await apiClient.instance!.delete(apiPath, params);
        if(onSuccess) {
            onSuccess();
        }
    } catch(error: any) {
        showErrorAlert(errorText, error.message);
        if(onFailure) {
            onFailure();
        }
    } finally {
        if(onFinally) {
            onFinally();
        }
    }
}