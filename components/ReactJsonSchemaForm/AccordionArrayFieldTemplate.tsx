import { ArrayFieldTemplateProps } from "@rjsf/utils"
import { Accordion, Button, Row, Col, FormGroup, FormLabel } from "react-bootstrap"
import { resolveText } from "../../helpers/Globalizer"
import { ReactNode, useState } from "react";
import { MoveArrayItemsModal } from "../../modals/MoveArrayItemsModal";
import { Update } from "../../types/frontendTypes";

export interface AccordionArrayFieldTemplateOptions<T> {
    buttons?: ReactNode;
    overAccordionNode?: ReactNode;
    underAccordionNode?: ReactNode;
    batchMoveItemsOptions?: {
        items: T[];
        formatter: (item: T) => string;
        onItemsReordered: (update: Update<T[]>) => void;
    }
}
export const AccordionArrayFieldTemplate = <T,>(props: ArrayFieldTemplateProps) => {

    const { formData, items, title, uiSchema, canAdd, onAddClick } = props;

    const options = uiSchema?.["ui:options"] as AccordionArrayFieldTemplateOptions<T>;
    const buttons = options?.buttons;

    const [ showMoveItemsModal, setShowMoveItemsModal ] = useState<boolean>(false);

    return (<>
    <hr />
    <FormGroup>
        <Row>
            <Col>
                <FormLabel>
                    <h5>{title}</h5>
                </FormLabel>
            </Col>
            {buttons
            ? <Col xs="auto">
                {buttons}
            </Col> : null}
            <Col xs="auto">
                <Button
                    onClick={() => setShowMoveItemsModal(true)}
                    size='sm'
                >
                    {resolveText("Move")}...
                </Button>
            </Col>
        </Row>
        {options?.overAccordionNode}
        <Accordion className="accordion-card" key={formData.id}>
            {items}
        </Accordion>
        {canAdd 
        ? <Button 
            className='d-block m-2' 
            size="sm" 
            onClick={onAddClick}
        >
            {resolveText("Add")}
        </Button> : null}
        {options?.underAccordionNode}
    </FormGroup>
    {options?.batchMoveItemsOptions
    ? <MoveArrayItemsModal
        show={showMoveItemsModal}
        onClose={() => setShowMoveItemsModal(false)}
        items={options.batchMoveItemsOptions.items}
        formatItem={options.batchMoveItemsOptions.formatter}
        onChange={options.batchMoveItemsOptions.onItemsReordered}
    /> : null}
    <hr />
    </>);
}