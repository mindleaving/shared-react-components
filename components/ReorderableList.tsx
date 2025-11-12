import '../styles/reorderable-list.css';

import { ReactNode, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ReorderableListItem, Update } from "../types/frontendTypes";
import { moveItem } from "../helpers/CollectionHelpers";
import { ReorderableListItemContainer } from './ReorderableListItemContainer';

interface ReorderableListProps<T> {
    items: ReorderableListItem<T>[];
    itemRenderer: (item: T) => ReactNode;
    onItemsReordered: (update: Update<T[]>) => void;
}

export const ReorderableList = <T,>(props: ReorderableListProps<T>) => {

    const { items, itemRenderer, onItemsReordered } = props;

    const onItemMoved = useCallback((sourceIndex: number, targetIndex: number) => {
        onItemsReordered(state => moveItem(state, sourceIndex, targetIndex));
    }, []);

    return (<DndProvider backend={HTML5Backend}>
        {items.map((item,index) => <ReorderableListItemContainer
            key={index}
            item={item} 
            itemIndex={index}
            onItemMoved={onItemMoved}
        >
            {itemRenderer(item.item)}
        </ReorderableListItemContainer>)}
    </DndProvider>);

}