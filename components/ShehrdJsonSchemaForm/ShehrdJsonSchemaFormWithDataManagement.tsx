import { useCallback, useEffect, useState } from "react";
import { ShehrdJsonSchemaForm } from "./ShehrdJsonSchemaForm";
import { useParams } from "react-router-dom";
import { showErrorAlert } from "../../helpers/AlertHelpers";
import { LoadingAlert } from "../LoadingAlert";
import { ShehrdJsonSchemaCustomizations, ShehrdJsonSchemaFormValidator } from "../../types/shehrdJsonSchemaFormTypes";
import { CouldNotLoadAlert } from "../CouldNotLoadAlert";
import { resolveText } from "../../helpers/Globalizer";

interface ShehrdJsonSchemaFormWithDataManagementProps<T> {
    typeName: string;
    validated?: boolean;
    initialValueFactory: () => T;
    loader: (id: string) => Promise<T | undefined>;
    submit: (item: T) => Promise<T>;
    onSubmitted?: (item: T) => void;
    validator: ShehrdJsonSchemaFormValidator;
    customizations?: ShehrdJsonSchemaCustomizations;

    formId?: string;
    hideSubmitButton?: boolean;
    showResetButton?: boolean;
}

export const ShehrdJsonSchemaFormWithDataManagement = <T,>(props: ShehrdJsonSchemaFormWithDataManagementProps<T>) => {

    const { id } = useParams();
    
    const [ isLoading, setIsLoading ] = useState<boolean>(!!id);
    const [ formData, setFormData ] = useState<T | undefined>(() => !id ? props.initialValueFactory() : undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        if(!id) {
            return;
        }
        setIsLoading(true);
        const loadItem = async () => {
            setIsLoading(true);
            try {
                const item = await props.loader(id);
                setFormData(item);
            } catch {
                showErrorAlert("GenericTypeCreateEditPage_CoultNotLoadItem");
            } finally {
                setIsLoading(false);
            }
        }
        loadItem();
    }, [ id ]);

    const submit = useCallback(async () => {
        setIsSubmitting(true);
        try {
            const storedItem = await props.submit(formData as T);
            setFormData(storedItem);
            if(!!props.onSubmitted) {
                props.onSubmitted(storedItem);
            }
        } catch {
            showErrorAlert(resolveText("GenericTypeCreateEditPage_CoultNotSubmit"));
        } finally {
            setIsSubmitting(false);
        }
    }, [ formData, props.submit, props.onSubmitted ]);

    if(isLoading) {
        return (<LoadingAlert />);
    }

    if(!!id && !formData) {
        return (<CouldNotLoadAlert />);
    }

    return (<ShehrdJsonSchemaForm
        typeName={props.typeName}
        validated={props.validated}
        formData={formData!}
        onChange={update => setFormData(state => update(state!))}
        onSubmit={submit}
        formId={props.formId}
        isSubmitting={isSubmitting}
        hideButtons={props.hideSubmitButton}
        showResetButton={props.showResetButton}
        validator={props.validator}
        customizations={props.customizations}
    />);

}