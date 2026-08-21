import { Dictionary } from "../types/frontendTypes";
import { JsonSchemaPrimitiveType } from "../types/shehrdJsonSchemaFormEnums";
import { ObjectJsonSchemaTypeDefintion, JsonSchemaTypeDefintion, TypeReferenceJsonSchemaTypeDefintion } from "../types/shehrdJsonSchemaFormTypes";
import { distinct } from "./CollectionHelpers";

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
        const typeReferenceDefinition = typeDefinition as TypeReferenceJsonSchemaTypeDefintion;
        if(!!typeReferenceDefinition.$ref) {
            const referencedTypeName = typeReferenceDefinition.$ref.substring('#/definitions/'.length);
            if(!definitions || !definitions[referencedTypeName]) {
                throw new Error(`Encountered type reference '${typeReferenceDefinition.$ref}', but reference doesn't exist`);
            }
            const resolvedTypeDefinition = definitions[referencedTypeName] as ObjectJsonSchemaTypeDefintion;
            if(resolvedTypeDefinition.type !== JsonSchemaPrimitiveType.object) {
                throw new Error(`Expected type definition to be of type 'object', but was '${resolvedTypeDefinition.type}'`);
            }
            mergedTypeDefinition = mergeObjectJsonSchemaTypeDefinitions(mergedTypeDefinition, resolvedTypeDefinition);
            continue;
        }
        const objectTypeDefinition = typeDefinition as ObjectJsonSchemaTypeDefintion;
        if(!!objectTypeDefinition.type && objectTypeDefinition.type === "object") {
            mergedTypeDefinition = mergeObjectJsonSchemaTypeDefinitions(mergedTypeDefinition, objectTypeDefinition);
            continue
        }
        throw new Error("Unmergable type definition detected");
    }
    return mergedTypeDefinition;
}
export const getFirstNonNullType = (type: JsonSchemaPrimitiveType | JsonSchemaPrimitiveType[]) => {
    if(typeof type === "object") {
        const typeArray = type as JsonSchemaPrimitiveType[];
        return typeArray.find(x => x != JsonSchemaPrimitiveType.null);
    }
    if(typeof type === "string") {
        return type;
    }
    return undefined; // or throw?
}