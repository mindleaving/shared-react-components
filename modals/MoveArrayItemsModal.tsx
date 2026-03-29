import { Button, Form, FormCheck, FormGroup, FormLabel, FormSelect, Modal } from "react-bootstrap";
import { useCallback, useState } from "react";
import { Update } from "../types/frontendTypes";
import { resolveText } from "../helpers/Globalizer";
import { CancelButton } from "../components/CancelButton";

interface MoveArrayItemsModalProps<T> {
    show: boolean;
    onClose: () => void;
    items: T[];
    formatItem: (item: T) => string;
    onChange: (update: Update<T[]>) => void;
}

export const MoveArrayItemsModal = <T,>(props: MoveArrayItemsModalProps<T>) => {

    const { show, onClose, items, formatItem, onChange } = props;

    const [ selectedElementIndices, setSelectedElementIndices ] = useState<number[]>([]);
    const [ targetIndex, setTargetIndex ] = useState<number>(-1);

    const moveElements = useCallback(() => {
        onChange(state => {
            const selectedElements = state.filter((_,idx) => selectedElementIndices.includes(idx));
            const remainingElements = state.filter((_,idx) => !selectedElementIndices.includes(idx));
            if(targetIndex < 0) {
                return selectedElements.concat(remainingElements);
            } else {
                const targetPositionElement = state[targetIndex];
                const newTargetPositionElementIndex = remainingElements.indexOf(targetPositionElement);
                if(newTargetPositionElementIndex < 0) {
                    return state; // Abort
                } else {
                    return remainingElements.slice(0, newTargetPositionElementIndex+1)
                        .concat(selectedElements)
                        .concat(remainingElements.slice(newTargetPositionElementIndex+1));
                }
            }
        });
        setSelectedElementIndices([]);
        setTargetIndex(-1);
        onClose();
    }, [ selectedElementIndices, targetIndex, onChange, onClose ]);

    const toggleElement = useCallback((elementIndex: number) => {
        setSelectedElementIndices(state => {
            if(state.includes(elementIndex)) {
                return state.filter(x => x !== elementIndex);
            } else {
                return state.concat(elementIndex);
            }
        });
    }, []);

    return (<Modal
        show={show}
        onHide={onClose}
    >
        <Modal.Header closeButton>
            <Modal.Title>{resolveText("Array_MoveElements")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={e => e.preventDefault()} validated>
                {items.map((element,elementIndex) => (
                    <FormCheck
                        key={elementIndex}
                        checked={selectedElementIndices.includes(elementIndex)}
                        onChange={() => toggleElement(elementIndex)}
                        label={formatItem(element)}
                        disabled={targetIndex === elementIndex}
                    />
                ))}
                <FormGroup>
                    <FormLabel>{resolveText("Array_PlaceElementsAfter")}</FormLabel>
                    <FormSelect
                        value={targetIndex}
                        onChange={e => setTargetIndex(Number(e.target.value))}
                        isInvalid={selectedElementIndices.includes(targetIndex)}
                    >
                        <option value="-1">{resolveText("Array_PlaceAtTop")}</option>
                        {items.map((element,elementIndex) => (
                            <option 
                                key={elementIndex} 
                                value={elementIndex}
                                disabled={selectedElementIndices.includes(elementIndex)}
                            >
                                {formatItem(element)}
                            </option>
                        ))}
                    </FormSelect>
                </FormGroup>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <CancelButton onClick={onClose} />
            <Button
                onClick={moveElements}
                disabled={selectedElementIndices.length === 0}
            >
                {resolveText("Move")}
            </Button>
        </Modal.Footer>
    </Modal>);

}