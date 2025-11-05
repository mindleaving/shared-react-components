import { useCallback } from "react";
import { FieldPathId, FieldPathList, ErrorSchema } from "@rjsf/utils";
import { resolveText } from "./Globalizer";
import { loadObject } from "./LoadingHelpers";
import { translateSchema } from "./SchemaTranslator";

export const loadAndTranslateSchema = async (
    typeName: string,
    setSchema: (schema: {}) => void,
    setIsLoading: (isLoading: boolean) => void) => {
    setIsLoading(true);
    await loadObject(
        `api/schemas/${typeName}`,
        {},
        resolveText("GenericTypeCreateEditPage_CoultNotLoadSchema"),
        item => {
            const translatedSchema = translateSchema(item);
            delete translatedSchema.$schema;
            setSchema(translatedSchema);
        },
        undefined,
        () => setIsLoading(false)
    );
}
export const Hide = {
    "ui:widget": "hidden"
}
export const HideLabel = {
    "ui:options": {
        label: false
    }
}
export const useRjsfFieldOnChange = <T>(
    fieldPathId: FieldPathId, 
    onChange: (newValue: T, path: FieldPathList, es?: ErrorSchema<any> | undefined, id?: string) => void): (newValue: T) => void => {
        
    const memorizedOnChangeWithPath = useCallback((newValue: T) => {
        onChange(newValue, [ ...fieldPathId.path ])
    }, [ fieldPathId, onChange ]);
    return memorizedOnChangeWithPath;
}