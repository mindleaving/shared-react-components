import { ArrayFieldTemplateProps } from "@rjsf/utils";
import { Accordion, Button, FormGroup, FormLabel } from "react-bootstrap"
import { resolveText } from "../../helpers/Globalizer"

export interface AccordionArrayFieldTemplateOptions {
    displayFunc?: (item: any) => string;
}
export const AccordionArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {

    const options = props.uiSchema?.["ui:options"] as AccordionArrayFieldTemplateOptions;
    const displayFunc = options?.displayFunc;

    return (
    <FormGroup>
        <FormLabel>{props.title}</FormLabel>
        <Accordion className="accordion-card" defaultActiveKey='0' key={props.formData.id}>
            {props.items.map((item,index) => {
                const customTitle = displayFunc ? displayFunc(props.formData[index]) : undefined;
                return (<Accordion.Item 
                    key={index} 
                    eventKey={index + ""}
                    className="my-2 border border-secondary"
                >
                    <Accordion.Header>
                        {customTitle ? customTitle : resolveText("ItemX").replace("{0}", index + '')}
                    </Accordion.Header>
                    <Accordion.Body>
                        {item.children}
                        <Button 
                            variant="danger" 
                            className="mt-2" 
                            onClick={() => item.onDropIndexClick(index)()}
                        >
                            <i className="fa fa-trash" /> {resolveText("Delete")}
                        </Button>
                    </Accordion.Body>
                </Accordion.Item>
            )})}
        </Accordion>
        {props.canAdd 
        ? <Button 
            className='d-block m-2' 
            size="sm" 
            onClick={props.onAddClick}
        >
            {resolveText("Add")}
        </Button> : null}
    </FormGroup>);
}