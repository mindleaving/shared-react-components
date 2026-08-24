import { JSX, ReactNode } from "react";
import { Dictionary, IdAutocompleteProps, Update } from "./frontendTypes";
import { JsonSchemaPrimitiveType, ShehrdJsonSchemaFormArrayStyle } from './shehrdJsonSchemaFormEnums';

export interface JsonSchema {
    $id?: string;
    $schema?: string;
    title: string;
    definitions?: Dictionary<JsonSchemaTypeDefintion>;
    allOf?: JsonSchemaTypeDefintion[];
}
export type JsonSchemaType = JsonSchemaPrimitiveType | JsonSchemaTypeDefintion;
export interface JsonSchemaTypeDefintion {
    type?: JsonSchemaType | JsonSchemaType[];
    title?: string;
}
export interface TypeReferenceJsonSchemaTypeDefintion extends JsonSchemaTypeDefintion {
    $ref: string;
}
export interface CompositeJsonSchemaTypeDefintion extends JsonSchemaTypeDefintion {
    allOf: JsonSchemaTypeDefintion[];
}
export interface ObjectJsonSchemaTypeDefintion extends JsonSchemaTypeDefintion {
    type: "object";
    "x-abstract"?: boolean;
    required?: string[];
    properties: Dictionary<JsonSchemaTypeDefintion>;
}
export interface ArrayJsonSchemaTypeDefintion extends JsonSchemaTypeDefintion {
    type: "array";
    items: JsonSchemaTypeDefintion;
    minItems?: number;
    maxItems?: number;
}
export interface EnumJsonSchemaTypeDefintion extends JsonSchemaTypeDefintion {
    type: "string";
    description?: string;
    "x-enumNames": string[];
    enum: string[];
}
export interface StringJsonSchemaTypeDefintion {
    type: "string";
    title?: string;
    format?: "date-time" | "date" | "time" | "duration" | "email";
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: string[];
}
export interface NumericJsonSchemaTypeDefinition {
    type: "integer" | "number";
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
}
export interface ShehrdJsonSchemaCustomizations {

    // Nested property customizations
    properties?: Dictionary<ShehrdJsonSchemaCustomizations>;

    // Flags
    hide?: boolean;
    required?: boolean;
    disabled?: boolean;
    as?: "textarea";
    autofocus?: boolean;
    size?: "sm" | "lg";
    initiallyActiveOptionalProperties?: string[];

    // Customn form control
    formControl?: (props: ShehrdJsonSchemaCustomFormControlProps) => JSX.Element;
    formControlOptions?: ShehrdJsonSchemaFormControlOptions;

    // Array customizations
    arrayStyle?: ShehrdJsonSchemaFormArrayStyle;
    itemTitleFormatter?: (item: any) => string | undefined;
    items?: ShehrdJsonSchemaCustomizations;
    itemCreator?: () => any;
    arrayActionButtons?: ReactNode[];
    

    // Enum customizations
    enumName?: string;
}
export interface ShehrdJsonSchemaSharedFormControlProps {
    propertyName: string;
    property: JsonSchemaTypeDefintion;
    otherTypeDefinitions: Dictionary<JsonSchemaTypeDefintion>;
    value?: unknown; 
    onChange: (update: Update<unknown | undefined>) => void;
    validator: ShehrdJsonSchemaFormValidator;
    required?: boolean; // The only customization that should be on this props (because it is derived from JSON schema)
}
export interface ShehrdJsonSchemaCustomFormControlProps extends ShehrdJsonSchemaSharedFormControlProps, ShehrdJsonSchemaFormControlOptions {
}
export interface ShehrdJsonSchemaFormControlOptions {
    [key: string]: any;
}
export type ShehrdJsonSchemaFormValidator = (type: JsonSchemaPrimitiveType | JsonSchemaTypeDefintion, item: any) => boolean;