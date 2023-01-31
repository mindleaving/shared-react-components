import { Form } from '@rjsf/bootstrap-4';
import { IChangeEvent } from '@rjsf/core';
import { useState, useEffect } from 'react';
import { showErrorAlert } from '../../helpers/AlertHelpers';
import { resolveText } from '../../helpers/Globalizer';
import { loadAndTranslateSchema } from '../../helpers/ReactJsonSchemaFormsHelpers';
import { AsyncButton } from '../AsyncButton';
import { AccordionArrayFieldTemplate } from './AccordionArrayFieldTemplate';

interface GenericTypeFormProps {
    typeName: string;
    formData: any;
    uiSchema?: any;
    onChange: (formData: any) => void;
    onSubmit: () => Promise<void>;
}

export const GenericTypeForm = (props: GenericTypeFormProps) => {

    const [ schema, setSchema ] = useState<any>();
    const [ isLoadingSchema, setIsLoadingSchema ] = useState<boolean>(true);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        loadAndTranslateSchema(props.typeName, setSchema, setIsLoadingSchema);
    }, [ props.typeName ]);

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            await props.onSubmit();
        } catch(error: any) {
            showErrorAlert(resolveText("GenericTypeCreateEditPage_CoultNotSubmit"), error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if(isLoadingSchema) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }
    if(!schema) {
        return (<h3>{resolveText("GenericTypeCreateEditPage_CoultNotLoadSchema")}</h3>)
    }

    return (
        <Form
            schema={schema}
            formData={props.formData}
            onChange={(e: IChangeEvent) => props.onChange(e.formData)}
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