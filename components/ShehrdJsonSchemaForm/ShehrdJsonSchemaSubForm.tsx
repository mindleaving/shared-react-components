import { useMemo, useState } from "react";
import { Dictionary, IndexableObject, Update } from "../../types/frontendTypes";
import { JsonSchemaTypeDefintion, ObjectJsonSchemaTypeDefintion, ShehrdJsonSchemaCustomizations, ShehrdJsonSchemaFormValidator } from "../../types/shehrdJsonSchemaFormTypes";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { resolveText } from "../../helpers/Globalizer";
import { toDictionary } from "../../helpers/Transformations";
import { ShehrdJsonSchemaFormFormGroup } from "./ShehrdJsonSchemaFormFormGroup";
import { isHidden } from "../../helpers/ShehrdJsonSchemaFormHelpers";
import { distinct } from "../../helpers/CollectionHelpers";

interface ShehrdJsonSchemaSubFormProps<T> {
    typeDefinition: ObjectJsonSchemaTypeDefintion;
    otherTypeDefinitions: Dictionary<JsonSchemaTypeDefintion>;
    value: T;
    onChange: (update: Update<T>) => void;
    validator: ShehrdJsonSchemaFormValidator;
    customizations?: ShehrdJsonSchemaCustomizations;
}

export const ShehrdJsonSchemaSubForm = <T,>(props: ShehrdJsonSchemaSubFormProps<T>) => {

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
    const [ activeOptionalPropertyNames, setActiveOptionalPropertyNames ] = useState<string[]>(() => {
        const nonEmptyValues = optionalPropertyNames.filter(propertyName => !!(value as IndexableObject)[propertyName]);
        return distinct(nonEmptyValues.concat(customizations?.initiallyActiveOptionalProperties ?? []));
    });
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
        optionalPropertyNames.filter(propertyName => !activeOptionalPropertyNames.includes(propertyName) && !isHidden(propertyName, customizations)),
    [ optionalPropertyNames, activeOptionalPropertyNames, customizations ]);
    const inactiveProperties = useMemo(() => {
        return toDictionary(
            inactivePropertyNames,
            propertyName => propertyName,
            propertyName => typeDefinition.properties[propertyName]
        );
    }, [ inactivePropertyNames, typeDefinition ])

    return (<>
        {Object.entries(activeProperties).map(([propertyName, property]) => (
            <ShehrdJsonSchemaFormFormGroup
                key={propertyName}
                propertyName={propertyName}
                property={property}
                otherTypeDefinitions={otherTypeDefinitions}
                required={mandatoryPropertyNames.includes(propertyName)}
                value={(value as any)[propertyName]}
                onChange={update => onChange(state => ({
                    ...state,
                    [propertyName]: update((state as any)[propertyName])
                }))}
                validator={validator}
                customizations={customizations ? customizations[propertyName] as ShehrdJsonSchemaCustomizations : undefined}
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
                    {inactiveProperties[propertyName]?.title ?? propertyName}
                </Dropdown.Item>
            ))}
        </DropdownButton> : null}
    </>);

}