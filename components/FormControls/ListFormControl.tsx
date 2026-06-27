import { ReactNode } from 'react';
import Badge from 'react-bootstrap/Badge';

interface ListFormControlProps<T> {
    items: T[];
    idFunc: (item: T) => string;
    displayFunc: (item: T) => string | ReactNode;
    removeItem: (item: T) => void;
    showAddButton?: boolean;
    onAdd?: () => void;
}

export const ListFormControl = <T,>(props: ListFormControlProps<T>) => {

    const { items, idFunc, displayFunc, removeItem, showAddButton, onAdd } = props;

    return (
        <div className="list-form-control">
            {items.map(item => 
                <Badge className="itemListBadge" bg="primary" key={idFunc(item)}>
                    {displayFunc(item)} <Badge pill bg="danger" onClick={() => removeItem(item)}>X</Badge> 
                </Badge>
            )}
            {showAddButton && onAdd
            ? <i
                onClick={onAdd}
                className='fa fa-plus green clickable ms-2'
            /> : null}
        </div>
    );
}