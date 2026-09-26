import { Card, Col, FormCheck, FormControl, FormSelect, Row } from "react-bootstrap";
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
import { SelectFormControl } from "../FormControls/SelectFormControl";
import { resolveText } from "../../helpers/Globalizer";

interface ShehrdJsonSchemaFormControlProps extends ShehrdJsonSchemaSharedFormControlProps {
    customizations?: ShehrdJsonSchemaCustomizations;
    isArrayItem?: boolean;
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

    const [ resolvedTypeDefinition, typeName ] = useMemo(() => {
        const [ resolvedTypeDefinition, resolvedTypeName ] = resolveJsonTypeDefinition(property, otherTypeDefinitions);
        return [ resolvedTypeDefinition, resolvedTypeName ];
    }, [ property ]);
    const propertyType = useMemo(() => getFirstNonNullType(resolvedTypeDefinition), [ resolvedTypeDefinition ]);
    const title = property.title;
    const required = customizations?.required ?? requiredFromSchema;
    const disabled = customizations?.disabled;
    const autofocus = customizations?.autofocus;
    const size = customizations?.size;
    const customFormControlProps = useMemo(() => 
        ({ ...props, ...customizations?.formControlOptions }), 
    [ props, customizations?.formControlOptions]);
    const label = useMemo(() => `${property.title ?? propertyName}${(required ? '*' : '')}`, [ property.title, propertyName ]);

    if(!!customizations?.formControl) {
        return customizations.formControl(customFormControlProps);
    }

    if(!propertyType) {
        return null;
    }

    switch(propertyType) {
        case JsonSchemaPrimitiveType.string:
        {
            const stringProperty = resolvedTypeDefinition as StringJsonSchemaTypeDefintion;
            const stringValue = (value as string | null | undefined) ?? undefined;
            const enumValues = stringProperty["x-enumNames"] ?? stringProperty.enum;
            if(!!enumValues) {
                const enumName = typeName ?? customizations?.enumName;
                if(!!enumName) {
                    return (<SelectFormControl
                        enumName={enumName}
                        enumValues={enumValues}
                        required={required}
                        disabled={disabled}
                        value={stringValue}
                        onChange={newValue => onChange(() => newValue)}
                        {...customizations?.formControlOptions}
                    />);
                } else {
                    return (<FormSelect
                        required={required}
                        disabled={disabled}
                        value={stringValue ?? ''}
                        onChange={e => onChange(() => e.target.value)}
                        {...customizations?.formControlOptions}
                    >
                        <option value="">{resolveText("PleaseSelect...")}</option>
                        {enumValues.map(enumValue => (
                            <option key={enumValue} value={enumValue}>{enumValue}</option>
                        ))}
                    </FormSelect>);
                }
            }
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
                        size={size}
                        {...customizations?.formControlOptions}
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
                        size={size}
                        {...customizations?.formControlOptions}
                    />);
                }
                case "time":
                {
                    return (<TimeFormControl
                        required={required}
                        value={stringValue}
                        onChange={time => onChange(() => time)}
                        disabled={disabled}
                        size={size}
                        {...customizations?.formControlOptions}
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
                        autoFocus={autofocus}
                        size={size}
                        {...customizations?.formControlOptions}
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
                size={size}
                {...customizations?.formControlOptions}
            />);
        }
        case JsonSchemaPrimitiveType.boolean:
        {
            const booleanValue = value as boolean | undefined;
            return (<FormCheck
                checked={booleanValue ?? false}
                onChange={e => onChange(() => e.target.checked)}
                label={title ?? propertyName}
                {...customizations?.formControlOptions}
            />)
        }
        case JsonSchemaPrimitiveType.array:
        {
            const arrayDefinition = resolvedTypeDefinition as ArrayJsonSchemaTypeDefintion;
            const [ itemType ] = resolveJsonTypeDefinition(arrayDefinition.items, otherTypeDefinitions);
            const itemCustomization = customizations ? customizations["items"] as ShehrdJsonSchemaCustomizations : undefined;
            const arrayItems = (value ?? []) as any[];
            const useAccordion = !!customizations?.arrayStyle
                ? customizations.arrayStyle === ShehrdJsonSchemaFormArrayStyle.Accordion
                : itemType.type === JsonSchemaPrimitiveType.object;
            if(useAccordion) {
                return (<>
                    <AccordionListFormControl
                        label={label}
                        items={arrayItems}
                        titleFormatter={customizations?.itemTitleFormatter ?? (() => undefined)}
                        itemCreator={customizations?.itemCreator ?? (() => ({}))}
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
                            isArrayItem
                        />)}
                        onChange={update => onChange(state => update(state as any[] ?? []))}
                        isValid={item => validator(itemType, item)}
                        additionalActionButtons={customizations?.arrayActionButtons}
                    />
                    <hr />
                </>);
            } else {
                return (<>
                    <Row className="align-items-center">
                        <Col>{label}</Col>
                        {(customizations?.arrayActionButtons ?? []).map((button,buttonIndex) => (
                            <Col key={buttonIndex} xs="auto">
                                {button}
                            </Col>
                        ))}
                    </Row>
                    <BareArrayListFormControl
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
                        itemCreator={customizations?.itemCreator ?? (() => undefined)}
                    />
                    <hr />
                </>);
            }
        }
        case JsonSchemaPrimitiveType.object:
        {
            const objectValue = value ?? {};
            const formSection = (<ShehrdJsonSchemaSubForm
                typeDefinition={resolvedTypeDefinition as ObjectJsonSchemaTypeDefintion}
                otherTypeDefinitions={props.otherTypeDefinitions}
                value={objectValue}
                onChange={update => onChange(state => update(state as any ?? {}))}
                validator={validator}
                customizations={customizations}
            />);
            if(props.isArrayItem) {
                return formSection;
            }
            return (<Card>
                <Card.Header>
                    <Card.Title>{title ?? propertyName}{required ? '*' : ''}</Card.Title>
                </Card.Header>
                <Card.Body>
                    {formSection}
                </Card.Body>
            </Card>);
        }
        default:
            throw new Error(`Unknown JSON property type '${propertyType}'`);
    }

}