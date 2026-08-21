import { useMemo, useState } from "react";
import { Dictionary, Update } from "../../types/frontendTypes";
import { JsonSchemaTypeDefintion, ObjectJsonSchemaTypeDefintion, ShehrdJsonSchemaCustomizations } from "../../types/shehrdJsonSchemaFormTypes";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { resolveText } from "../../helpers/Globalizer";
import { toDictionary } from "../../helpers/Transformations";
import { ShehrdJsonSchemaFormFormGroup } from "./ShehrdJsonSchemaFormFormGroup";

interface ShehrdJsonSchemaSubFormProps {
    typeDefinition: ObjectJsonSchemaTypeDefintion;
    otherTypeDefinitions: Dictionary<JsonSchemaTypeDefintion>;
    value: any;
    onChange: (update: Update<any>) => void;
    validator: (typeName: string, item: any) => boolean;
    customizations?: ShehrdJsonSchemaCustomizations;
}

export const ShehrdJsonSchemaSubForm = (props: ShehrdJsonSchemaSubFormProps) => {

    const {
        typeDefinition,
        otherTypeDefinitions,
        value,
        onChange,
        validator,
        customizations
    } = props;

    const allPropertyNames = useMemo(() => {
        if(!typeDefinition) {
            return [];
        }
        return Object.keys(typeDefinition.properties);
    }, [ typeDefinition ]);
    const mandatoryPropertyNames = useMemo(() => typeDefinition?.required ?? [], [ typeDefinition ]);
    const optionalPropertyNames = useMemo(() => 
        allPropertyNames.filter(propertyName => !mandatoryPropertyNames.includes(propertyName)), 
    [ allPropertyNames, mandatoryPropertyNames ]);
    const mandatoryProperties = useMemo(() => {
        if(!typeDefinition) {
            return {};
        }
        return toDictionary(
            typeDefinition.required ?? [],
            propertyName => propertyName,
            propertyName => typeDefinition.properties[propertyName]
        );
    }, [ typeDefinition ]);
    const [ activeOptionalPropertyNames, setActiveOptionalPropertyNames ] = useState<string[]>([]);
    const activeProperties = useMemo(() => {
        if(!typeDefinition) {
            return mandatoryProperties;
        }
        const activeOptionalProperties = toDictionary(
            activeOptionalPropertyNames,
            propertyName => propertyName,
            propertyName => typeDefinition.properties[propertyName]
        );
        return {
            ...mandatoryProperties,
            ...activeOptionalProperties
        };
    }, [ typeDefinition, mandatoryProperties, activeOptionalPropertyNames ]);
    const inactivePropertyNames = useMemo(() => 
        optionalPropertyNames.filter(x => !activeOptionalPropertyNames.includes(x)),
    [ optionalPropertyNames, activeOptionalPropertyNames ]);

    return (<>
        {Object.entries(activeProperties).map(([propertyName, property]) => (
            <ShehrdJsonSchemaFormFormGroup
                key={propertyName}
                propertyName={propertyName}
                property={property}
                otherTypeDefinitions={otherTypeDefinitions}
                required={mandatoryPropertyNames.includes(propertyName)}
                value={value[propertyName]}
                onChange={update => onChange(state => ({
                    ...state,
                    [propertyName]: update(state[propertyName])
                }))}
                validator={validator}
                customizations={customizations ? customizations[propertyName] : undefined}
            />
        ))}
        {inactivePropertyNames.length > 0
        ? <DropdownButton
            title={resolveText("MoreOptions")}
            variant="link"
        >
            {inactivePropertyNames.map(propertyName => (
                <Dropdown.Item 
                    key={propertyName}
                    onClick={() => setActiveOptionalPropertyNames(state => state.concat(propertyName))}
                >
                    {propertyName}
                </Dropdown.Item>
            ))}
        </DropdownButton> : null}
    </>);

}