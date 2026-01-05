import { ArrayFieldItemTemplateProps, GlobalUISchemaOptions, UiSchema } from "@rjsf/utils";
import { Accordion, Row, Col, Button } from "react-bootstrap";
import { resolveText } from "../../helpers/Globalizer";

export interface AccordionCardArrayFieldItemTemplateUiSchema extends UiSchema {
    "ui:itemTitle"?: string;
    "ui:options": GlobalUISchemaOptions
}

export const AccordionCardArrayFieldItemTemplate = (props: ArrayFieldItemTemplateProps) => {

    const { 
        children, 
        buttonsProps, 
        uiSchema, 
        index, 
        totalItems: totalItemsCount,
        itemKey
    } = props;

    const customUiSchema = uiSchema as AccordionCardArrayFieldItemTemplateUiSchema;
    const customTitle = customUiSchema?.["ui:itemTitle"];

    return (<Accordion.Item
        eventKey={index + ""}
        className="my-2 border border-secondary"
        data-rjsf-itemkey={itemKey}
    >
        <Accordion.Button as="div" className={buttonsProps.hasMoveUp || buttonsProps.hasMoveDown ? `clickable py-2` : 'clickable'}>
            <Row className="align-items-center w-100 pe-3">
                <Col>
                    {customTitle ? customTitle : resolveText("ItemX").replace("{0}", (index + 1) + '')}
                </Col>
                {buttonsProps.hasMoveUp && index > 0 ?
                <Col xs="auto" className="px-1">
                    <Button
                        onClick={e => {
                            e.stopPropagation();
                            buttonsProps.onMoveUpItem();
                        }}
                        variant="outline-primary"
                    >
                        <i className="fa fa-arrow-up" />
                    </Button>
                </Col> : null}
                {buttonsProps.hasMoveDown && index + 1 < totalItemsCount
                ? <Col xs="auto" className="px-1">
                        <Button
                        onClick={e => {
                            e.stopPropagation();
                            buttonsProps.onMoveDownItem();
                        }}
                        variant="outline-primary"
                    >
                        <i className="fa fa-arrow-down" />
                    </Button>
                </Col> : null}
            </Row>
        </Accordion.Button>
        <Accordion.Body>
            {children}
            <Button 
                variant="danger" 
                className="mt-2" 
                onClick={buttonsProps.onRemoveItem}
            >
                <i className="fa fa-trash" /> {resolveText("Delete")}
            </Button>
        </Accordion.Body>
    </Accordion.Item>);

}