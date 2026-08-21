import { JSX, ReactNode } from "react";
import { Dictionary, Update } from "./frontendTypes";
import { JsonSchemaPrimitiveType } from './shehrdJsonSchemaFormEnums';

export interface JsonSchema {
    $id?: string;
    $schema?: string;
    title: string;
    definitions?: Dictionary<JsonSchemaTypeDefintion>;
    allOf?: JsonSchemaTypeDefintion[];
}
export interface JsonSchemaTypeDefintion {
    type: JsonSchemaPrimitiveType | JsonSchemaPrimitiveType[];
    title?: string;
}
export interface ObjectJsonSchemaTypeDefintion extends JsonSchemaTypeDefintion {
    type: "object";
    "x-abstract"?: boolean;
    required?: string[];
    properties: Dictionary<JsonSchemaTypeDefintion>;
}
export interface TypeReferenceJsonSchemaTypeDefintion extends JsonSchemaTypeDefintion {
    $ref: string;
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
}
export interface NumericJsonSchemaTypeDefinition {
    type: "integer" | "number";
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
}
export interface ShehrdJsonSchemaCustomizations {
    [propertyName: string]: ShehrdJsonSchemaCustomizations;
    formControl?: <T,>(
        value: T | undefined, 
        onChange: (newValue: T | undefined) => void, 
        options?: ShehrdJsonSchemaFormControlOptions
    ) => JSX.Element;
    options?: ShehrdJsonSchemaFormControlOptions;
}
export interface ShehrdJsonSchemaFormControlOptions {
    [key: string]: any;
}