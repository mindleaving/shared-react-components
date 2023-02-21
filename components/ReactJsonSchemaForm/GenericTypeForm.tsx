import Form from '@rjsf/bootstrap-4';
import validator from "@rjsf/validator-ajv8";
import { IChangeEvent } from '@rjsf/core';
import { useState, useEffect } from 'react';
import { showErrorAlert } from '../../helpers/AlertHelpers';
import { resolveText } from '../../helpers/Globalizer';
import { loadAndTranslateSchema } from '../../helpers/ReactJsonSchemaFormsHelpers';
import { AsyncButton } from '../AsyncButton';
import { AccordionArrayFieldTemplate } from './AccordionArrayFieldTemplate';
import { UiSchema } from '@rjsf/utils';
import { SelectWidget } from './SelectWidget';
import { LoadingAlert } from '../LoadingAlert';
import { Alert } from 'react-bootstrap';
import { OptionalObjectField } from './OptionalObjectField';

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
        return (<LoadingAlert />);
    }
    if(!schema) {
        return (<Alert variant='danger'>
            {resolveText("GenericTypeCreateEditPage_CoultNotLoadSchema")}
        </Alert>);
    }

    return (
        <Form
            schema={{
                ...schema,
                title: undefined
            }}
            validator={validator}
            formData={props.formData}
            onChange={(e: IChangeEvent) => props.onChange(e.formData)}
            onSubmit={onSubmit}
            uiSchema={Object.assign({
                id: {
                    "ui:readonly": true
                }
            } as UiSchema, props.uiSchema ?? {})}
            fields={{
                OneOfField: OptionalObjectField
            }}
            templates={{
                ArrayFieldTemplate: AccordionArrayFieldTemplate
            }}
            widgets={{
                SelectWidget: SelectWidget
            }}
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