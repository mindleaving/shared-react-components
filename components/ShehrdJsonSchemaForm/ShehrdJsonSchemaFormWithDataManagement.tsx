import { useCallback, useEffect, useState } from "react";
import { ShehrdJsonSchemaForm } from "./ShehrdJsonSchemaForm";
import { useParams } from "react-router-dom";
import { showErrorAlert } from "../../helpers/AlertHelpers";
import { LoadingAlert } from "../LoadingAlert";
import { ShehrdJsonSchemaCustomizations } from "../../types/shehrdJsonSchemaFormTypes";

interface ShehrdJsonSchemaFormWithDataManagementProps<T> {
    typeName: string;
    validated?: boolean;
    loader: (id: string) => Promise<T | undefined>;
    submit: (item: T) => Promise<T>;
    onSubmitted?: (item: T) => void;
    validator: (typeName: string, item: T) => boolean;
    customizations?: ShehrdJsonSchemaCustomizations;

    formId?: string;
    hideSubmitButton?: boolean;
    showResetButton?: boolean;
}

export const ShehrdJsonSchemaFormWithDataManagement = <T,>(props: ShehrdJsonSchemaFormWithDataManagementProps<T>) => {

    const { id } = useParams();
    
    const [ isLoading, setIsLoading ] = useState<boolean>(!!id);
    const [ formData, setFormData ] = useState<any>({});
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        if(!id) {
            return;
        }
        setIsLoading(true);
        const loadItem = async () => {
            const item = await props.loader(id);
            if(!item) {
                showErrorAlert("GenericTypeCreateEditPage_CoultNotLoadItem");
                return;
            } else {
                setFormData(item);
            }
        } 
        loadItem();
    }, [ id ]);

    const submit = useCallback(async () => {
        setIsSubmitting(true);
        const storedItem = await props.submit(formData as T);
        setFormData(storedItem);
        if(!!props.onSubmitted) {
            props.onSubmitted(storedItem);
        }
    }, []);

    if(isLoading) {
        return (<LoadingAlert />);
    }

    return (<ShehrdJsonSchemaForm
        typeName={props.typeName}
        validated={props.validated}
        formData={formData}
        onChange={setFormData}
        onSubmit={submit}
        formId={props.formId}
        isSubmitting={isSubmitting}
        hideSubmitButton={props.hideSubmitButton}
        showResetButton={props.showResetButton}
        validator={props.validator}
        customizations={props.customizations}
    />);

}