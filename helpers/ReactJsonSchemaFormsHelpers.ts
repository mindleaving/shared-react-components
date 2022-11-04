import { WidgetProps } from "@rjsf/core";
import { resolveText } from "./Globalizer";
import { loadObject } from "./LoadingHelpers";
import { isEmptyObject } from "./ObjectHelpers";
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

export const buildWidgetProps = (item: any, itemsWidgetOptions: any): WidgetProps => {
    return {
        autofocus: item.props.autofocus,
        disabled: item.props.disabled,
        formContext: undefined,
        id: item.props.idSchema.$id,
        label: '',
        multiple: false,
        onBlur: item.props.onBlur,
        onChange: item.props.onChange,
        onFocus: item.props.onFocus,
        options: itemsWidgetOptions,
        placeholder: '',
        rawErrors: item.props.rawErrors,
        readonly: item.props.readonly,
        registry: item.props.registry,
        required: item.props.required,
        schema: item.props.schema,
        uiSchema: item.props.uiSchema,
        value: !isEmptyObject(item.props.formData) ? item.props.formData : undefined
    };
}