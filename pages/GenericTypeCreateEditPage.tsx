import { useEffect, useState } from 'react';
import { resolveText } from '../helpers/Globalizer';
import { Form } from '@rjsf/bootstrap-4';
import { AsyncButton } from '../components/AsyncButton';
import { IChangeEvent } from '@rjsf/core';
import { useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { AccordionArrayFieldTemplate } from '../components/ReactJsonSchemaForm/AccordionArrayFieldTemplate';
import { loadAndTranslateSchema } from '../helpers/ReactJsonSchemaFormsHelpers';
import { showErrorAlert } from '../helpers/AlertHelpers';

interface GenericTypeCreateEditPageProps<T> {
    typeName: string;
    paramName?: string;
    item?: T;
    itemLoader?: (id: string) => Promise<T>;
    uiSchema?: any;
    onSubmit: (item: T) => Promise<any>;
    onChange?: (formData: T) => void;
}

export const GenericTypeCreateEditPage = <T extends unknown>(props: GenericTypeCreateEditPageProps<T>) => {

    const { [props.paramName ?? "id"]: id } = useParams();
    const [ isLoadingSchema, setIsLoadingSchema ] = useState<boolean>(true);
    const [ isLoadingItem, setIsLoadingItem ] = useState<boolean>(!!props.itemLoader);
    const [ schema, setSchema ] = useState<any>();
    const [ formData, setFormData ] = useState<T>(props.item ?? { id: uuid() } as T);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        loadAndTranslateSchema(props.typeName, setSchema, setIsLoadingSchema);
    }, [ props.typeName ]);

    useEffect(() => {
        if(!props.itemLoader || !id) {
            setIsLoadingItem(false);
            return;
        }
        const loadItem = async () => {
            try {
                const item = await props.itemLoader!(id);
                setFormData(item);
            } catch(error: any) {
                showErrorAlert(resolveText("GenericTypeCreateEditPage_CoultNotLoadItem"), error.message);
            } finally {
                setIsLoadingItem(false);
            }
        };
        loadItem();
    }, [ id ]);

    const onChange = (e: IChangeEvent) => {
        setFormData(e.formData);
        if(props.onChange) {
            props.onChange(e.formData);
        }
    }
    
    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            await props.onSubmit(formData);
        } catch(error: any) {
            showErrorAlert(resolveText("GenericTypeCreateEditPage_CoultNotSubmit"), error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if(isLoadingSchema || isLoadingItem) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }
    if(!schema) {
        return (<h3>{resolveText("GenericTypeCreateEditPage_CoultNotLoadSchema")}</h3>)
    }
    return (
        <Form
            schema={schema}
            formData={formData}
            onChange={onChange}
            onError={() => {}}
            onSubmit={onSubmit}
            uiSchema={Object.assign({
                id: {
                    "ui:readonly": true
                }
            }, props.uiSchema ?? {})}
            ArrayFieldTemplate={AccordionArrayFieldTemplate}
        >
            <AsyncButton
                type='submit'
                activeText={resolveText("Submit")}
                executingText={resolveText("Submitting...")}
                isExecuting={isSubmitting}
            />
        </Form>
    );

}
