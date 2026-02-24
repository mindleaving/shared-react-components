import { Accordion, Button, Col, Row } from "react-bootstrap";
import { resolveText } from "../../helpers/Globalizer";
import { ReactNode, useMemo } from "react";
import { Update } from "../../types/frontendTypes";
import { AccordionCard } from "../AccordionCard";
import { removeItemAtIndex, replaceItemAtIndex } from "../../helpers/CollectionHelpers";
import { DeleteButton } from "../DeleteButon";

interface AccordionListFormControlProps<T> {
    items: T[];
    titleFormatter: (item: T) => string | undefined;
    isValid: (item: T) => boolean;
    itemFormControlBuilder: (item: T, onChange: (update: Update<T>) => void) => ReactNode;
    onChange: (update: Update<T[]>) => void;
    itemCreator: () => T;
}

export const AccordionListFormControl = <T,>(props: AccordionListFormControlProps<T>) => {

    const { items, titleFormatter, isValid, itemFormControlBuilder, onChange, itemCreator } = props;

    return (<>
        <Accordion className="ms-3">
            {items.map((item,itemIndex) => (
                <AccordionCard
                    key={itemIndex}
                    eventKey={itemIndex + ''}
                    title={<Row>
                        {!isValid(item)
                        ? <Col xs="auto">
                            <span className="text-danger">
                                <i className="fa fa-exclamation-triangle" />
                            </span>
                        </Col> : null}
                        <Col>
                            {titleFormatter(item) ?? resolveText("ItemX").replace('{0}', (itemIndex + 1) + '')}
                        </Col>
                    </Row>}
                >
                    {itemFormControlBuilder(item, update => onChange(state => replaceItemAtIndex(state, update(state[itemIndex]), itemIndex)))}
                    <Row>
                        <Col></Col>
                        <Col xs="auto">
                            <DeleteButton
                                onClick={() => onChange(state => removeItemAtIndex(state, itemIndex))}
                            />
                        </Col>
                    </Row>
                </AccordionCard>
            ))}
        </Accordion>
        <Row className="ms-3 mt-1 mb-2">
            <Col>
                <Button
                    type="button"
                    className="ms-2"
                    size="sm"
                    onClick={() => onChange(state => state.concat([ itemCreator() ]))}
                >
                    + {resolveText("Add")}
                </Button>
            </Col>
        </Row>
    </>);

}