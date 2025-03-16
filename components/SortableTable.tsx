import '../styles/sortable-table.css';

import { ReactNode, useCallback, useMemo, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { NoEntriesTableRow } from "./NoEntriesTableRow";
import { OrderDirection } from "../types/enums";

export interface SortableTableHeaderCell {
    colSpan?: number;
    content: ReactNode;
    title?: string;
    center?: boolean;
    hideSortIndicator?: boolean;
}
export interface SortableTableColumn<T,TSortValue> {
    headerCells: SortableTableHeaderCell[];
    sortValueSelector?: (item: T) => TSortValue;
    sortValueComparer?: (a: TSortValue, b: TSortValue) => number;
}
interface SortableTableProps<T> {
    items: T[];
    rowBuilder: (item: T) => ReactNode;
    columns: SortableTableColumn<T,any>[];
    size?: 'sm' | 'lg';
    bordered?: boolean;
    borderless?: boolean;
    responsive?: string | boolean;
    striped?: boolean | string;
    hover?: boolean;
    variant?: string;
    className?: string;
}

interface SortInformation {
    columnIndex: number;
    sortOrder: OrderDirection;
}
export const SortableTable = <T>(props: SortableTableProps<T>) => {

    const { 
        items, 
        rowBuilder, 
        columns, 
        size,
        bordered,
        borderless,
        responsive,
        striped,
        hover,
        variant,
        className
    } = props;

    const [ sortInfo, setSortInfo ] = useState<SortInformation>({
        columnIndex: 0,
        sortOrder: OrderDirection.Ascending
    });
    const sortedItems = useMemo(() => {
        if(sortInfo.columnIndex < 0 || sortInfo.columnIndex >= columns.length) {
            return items;
        }
        const sortColumn = columns[sortInfo.columnIndex];
        const sortValueSelector = sortColumn.sortValueSelector;
        if(!sortValueSelector) {
            return items;
        }
        const sortValueComparer = sortColumn.sortValueComparer!;
        if(!sortValueComparer) {
            throw new Error(`Column ${sortInfo.columnIndex} is sortable but has not sort value comparer`);
        }
        if(sortInfo.sortOrder === OrderDirection.Descending) {
            return [...items].sort((a,b) => sortValueComparer(sortValueSelector(b), sortValueSelector(a)));
        } else {
            return [...items].sort((a,b) => sortValueComparer(sortValueSelector(a), sortValueSelector(b)));
        }
    }, [ items, columns, sortInfo ]);

    const toggleSearchDirection = useCallback((columnIndex: number) => {
        setSortInfo(state => {
            if(columnIndex === state.columnIndex) {
                return {
                    ...state,
                    sortOrder: state.sortOrder === OrderDirection.Ascending ? OrderDirection.Descending : OrderDirection.Ascending
                };
            } else {
                return {
                    columnIndex: columnIndex,
                    sortOrder: OrderDirection.Ascending
                };
            }
        });
    }, []);

    const generateHeaderCellWithSortIndicator = useCallback((
        headerCell: SortableTableHeaderCell | undefined,
        cssClasses: string[],
        columnIndex: number
    ) => {
        return (<th 
            key={columnIndex} 
            colSpan={headerCell?.colSpan ?? 1}
            className={cssClasses.join(' ')}
            onClick={() => toggleSearchDirection(columnIndex)}
        >
            <Row>
                <Col>
                    {headerCell?.content}
                </Col>
                <Col xs="auto">
                    <div className="sort-direction-indicator">
                    {columnIndex !== sortInfo.columnIndex ? <i className="fa fa-sort" />
                    : sortInfo.sortOrder === OrderDirection.Ascending ? <i className="fa fa-sort-asc" />
                    : <i className="fa fa-sort-desc" />}
                    </div>
                </Col>
            </Row>
        </th>);
    }, [ sortInfo, toggleSearchDirection ]);

    const generateHeaderCellWithoutSortIndicator = useCallback((
        headerCell: SortableTableHeaderCell | undefined,
        cssClasses: string[],
        columnIndex: number
    ) => {
        return (<th 
            key={columnIndex} 
            colSpan={headerCell?.colSpan ?? 1}
            className={cssClasses.join(' ')}
        >
            {headerCell?.content}
        </th>);
    }, []);

    const headerRows = useMemo(() => {
        const headerRows: ReactNode[] = [];
        const headerRowsCount = Math.max(...columns.map(column => column.headerCells.length));

        // Logic below takes into account colSpan, which makes the logic where convoluted.
        // The main idea is to keep track of columns that have one or more header rows with active colSpans
        // and adjust the header cell index accordingly.

        const activeColSpansAbove = new Array<number>(columns.length).fill(0);
        for (let headerRowIndex = 0; headerRowIndex < headerRowsCount; headerRowIndex++) {
            let remainingColSpan = 0;
            const renderedHeaderCells: ReactNode[] = [];
            for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                if(remainingColSpan > 0) {
                    remainingColSpan--;
                    activeColSpansAbove[columnIndex]++;
                    continue;
                }
                const column = columns[columnIndex];
                const colSpanRespectingHeaderCellIndex = headerRowIndex - activeColSpansAbove[columnIndex];
                const headerCellConf = colSpanRespectingHeaderCellIndex < column.headerCells.length 
                    ? column.headerCells[colSpanRespectingHeaderCellIndex] 
                    : undefined;
                const isSortable = !!column.sortValueSelector && headerCellConf;
                const cssClasses: string[] = [];
                if(headerCellConf?.center) {
                    cssClasses.push('text-center');
                }
                if(isSortable && !headerCellConf.hideSortIndicator) {
                    cssClasses.push('sortable');
                    if(columnIndex === sortInfo.columnIndex) {
                        cssClasses.push('is-sort-column');
                    }
                    renderedHeaderCells.push(generateHeaderCellWithSortIndicator(headerCellConf, cssClasses, columnIndex));
                } else {
                    renderedHeaderCells.push(generateHeaderCellWithoutSortIndicator(headerCellConf, cssClasses, columnIndex));
                }
                remainingColSpan = (headerCellConf?.colSpan ?? 1) - 1;
            }
            const headerRow = (
                <tr key={headerRowIndex}>
                    {renderedHeaderCells}
                </tr>);
            headerRows.push(headerRow);
        }
        return headerRows;
    }, [ columns, sortInfo, generateHeaderCellWithSortIndicator, generateHeaderCellWithoutSortIndicator ]);

    return (<Table
        size={size}
        bordered={bordered}
        borderless={borderless}
        responsive={responsive}
        striped={striped}
        hover={hover}
        variant={variant}
        className={className}
    >
        <thead>
            {headerRows}
        </thead>
        <tbody>
            {items.length === 0 ? <NoEntriesTableRow colSpan={columns.length} />
            : sortedItems.map(rowBuilder)}
        </tbody>
    </Table>);

}