import { ArrayFieldTemplateProps } from "@rjsf/utils"
import { Accordion, Button, Row, Col, FormGroup, FormLabel } from "react-bootstrap"
import { resolveText } from "../../helpers/Globalizer"
import { ReactNode } from "react";

export interface AccordionArrayFieldTemplateOptions {
    displayFunc?: (item: any) => string;
    buttons?: ReactNode;
    overAccordionNode?: ReactNode;
    underAccordionNode?: ReactNode;
}
export const AccordionArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {

    const options = props.uiSchema?.["ui:options"] as AccordionArrayFieldTemplateOptions;
    const displayFunc = options?.displayFunc;
    const buttons = options?.buttons;

    return (<>
    <hr />
    <FormGroup>
        <FormLabel>
            <Row>
                <Col><h5>{props.title}</h5></Col>
                {buttons
                ? <Col xs="auto">
                    {buttons}
                </Col> : null}
            </Row>
        </FormLabel>
        {options?.overAccordionNode}
        <Accordion className="accordion-card" key={props.formData.id}>
            {props.items.map((item,index) => {
                const customTitle = displayFunc ? displayFunc(props.formData[index]) : undefined;
                return (<Accordion.Item 
                    key={item.key}
                    eventKey={index + ""}
                    className="my-2 border border-secondary"
                >
                    <Accordion.Button as="div" className={item.hasMoveUp || item.hasMoveDown ? `clickable py-2` : 'clickable'}>
                        <Row className="align-items-center w-100 pe-3">
                            <Col>
                                {customTitle ? customTitle : resolveText("ItemX").replace("{0}", index + '')}
                            </Col>
                            {item.hasMoveUp && index > 0 ?
                            <Col xs="auto" className="px-1">
                                <Button
                                    onClick={e => {
                                        e.stopPropagation();
                                        item.onReorderClick(index, index-1)();
                                    }}
                                    variant="outline-primary"
                                >
                                    <i className="fa fa-arrow-up" />
                                </Button>
                            </Col> : null}
                            {item.hasMoveDown && index + 1 < props.items.length
                            ? <Col xs="auto" className="px-1">
                                 <Button
                                    onClick={e => {
                                        e.stopPropagation();
                                        item.onReorderClick(index, index+1)();
                                    }}
                                    variant="outline-primary"
                                >
                                    <i className="fa fa-arrow-down" />
                                </Button>
                            </Col> : null}
                        </Row>
                    </Accordion.Button>
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
        {options?.underAccordionNode}
    </FormGroup>
    <hr />
    </>);
}