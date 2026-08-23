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
        return Object.keys(typeDefinition.properties ?? {});
    }, [ typeDefinition ]);
    const mandatoryPropertyNames = useMemo(() => {
        const schemaRequired = typeDefinition?.required ?? [];
        const customizationRequired = customizations?.properties
            ? Object.entries(customizations.properties)
                .filter(([_,propertyCustomization]) => propertyCustomization.required ?? false)
                .map(([propertyName]) => propertyName)
            : [];
        return distinct(schemaRequired.concat(customizationRequired));
    }, [ typeDefinition, customizations ]);
    const optionalPropertyNames = useMemo(() => 
        allPropertyNames.filter(propertyName => !mandatoryPropertyNames.includes(propertyName)), 
    [ allPropertyNames, mandatoryPropertyNames ]);
    const mandatoryProperties = useMemo(() => {
        if(!typeDefinition) {
            return {};
        }
        return toDictionary(
            mandatoryPropertyNames,
            propertyName => propertyName,
            propertyName => typeDefinition.properties[propertyName]
        );
    }, [ typeDefinition, mandatoryPropertyNames ]);
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
                customizations={customizations?.properties ? customizations.properties[propertyName] : undefined}
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