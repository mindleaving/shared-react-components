import { RJSFSchema } from "@rjsf/utils";
import CanvasDrawWidget from "../../sharedHealthComponents/components/ReactJsonSchemaForm/Widgets/CanvasDrawWidget";

export const buildUiSchema = (questionnaireSchema: RJSFSchema): RJSFSchema => {
    const uiSchema: RJSFSchema = {};
    if(!questionnaireSchema.properties) {
        return uiSchema;
    }
    for (const [propertyName,propertySchema] of Object.entries(questionnaireSchema.properties))
    {
        if((propertySchema as any).type?.toLowerCase() === 'image-annotation') {
            uiSchema[propertyName] = {
                "ui:widget": CanvasDrawWidget,
                "ui:options": { imgSrc: (propertySchema as any).imageBase64 }
            }
        }
    }
    return uiSchema;
}