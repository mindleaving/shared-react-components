import { Card, FormControl } from "react-bootstrap";
import { JsonSchemaPrimitiveType } from "../../types/shehrdJsonSchemaFormEnums";
import { JsonSchemaTypeDefintion, ArrayJsonSchemaTypeDefintion, ObjectJsonSchemaTypeDefintion, StringJsonSchemaTypeDefintion, ShehrdJsonSchemaCustomizations } from "../../types/shehrdJsonSchemaFormTypes";
import { AccordionListFormControl } from "../FormControls/AccordionListFormControl";
import { BareArrayListFormControl } from "../FormControls/BareArrayListFormControl";
import { NumericFormControl } from "../FormControls/NumericFormControl";
import { Dictionary, Update } from "../../types/frontendTypes";
import { useMemo } from "react";
import { getFirstNonNullType } from "../../helpers/ShehrdJsonSchemaFormHelpers";
import { ShehrdJsonSchemaSubForm } from "./ShehrdJsonSchemaSubForm";
import { DateFormControl } from "../FormControls/DateFormControl";
import { toDateOnly } from "../../helpers/DateHelpers";
import { TimeFormControl } from "../FormControls/TimeFormControl";

interface ShehrdJsonSchemaFormControlProps {
    propertyName: string;
    property: JsonSchemaTypeDefintion;
    otherTypeDefinitions: Dictionary<JsonSchemaTypeDefintion>;
    value?: any; 
    onChange: (update: Update<any>) => void;
    validator: (typeName: string, item: any) => boolean;
    required?: boolean;
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
        required,
        customizations 
    } = props;

    const propertyType = useMemo(() => getFirstNonNullType(property.type), [ property ]);

    if(customizations?.formControl) {
        return customizations.formControl(value, onChange, customizations.options);
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
                    />);
                }
                case "date-time":
                {
                    return (<DateFormControl
                        enableTime
                        required={required}
                        value={stringValue}
                        onChange={date => onChange(() => date)}
                    />);
                }
                case "time":
                {
                    return (<TimeFormControl
                        required={required}
                        value={stringValue}
                        onChange={time => onChange(() => time)}
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
                        value={stringValue ?? ''}
                        onChange={e => onChange(() => e.target.value as any)}
                    />);
                }
            }
        }
        case JsonSchemaPrimitiveType.number:
        {
            const numericValue = value as number | null | undefined;
            return (<NumericFormControl
                required={required}
                value={numericValue ?? undefined}
                onChange={newValue => onChange(newValue as any)}
            />);
        }
        case JsonSchemaPrimitiveType.array:
        {
            const arrayDefinition = property as ArrayJsonSchemaTypeDefintion;
            const itemType = getFirstNonNullType(arrayDefinition.items.type);
            const arrayItems = (value ?? []) as any[];
            if(itemType === JsonSchemaPrimitiveType.object) {
                return (<AccordionListFormControl
                    items={arrayItems}
                    titleFormatter={x => x + ''}
                    itemCreator={() => {}}
                    itemFormControlBuilder={(item,itemOnChange,itemIndex) => (<ShehrdJsonSchemaFormControl 
                        required
                        propertyName={`${propertyName}-${itemIndex}`}
                        property={arrayDefinition.items}
                        otherTypeDefinitions={otherTypeDefinitions}
                        value={item}
                        onChange={itemOnChange}
                        validator={validator}
                    />)}
                    onChange={update => onChange(state => update(state ?? []))}
                    isValid={item => validator(itemType, item)}
                />)
            } else {
                return (<BareArrayListFormControl
                    items={arrayItems}
                    itemFormControlBuilder={(item,itemOnChange,itemIndex) => (<ShehrdJsonSchemaFormControl 
                        required
                        propertyName={`${propertyName}-${itemIndex}`}
                        property={arrayDefinition.items}
                        otherTypeDefinitions={otherTypeDefinitions}
                        value={item}
                        onChange={itemOnChange}
                        validator={validator}
                    />)}
                    onChange={update => onChange(state => update(state ?? []))}
                />)
            }
        }
        case JsonSchemaPrimitiveType.object:
        {
            return (<Card>
                <Card.Header>
                    <Card.Title>{property.title ?? propertyName}{required ? '*' : ''}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <ShehrdJsonSchemaSubForm
                        typeDefinition={property as ObjectJsonSchemaTypeDefintion}
                        otherTypeDefinitions={props.otherTypeDefinitions}
                        value={value}
                        onChange={onChange}
                        validator={validator}
                    />
                </Card.Body>
            </Card>);
        }
        default:
            throw new Error(`Unknown JSON property type '${propertyType}'`);
    }

}