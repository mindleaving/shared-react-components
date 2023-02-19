import { ArrayFieldTemplateProps } from "@rjsf/utils";
import { Accordion, Button } from "react-bootstrap"
import { resolveText } from "../../helpers/Globalizer"

export const AccordionArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {

    return (
    <>
        {props.title}
        <Accordion className="accordion-card" defaultActiveKey='0' key={props.formData.id}>
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