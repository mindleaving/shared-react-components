import { FormGroup, FormLabel } from "react-bootstrap";
import { JsonSchemaTypeDefintion, ShehrdJsonSchemaCustomizations } from "../../types/shehrdJsonSchemaFormTypes";
import { Dictionary, Update } from "../../types/frontendTypes";
import { ShehrdJsonSchemaFormControl } from "./ShehrdJsonSchemaFormControl";

interface ShehrdJsonSchemaFormFormGroupProps {
    propertyName: string;
    property: JsonSchemaTypeDefintion;
    otherTypeDefinitions: Dictionary<JsonSchemaTypeDefintion>;
    value?: any; 
    onChange: (update: Update<any>) => void;
    validator: (typeName: string, item: any) => boolean;
    required?: boolean;
    customizations?: ShehrdJsonSchemaCustomizations;
}

export const ShehrdJsonSchemaFormFormGroup = (props: ShehrdJsonSchemaFormFormGroupProps) => {

    const { propertyName, property, required } = props;

    return (<FormGroup>
        <FormLabel>{property.title ?? propertyName}{required ? '*' : ''}</FormLabel>
        <ShehrdJsonSchemaFormControl
            {...props}
        />
    </FormGroup>);

}