import { JSX } from "react/jsx-runtime";
import { Dictionary, IdAutocompleteProps } from "../types/frontendTypes";
import { JsonSchemaPrimitiveType } from "../types/shehrdJsonSchemaFormEnums";
import { ObjectJsonSchemaTypeDefintion, JsonSchemaTypeDefintion, TypeReferenceJsonSchemaTypeDefintion, ShehrdJsonSchemaCustomFormControlProps, JsonSchemaType, ShehrdJsonSchemaCustomizations } from "../types/shehrdJsonSchemaFormTypes";
import { distinct } from "./CollectionHelpers";
import { ShehrdJsonSchemaIdAutocompleteWrapper } from "../components/ShehrdJsonSchemaForm/ShehrdJsonSchemaIdAutocompleteWrapper";

const mergeObjectJsonSchemaTypeDefinitions = (a: ObjectJsonSchemaTypeDefintion, b: ObjectJsonSchemaTypeDefintion): ObjectJsonSchemaTypeDefintion => {
    return {
        type: "object",
        required: distinct((a.required ?? []).concat(b.required ?? [])),
        properties: {
            ...a.properties ?? {},
            ...b.properties ?? {}
        }
    }
}
export const mergeJsonSchemaTypeDefinitions = (typeDefinitions: JsonSchemaTypeDefintion[], definitions?: Dictionary<JsonSchemaTypeDefintion>) => {
    let mergedTypeDefinition: ObjectJsonSchemaTypeDefintion = {
        type: "object",
        required: [],
        properties: {}
    };
    for (const typeDefinition of typeDefinitions) {
        const [ resolvedTypeDefinition ] = resolveJsonTypeDefinition(typeDefinition, definitions ?? {});
        const objectTypeDefinition = resolvedTypeDefinition as ObjectJsonSchemaTypeDefintion;
        if(!!objectTypeDefinition.type && objectTypeDefinition.type === "object") {
            mergedTypeDefinition = mergeObjectJsonSchemaTypeDefinitions(mergedTypeDefinition, objectTypeDefinition);
            continue
        }
        throw new Error("Unmergable type definition detected");
    }
    return mergedTypeDefinition;
}
export const resolveJsonTypeDefinition = (
    typeDefinition: JsonSchemaTypeDefintion,
    otherTypeDefinitions: Dictionary<JsonSchemaTypeDefintion>): [ typeDefinition: JsonSchemaTypeDefintion, typeName?: string ] => {

    const typeReferenceDefinition = typeDefinition as TypeReferenceJsonSchemaTypeDefintion;
    if(!typeReferenceDefinition.$ref) {
       return [ typeDefinition as JsonSchemaTypeDefintion ]; 
    }
    const referencedTypeName = typeReferenceDefinition.$ref.substring('#/definitions/'.length);
    const referencedType = otherTypeDefinitions[referencedTypeName];
    if(!referencedType) {
        throw new Error(`Could not find referenced JSON schema type '${referencedTypeName}'`);
    }
    const [ nestedReferencedType, nestedTypeName ] = resolveJsonTypeDefinition(referencedType, otherTypeDefinitions);
    return [ nestedReferencedType, nestedTypeName ?? referencedTypeName ];
}
export const getFirstNonNullType = (
    property: JsonSchemaTypeDefintion
): JsonSchemaType | undefined => {
    const typeOrTypeArray = property.type;
    if(!typeOrTypeArray) {
        return undefined;
    }
    if(typeof typeOrTypeArray === "object") {
        let type: JsonSchemaType | undefined;
        if(Array.isArray(typeOrTypeArray)) {
            const typeArray = typeOrTypeArray as JsonSchemaType[];
            type = typeArray.find(x => x != JsonSchemaPrimitiveType.null);
            if(!type) {
                return undefined;
            }
        } else {
            type = typeOrTypeArray;
        }
        return type;
    }
    if(typeof typeOrTypeArray === "string") {
        return typeOrTypeArray;
    }
    return undefined; // or throw?
}
export const buildIdAutocomplete = (idAutocomplete: (props: IdAutocompleteProps) => JSX.Element) => {
    return (props: ShehrdJsonSchemaCustomFormControlProps) => ShehrdJsonSchemaIdAutocompleteWrapper({ props, idAutocomplete });
}
export const isHidden = (propertyName: string, customizations: ShehrdJsonSchemaCustomizations | undefined) => {
    if(!customizations?.properties) {
        return false;
    }
    const propertyCustomization = customizations.properties[propertyName];
    if(!propertyCustomization) {
        return false;
    }
    return (propertyCustomization as ShehrdJsonSchemaCustomizations).hide;
}
export const HideJsonSchemaProperty: ShehrdJsonSchemaCustomizations = { hide: true };