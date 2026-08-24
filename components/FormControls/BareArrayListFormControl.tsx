import { ReactNode } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Update } from "../../types/frontendTypes";
import { resolveText } from "../../helpers/Globalizer";
import { DeleteButton } from "../DeleteButon";
import { replaceItemAtIndex, removeItemAtIndex } from "../../helpers/CollectionHelpers";

interface BareArrayListFormControlProps<T> {
    items: (T | undefined)[];
    itemFormControlBuilder: (item: T | undefined, onChange: (item: T | undefined) => void, itemIndex: number) => ReactNode;
    onChange: (update: Update<(T | undefined)[]>) => void;
    itemCreator: () => T;
}

export const BareArrayListFormControl = <T,>(props: BareArrayListFormControlProps<T>) => {

    const { items, itemFormControlBuilder, onChange, itemCreator } = props;

    return (<>
        {items.map((item,itemIndex) => (
            <Row 
                key={itemIndex}
                className="align-items-center ms-3 mb-2"
            >
                <Col>
                    {itemFormControlBuilder(item, newItem => onChange(state => replaceItemAtIndex(state, newItem, itemIndex)), itemIndex)}
                </Col>
                <Col xs="auto">
                    <DeleteButton
                        type="button"
                        onClick={() => onChange(state => removeItemAtIndex(state, itemIndex))}
                        className="m-0"
                    />
                </Col>
            </Row>
        ))}
        <Row>
            <Col>
                <Button
                    type="button"
                    className="ms-3"
                    size="sm"
                    onClick={() => onChange(state => state.concat([ itemCreator() ]))}
                >
                    + {resolveText("Add")}
                </Button>
            </Col>
        </Row>
    </>);

}