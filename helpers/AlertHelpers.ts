import { confirmAlert } from "react-confirm-alert";
import { resolveText } from "./Globalizer";

export const openConfirmDeleteAlert = (
    nameOfObjectToBeDeleted: string, 
    title: string, 
    message: string, 
    yesCallback: () => void, 
    noCallback: () => void = () => {}) => {        
    confirmAlert({
        title: title,
        message: message.replace('{0}', nameOfObjectToBeDeleted),
        closeOnClickOutside: true,
        buttons: [
            {
                label: resolveText('Delete_No'),
                onClick: noCallback
            }, 
            {
                label: resolveText('Delete_Yes'),
                onClick: yesCallback
            }
        ]
    });
}