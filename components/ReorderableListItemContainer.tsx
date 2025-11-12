import type { Identifier, XYCoord } from 'dnd-core';
import { PropsWithChildren, useRef } from "react";
import { useDrop, useDrag } from "react-dnd";
import { ReorderableListItem, ReorderableListItemLight } from "../types/frontendTypes";
import { DragHandle } from "./DragHandle";
import { Row, Col } from "react-bootstrap";

interface ReorderableListItemContainerProps<T> extends PropsWithChildren {
    item: ReorderableListItem<T>;
    itemIndex: number;
    onItemMoved: (sourceIndex: number, targetIndex: number) => void;
}

export const ReorderableListItemContainer = <T,>(props: ReorderableListItemContainerProps<T>) => {

    const { item, itemIndex, onItemMoved } = props;

    const ref = useRef<HTMLDivElement>(null);

    const [ { handlerId }, drop ] = useDrop<ReorderableListItemLight,void,{ handlerId: Identifier | null }>({
        accept: item.acceptablePartnerTypes,
        collect: monitor => {
            return { handlerId: monitor.getHandlerId() };
        },
        hover: (item: ReorderableListItemLight, monitor) => {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.currentIndex;
            const hoverIndex = itemIndex;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            onItemMoved(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.currentIndex = hoverIndex
        }
    });

    const [ { isDragging }, drag ] = useDrag({
        type: item.itemType,
        item: (): ReorderableListItemLight => {
            return { 
                id: item.id, 
                itemType: item.itemType,
                currentIndex: itemIndex 
            };
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    drag(drop(ref));

    return (<div
        ref={ref}
        className='reorderable-list-item-container'
        style={{ opacity: isDragging ? 0 : 1 }}
        data-handler-id={handlerId}
    >
        <Row className="align-items-center">
            <Col xs="auto">
                <DragHandle />
            </Col>
            <Col>
                {props.children}
            </Col>
        </Row>
    </div>);

}