import { ArrayFieldTemplateProps } from "@rjsf/utils"
import { Accordion, Button, Row, Col, FormGroup, FormLabel } from "react-bootstrap"
import { resolveText } from "../../helpers/Globalizer"
import { ReactNode } from "react";

export interface AccordionArrayFieldTemplateOptions {
    buttons?: ReactNode;
    overAccordionNode?: ReactNode;
    underAccordionNode?: ReactNode;
}
export const AccordionArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {

    const options = props.uiSchema?.["ui:options"] as AccordionArrayFieldTemplateOptions;
    const buttons = options?.buttons;

    return (<>
    <hr />
    <FormGroup>
        <Row>
            <Col>
                <FormLabel>
                    <h5>{props.title}</h5>
                </FormLabel>
            </Col>
            {buttons
            ? <Col xs="auto">
                {buttons}
            </Col> : null}
        </Row>
        {options?.overAccordionNode}
        <Accordion className="accordion-card" key={props.formData.id}>
            {props.items}
        </Accordion>
        {props.canAdd 
        ? <Button 
            className='d-block m-2' 
            size="sm" 
            onClick={props.onAddClick}
        >
            {resolveText("Add")}
        </Button> : null}
        {options?.underAccordionNode}
    </FormGroup>
    <hr />
    </>);
}