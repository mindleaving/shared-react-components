import { Col, Form, Row } from "react-bootstrap";
import { JsonSchema, ObjectJsonSchemaTypeDefintion, ShehrdJsonSchemaCustomizations, ShehrdJsonSchemaFormValidator } from "../../types/shehrdJsonSchemaFormTypes";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
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

interface ShehrdJsonSchemaFormProps<T> {
    typeName: string;
    validated?: boolean;
    formData: T;
    onChange: (update: Update<T>) => void;
    onSubmit: () => Promise<void>;
    validator: ShehrdJsonSchemaFormValidator;
    customizations?: ShehrdJsonSchemaCustomizations;

    formId?: string;
    hideSubmitButton?: boolean;
    showResetButton?: boolean;
    isSubmitting?: boolean;
}

export const ShehrdJsonSchemaForm = <T,>(props: ShehrdJsonSchemaFormProps<T>) => {

    const { 
        typeName,
        validated,
        formData, 
        onChange,
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

    return (<Form
        id={props.formId}
        validated={validated}
        onSubmit={onSubmit}
    >
        <ShehrdJsonSchemaSubForm
            typeDefinition={rootTypeDefinition!}
            otherTypeDefinitions={otherTypeDefinitions}
            value={formData}
            onChange={onChange}
            validator={validator}
            customizations={customizations}
        />
        {!props.hideSubmitButton
        ? <Row className="mt-3">
            <Col></Col>
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
            <Col></Col>
        </Row> : null}
    </Form>);

}