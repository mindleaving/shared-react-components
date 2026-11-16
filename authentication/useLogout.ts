import { useCallback } from "react";
import { apiClient } from "../communication/ApiClient";
import { LogoutActions } from "../types/frontendTypes";
import { LogoutScope } from "../types/enums";


const signOutWithScope = async (logoutScope: LogoutScope) => {
    if (logoutScope === LogoutScope.Everywhere) {
        await apiClient.instance!.signOutEverywhere();
    } else {
        await apiClient.instance!.signOut();
    }
};

export const useLogout = (logoutActions: LogoutActions) => {
    const { preLogout, postLogout } = logoutActions;

    return useCallback(async (logoutScope: LogoutScope = LogoutScope.CurrentSession) => {
        let logoutError: unknown = undefined;
        try {
            await preLogout?.();
        } catch (preLogoutError) {
            logoutError = preLogoutError;
        }
        try {
            await signOutWithScope(logoutScope);
        } catch (signOutError) {
            logoutError = logoutError ?? signOutError;
        }
        await postLogout?.({ logoutScope, error: logoutError });
    }, [preLogout, postLogout]);
};