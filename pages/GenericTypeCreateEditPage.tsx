import React, { useEffect, useState } from 'react';
import { resolveText } from '../helpers/Globalizer';
import { buildLoadObjectFunc } from '../helpers/LoadingHelpers';
import { Form } from '@rjsf/bootstrap-4';
import { AsyncButton } from '../components/AsyncButton';
import { NotificationManager } from 'react-notifications';
import { ArrayFieldTemplateProps, IChangeEvent } from '@rjsf/core';
import { useParams } from 'react-router-dom';
import { Accordion, Button } from 'react-bootstrap';
import { translateSchema } from '../helpers/SchemaTranslator';
import { v4 as uuid } from 'uuid';

interface GenericTypeCreateEditPageProps<T> {
    typeName: string;
    item?: T;
    itemLoader?: (id: string) => Promise<T>;
    onSubmit: (item: T) => Promise<any>;
}

export const GenericTypeCreateEditPage = <T extends unknown>(props: GenericTypeCreateEditPageProps<T>) => {

    const { id } = useParams();
    const [ isLoadingSchema, setIsLoadingSchema ] = useState<boolean>(true);
    const [ isLoadingItem, setIsLoadingItem ] = useState<boolean>(!!props.itemLoader);
    const [ schema, setSchema ] = useState<any>();
    const [ formData, setFormData ] = useState<T>(props.item ?? { id: uuid() } as T);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        const loadSchema = buildLoadObjectFunc(
            `api/schemas/${props.typeName}`,
            {},
            resolveText("GenericTypeCreateEditPage_CoultNotLoadSchema"),
            item => {
                const translatedSchema = translateSchema(item);
                delete translatedSchema.$schema;
                setSchema(translatedSchema);
            },
            () => setIsLoadingSchema(false)
        );
        loadSchema()
    }, [ props.typeName ]);
    useEffect(() => {
        if(!props.itemLoader || !id) {
            return;
        }
        const loadItem = async () => {
            try {
                const item = await props.itemLoader!(id);
                setFormData(item);
            } catch(error: any) {
                NotificationManager.error(error.message, resolveText("GenericTypeCreateEditPage_CoultNotLoadItem"));
            } finally {
                setIsLoadingItem(false);
            }
        };
        loadItem();
    }, [ props.itemLoader, id ]);

    const onChange = (e: IChangeEvent) => {
        setFormData(e.formData);
    }
    
    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            await props.onSubmit(formData);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("GenericTypeCreateEditPage_CoultNotSubmit"));
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
            uiSchema={{
                id: {
                    "ui:readonly": true
                }
            }}
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
const AccordionArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
    return (
    <>
        {props.TitleField(props as any)}
        {props.DescriptionField(props as any)}
        <Accordion key={props.formData.id}>
            {props.items.map((item,index) => (
                <Accordion.Item key={index} eventKey={index + ""}>
                    <Accordion.Header>
                        Item {index}
                    </Accordion.Header>
                    <Accordion.Body>
                        {item.children}
                        <Button variant="danger" onClick={() => item.onDropIndexClick(index)()}>{resolveText("Delete")}</Button>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
        {props.canAdd ? <Button className='m-2' onClick={props.onAddClick}>{resolveText("Add")}</Button> : null}
    </>
    )
}