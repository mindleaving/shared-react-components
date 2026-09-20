import { Alert, Col, Form, Row } from "react-bootstrap";
import { JsonSchema, ObjectJsonSchemaTypeDefintion, ShehrdJsonSchemaCustomizations, ShehrdJsonSchemaFormValidator } from "../../types/shehrdJsonSchemaFormTypes";
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { ResetButton } from "../ResetButton";
import { AsyncButton } from "../AsyncButton";
import { resolveText } from "../../helpers/Globalizer";
import { mergeJsonSchemaTypeDefinitions } from "../../helpers/ShehrdJsonSchemaFormHelpers";
import { LoadingAlert } from "../LoadingAlert";
import { CouldNotLoadAlert } from "../CouldNotLoadAlert";
import { ShehrdJsonSchemaSubForm } from "./ShehrdJsonSchemaSubForm";
import { buildLoadObjectFunc } from "../../helpers/LoadingHelpers";
import { translateSchema } from "../../helpers/SchemaTranslator";
import { Update } from "../../types/frontendTypes";
import { CancelButton } from "../CancelButton";
import { JsonSchemaPrimitiveType } from "../../types/shehrdJsonSchemaFormEnums";

interface ShehrdJsonSchemaFormProps<T> {
    typeName: string;
    validated?: boolean;
    formData: T;
    onChange: (update: Update<T>) => void;
    onSubmit: () => Promise<void>;
    onCancel?: () => void;
    validator: ShehrdJsonSchemaFormValidator;
    customizations?: ShehrdJsonSchemaCustomizations;
    additionalButtons?: ReactNode[];

    formId?: string;
    hideButtons?: boolean;
    showResetButton?: boolean;
    isSubmitting?: boolean;
    doNotSplitMandatoryAndOptional?: boolean;
}

export const ShehrdJsonSchemaForm = <T,>(props: ShehrdJsonSchemaFormProps<T>) => {

    const { 
        typeName,
        validated,
        formData, 
        onChange,
        onCancel,
        validator,
        customizations
    } = props;

    const [ isLoadingSchema, setIsLoadingSchema ] = useState<boolean>(true);
    const [ schema, setSchema ] = useState<JsonSchema>();
    const rootTypeDefinition = useMemo(() => {
        if(!schema) {
            return undefined;
        }
        if(schema.allOf) {
            return mergeJsonSchemaTypeDefinitions(schema.allOf, schema.definitions);
        }
        const simpleSchema = schema as unknown as ObjectJsonSchemaTypeDefintion;
        if(!simpleSchema.type || simpleSchema.type !== "object") {
            return undefined;
        }
        return {
            type: "object",
            required: simpleSchema.required,
            properties: simpleSchema.properties
        } as ObjectJsonSchemaTypeDefintion
    }, [ schema ]);
    const otherTypeDefinitions = useMemo(() => schema?.definitions ?? {}, [ schema ]);

    useEffect(() => {
        setIsLoadingSchema(true);
        const loadSchema = buildLoadObjectFunc(
            `api/schemas/${typeName}`, {},
            resolveText("GenericTypeCreateEditPage_CoultNotLoadSchema"),
            async item => {
                const translatedSchema = translateSchema(item);
                delete translatedSchema.$schema;
                setSchema(translatedSchema);
            },
            undefined,
            () => setIsLoadingSchema(false)
        );
        loadSchema();
    }, [ typeName ]);

    const onSubmit = useCallback((e?: FormEvent) => {
        e?.preventDefault();
        props.onSubmit();
    }, [ props.onSubmit ]);

    if(isLoadingSchema) {
        return (<LoadingAlert />);
    }

    if(!schema) {
        return (<CouldNotLoadAlert />);
    }

    if(!rootTypeDefinition || rootTypeDefinition.type !== JsonSchemaPrimitiveType.object) {
        return (<Alert variant="danger">Schema is not of type 'object'</Alert>);
    }

    return (<Form
        id={props.formId}
        validated={validated}
        onSubmit={onSubmit}
    >
        <ShehrdJsonSchemaSubForm
            typeDefinition={rootTypeDefinition as ObjectJsonSchemaTypeDefintion}
            otherTypeDefinitions={otherTypeDefinitions}
            value={formData}
            onChange={onChange}
            validator={validator}
            customizations={customizations}
            isRootForm
            doNotSplitMandatoryAndOptional={props.doNotSplitMandatoryAndOptional}
        />
        {!props.hideButtons
        ? <Row className="align-items-center mt-3">
            <Col></Col>
            {onCancel
            ? <Col xs="auto">
                <CancelButton
                    onClick={onCancel}
                    variant='secondary'
                    className='mx-2'
                />
            </Col> : null}
            {props.showResetButton
            ? <Col xs="auto">
                <ResetButton type="reset" />
            </Col> : null}
            <Col xs="auto">
                <AsyncButton
                    type="submit"
                    isExecuting={props.isSubmitting}
                    activeText={resolveText("Submit")}
                    size="lg"
                />
            </Col>
            {props.additionalButtons?.map((button, buttonIndex) => (
                <Col key={buttonIndex} xs="auto">
                    {button}
                </Col>
            ))}
            <Col></Col>
        </Row> : null}
    </Form>);

}