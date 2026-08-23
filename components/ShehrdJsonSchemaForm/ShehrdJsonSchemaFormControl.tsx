import { Card, FormControl } from "react-bootstrap";
import { JsonSchemaPrimitiveType, ShehrdJsonSchemaFormArrayStyle } from "../../types/shehrdJsonSchemaFormEnums";
import { ArrayJsonSchemaTypeDefintion, ObjectJsonSchemaTypeDefintion, StringJsonSchemaTypeDefintion, ShehrdJsonSchemaCustomizations, ShehrdJsonSchemaSharedFormControlProps } from "../../types/shehrdJsonSchemaFormTypes";
import { AccordionListFormControl } from "../FormControls/AccordionListFormControl";
import { BareArrayListFormControl } from "../FormControls/BareArrayListFormControl";
import { NumericFormControl } from "../FormControls/NumericFormControl";
import { useMemo } from "react";
import { getFirstNonNullType, resolveJsonTypeDefinition } from "../../helpers/ShehrdJsonSchemaFormHelpers";
import { ShehrdJsonSchemaSubForm } from "./ShehrdJsonSchemaSubForm";
import { DateFormControl } from "../FormControls/DateFormControl";
import { toDateOnly } from "../../helpers/DateHelpers";
import { TimeFormControl } from "../FormControls/TimeFormControl";

interface ShehrdJsonSchemaFormControlProps extends ShehrdJsonSchemaSharedFormControlProps {
    customizations?: ShehrdJsonSchemaCustomizations;
}

export const ShehrdJsonSchemaFormControl = (props: ShehrdJsonSchemaFormControlProps) => {

    const {
        propertyName, 
        property, 
        otherTypeDefinitions, 
        value, 
        onChange, 
        validator, 
        required: requiredFromSchema,
        customizations 
    } = props;

    const propertyType = useMemo(() => getFirstNonNullType(property.type, otherTypeDefinitions), [ property ]);
    const required = customizations?.required ?? requiredFromSchema;
    const disabled = customizations?.disabled;
    const customFormControlProps = useMemo(() => ({ ...props, ...customizations?.formControlOptions }), [ props, customizations?.formControlOptions])

    if(customizations?.formControl) {
        return customizations.formControl(customFormControlProps);
    }

    if(!propertyType) {
        return null;
    }

    switch(propertyType) {
        case JsonSchemaPrimitiveType.string:
        {
            const stringProperty = property as StringJsonSchemaTypeDefintion;
            const stringValue = (value as string | null | undefined) ?? undefined;
            switch(stringProperty.format) {
                case "date":
                {
                    return (<DateFormControl
                        required={required}
                        value={stringValue}
                        onChange={date => {
                            if(!date) {
                                onChange(() => undefined);
                            } else {
                                const dateOnly = toDateOnly(new Date(date));
                                onChange(() => dateOnly);
                            }
                        }}
                        disabled={disabled}
                    />);
                }
                case "date-time":
                {
                    return (<DateFormControl
                        enableTime
                        required={required}
                        value={stringValue}
                        onChange={date => onChange(() => date)}
                        disabled={disabled}
                    />);
                }
                case "time":
                {
                    return (<TimeFormControl
                        required={required}
                        value={stringValue}
                        onChange={time => onChange(() => time)}
                        disabled={disabled}
                    />);
                }
                // case "duration":
                // {
                //     return (<DateRangeFormControl
                //         enableTime
                //     />)
                // }
                
                default:
                {
                    return (<FormControl
                        required={required}
                        as={customizations?.as}
                        defaultValue={stringValue ?? ''}
                        onBlur={e => onChange(() => e.target.value as any)}
                        disabled={disabled}
                    />);
                }
            }
        }
        case JsonSchemaPrimitiveType.number:
        case JsonSchemaPrimitiveType.integer:
        {
            const numericValue = value as number | null | undefined;
            return (<NumericFormControl
                required={required}
                value={numericValue ?? undefined}
                onChange={newValue => onChange(() => newValue as any)}
                disabled={disabled}
            />);
        }
        case JsonSchemaPrimitiveType.array:
        {
            const arrayDefinition = property as ArrayJsonSchemaTypeDefintion;
            const itemType = resolveJsonTypeDefinition(arrayDefinition.items, otherTypeDefinitions);
            const itemCustomization = customizations ? customizations["items"] as ShehrdJsonSchemaCustomizations : undefined;
            const arrayItems = (value ?? []) as any[];
            const useAccordion = !!customizations?.arrayStyle
                ? customizations.arrayStyle === ShehrdJsonSchemaFormArrayStyle.Accordion
                : itemType.type === JsonSchemaPrimitiveType.object;
            if(useAccordion) {
                return (<AccordionListFormControl
                    items={arrayItems}
                    titleFormatter={customizations?.itemTitleFormatter ?? (x => x + '')}
                    itemCreator={() => ({})}
                    itemFormControlBuilder={(item,itemOnChange,itemIndex) => (<ShehrdJsonSchemaFormControl 
                        key={itemIndex}
                        required
                        propertyName={`${propertyName}-${itemIndex}`}
                        property={itemType}
                        otherTypeDefinitions={otherTypeDefinitions}
                        value={item}
                        onChange={itemOnChange}
                        validator={validator}
                        customizations={itemCustomization}
                    />)}
                    onChange={update => onChange(state => update(state as any[] ?? []))}
                    isValid={item => validator(itemType, item)}
                />)
            } else {
                return (<BareArrayListFormControl
                    items={arrayItems}
                    itemFormControlBuilder={(item,itemOnChange,itemIndex) => (<ShehrdJsonSchemaFormControl
                        key={itemIndex}
                        required
                        propertyName={`${propertyName}-${itemIndex}`}
                        property={itemType}
                        otherTypeDefinitions={otherTypeDefinitions}
                        value={item}
                        onChange={update => itemOnChange(update(item))}
                        validator={validator}
                        customizations={itemCustomization}
                    />)}
                    onChange={update => onChange(state => update(state as any[] ?? []))}
                />)
            }
        }
        case JsonSchemaPrimitiveType.object:
        {
            const objectValue = value ?? {};
            return (<Card>
                <Card.Header>
                    <Card.Title>{property.title ?? propertyName}{required ? '*' : ''}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <ShehrdJsonSchemaSubForm
                        typeDefinition={property as ObjectJsonSchemaTypeDefintion}
                        otherTypeDefinitions={props.otherTypeDefinitions}
                        value={objectValue}
                        onChange={update => onChange(state => update(state as any ?? {}))}
                        validator={validator}
                        customizations={customizations}
                    />
                </Card.Body>
            </Card>);
        }
        default:
            throw new Error(`Unknown JSON property type '${propertyType}'`);
    }

}