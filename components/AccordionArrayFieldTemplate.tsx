import { ArrayFieldTemplateProps, WidgetProps } from "@rjsf/core"
import { Accordion, Button } from "react-bootstrap"
import { resolveText } from "../helpers/Globalizer"
import { isEmptyObject } from "../helpers/ObjectHelpers";

export const AccordionArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
    const hasItemsWidget = props.uiSchema.items && props.uiSchema.items["ui:widget"];
    const itemsWidgetOptions = hasItemsWidget ? props.uiSchema.items["ui:options"] : undefined;

    const buildWidgetProps = (item: any): WidgetProps => {
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
    };
    const Widget = hasItemsWidget ? props.uiSchema.items["ui:widget"] : undefined;
    return (
    <>
        {props.TitleField(props as any)}
        {props.DescriptionField(props as any)}
        <Accordion className="accordion-card" key={props.formData.id}>
            {props.items.map((item,index) => (
                <Accordion.Item key={index} eventKey={index + ""}>
                    <Accordion.Header>
                        {resolveText("ItemX").replace("{0}", index + '')}
                    </Accordion.Header>
                    <Accordion.Body>
                        {hasItemsWidget ?
                        <Widget 
                            {...buildWidgetProps(item.children)}
                        />
                        : item.children}
                        <Button variant="danger" className="mt-2" onClick={() => item.onDropIndexClick(index)()}>{resolveText("Delete")}</Button>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
        {props.canAdd ? <Button className='m-2' size="sm" onClick={props.onAddClick}>{resolveText("Add")}</Button> : null}
    </>
    )
}