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
        () => {},
        () => setIsLoading(false)
    );
}
export const Hide = {
    "ui:widget": "hidden"
}