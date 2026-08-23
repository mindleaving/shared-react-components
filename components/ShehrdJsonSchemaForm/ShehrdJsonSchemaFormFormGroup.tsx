import { FormGroup, FormLabel } from "react-bootstrap";
import { JsonSchemaTypeDefintion, ShehrdJsonSchemaCustomizations, ShehrdJsonSchemaFormValidator } from "../../types/shehrdJsonSchemaFormTypes";
import { Dictionary, Update } from "../../types/frontendTypes";
import { ShehrdJsonSchemaFormControl } from "./ShehrdJsonSchemaFormControl";
import { useMemo } from "react";
import { uuid } from "../../helpers/uuid";
import { JsonSchemaPrimitiveType } from "../../types/shehrdJsonSchemaFormEnums";

interface ShehrdJsonSchemaFormFormGroupProps {
    propertyName: string;
    property: JsonSchemaTypeDefintion;
    otherTypeDefinitions: Dictionary<JsonSchemaTypeDefintion>;
    value?: unknown; 
    onChange: (update: Update<unknown | undefined>) => void;
    validator: ShehrdJsonSchemaFormValidator;
    required?: boolean;
    customizations?: ShehrdJsonSchemaCustomizations;
}

export const ShehrdJsonSchemaFormFormGroup = (props: ShehrdJsonSchemaFormFormGroupProps) => {

    const { propertyName, property, required: requiredFromSchema, customizations } = props;

    const id = useMemo(() => uuid(), []);
    const required = customizations?.required ?? requiredFromSchema;

    if(customizations?.hide) {
        return null;
    }

    return (<FormGroup className="mb-2" controlId={id}>
        {property.type !== JsonSchemaPrimitiveType.boolean
        ? <FormLabel
            className="mb-0"
        >
            {property.title ?? propertyName}{required ? '*' : ''}
        </FormLabel> : null}
        <ShehrdJsonSchemaFormControl
            {...props}
        />
    </FormGroup>);

}