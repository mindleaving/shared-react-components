import { Accordion, Button, Col, Row } from "react-bootstrap";
import { resolveText } from "../../helpers/Globalizer";
import { ReactNode, useCallback } from "react";
import { Update } from "../../types/frontendTypes";
import { AccordionCard } from "../AccordionCard";
import { moveItem, removeItemAtIndex, replaceItemAtIndex } from "../../helpers/CollectionHelpers";
import { DeleteButton } from "../DeleteButon";

interface AccordionListFormControlProps<T> {
    items: T[];
    titleFormatter: (item: T) => string | undefined;
    isValid: (item: T) => boolean;
    itemFormControlBuilder: (item: T, onChange: (update: Update<T>) => void) => ReactNode;
    onChange: (update: Update<T[]>) => void;
    itemCreator?: () => T;
}

export const AccordionListFormControl = <T,>(props: AccordionListFormControlProps<T>) => {

    const { items, titleFormatter, isValid, itemFormControlBuilder, onChange, itemCreator } = props;

    const onMoveUpItem = useCallback((itemIndex: number) => {
        if(itemIndex - 1 < 0) {
            return;
        }
        onChange(state => moveItem(state, itemIndex, itemIndex - 1));
    }, []);
    const onMoveDownItem = useCallback((itemIndex: number) => {
        if(itemIndex + 1 >= items.length) {
            return;
        }
        onChange(state => moveItem(state, itemIndex, itemIndex + 1));
    }, [ items.length ]);

    return (<>
        <Accordion className="ms-3">
            {items.map((item,itemIndex) => (
                <AccordionCard
                    key={itemIndex}
                    eventKey={itemIndex + ''}
                    title={<Row className="align-items-center w-100 pe-3">
                        {!isValid(item)
                        ? <Col xs="auto">
                            <span className="text-danger">
                                <i className="fa fa-exclamation-triangle" />
                            </span>
                        </Col> : null}
                        <Col>
                            {titleFormatter(item) ?? resolveText("ItemX").replace('{0}', (itemIndex + 1) + '')}
                        </Col>
                        {itemIndex > 0 ?
                        <Col xs="auto" className="px-1">
                            <Button
                                onClick={e => {
                                    e.stopPropagation();
                                    onMoveUpItem(itemIndex);
                                }}
                                variant="outline-primary"
                            >
                                <i className="fa fa-arrow-up" />
                            </Button>
                        </Col> : null}
                        {itemIndex + 1 < items.length
                        ? <Col xs="auto" className="px-1">
                                <Button
                                onClick={e => {
                                    e.stopPropagation();
                                    onMoveDownItem(itemIndex);
                                }}
                                variant="outline-primary"
                            >
                                <i className="fa fa-arrow-down" />
                            </Button>
                        </Col> : null}
                    </Row>}
                    headerClassName="py-2"
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
        {itemCreator
        ? <Row className="ms-3 mt-1 mb-2">
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
        </Row> : null}
    </>);

}