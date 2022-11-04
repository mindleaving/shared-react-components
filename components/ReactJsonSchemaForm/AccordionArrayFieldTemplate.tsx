import { ArrayFieldTemplateProps } from "@rjsf/core"
import { Accordion, Button } from "react-bootstrap"
import { resolveText } from "../../helpers/Globalizer"
import { buildWidgetProps } from "../../helpers/ReactJsonSchemaFormsHelpers";

export const AccordionArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
    const hasItemsWidget = props.uiSchema.items && props.uiSchema.items["ui:widget"];
    const itemsWidgetOptions = hasItemsWidget ? props.uiSchema.items["ui:options"] : undefined;

    const Widget = hasItemsWidget ? props.uiSchema.items["ui:widget"] : undefined;
    return (
    <>
        {props.TitleField(props as any)}
        {props.DescriptionField(props as any)}
        <Accordion className="accordion-card" key={props.formData.id}>
            {props.items.map((item,index) => (
                <Accordion.Item 
                    key={index} 
                    eventKey={index + ""}
                    className="my-2 border border-secondary"
                >
                    <Accordion.Header>
                        {resolveText("ItemX").replace("{0}", index + '')}
                    </Accordion.Header>
                    <Accordion.Body>
                        {hasItemsWidget ?
                        <Widget 
                            {...buildWidgetProps(item.children, itemsWidgetOptions)}
                        />
                        : item.children}
                        <Button 
                            variant="danger" 
                            className="mt-2" 
                            onClick={() => item.onDropIndexClick(index)()}
                        >
                            <i className="fa fa-trash" /> {resolveText("Delete")}
                        </Button>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
        {props.canAdd 
        ? <Button 
            className='m-2' 
            size="sm" 
            onClick={props.onAddClick}
        >
            {resolveText("Add")}
        </Button> : null}
    </>);
}