import React, { ReactNode } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { LoadingTableRow } from './LoadingTableRow';
import { NoEntriesTableRow } from './NoEntriesTableRow';
import { resolveText } from '../helpers/Globalizer';
import { InfiniteScroll } from './InfiniteScroll';
import { Models } from '../../localComponents/types/models';

interface NonExhaustiveTableProps<ItemType> {
    isLoading: boolean;
    items: ItemType[];
    hasMoreItems: boolean;
    loadMoreItems: () => void;
    tableHeaderBuilder?: () => ReactNode;
    tableRowBuilder: (item: ItemType) => ReactNode;
    colSpan: number;
    hasCreateNewButton?: boolean;
    onCreateNew?: () => void;
}

export const NonExhaustiveTable = <ItemType extends Models.IId>(props: NonExhaustiveTableProps<ItemType>) => {

    const items = props.items;
    return (
    <>
        <Row>
            <Col></Col>
            <Col xs="auto">
                {props.hasCreateNewButton 
                ? <Button className="m-1 float-right" onClick={props.onCreateNew}>{resolveText('CreateNew')}</Button> 
                : null}
            </Col>
        </Row>
        <InfiniteScroll
            dataLength={props.items.length}
            hasMore={props.hasMoreItems}
            next={props.loadMoreItems}
            isLoading={props.isLoading}
        >
            <Table responsive>
                {props.tableHeaderBuilder ? props.tableHeaderBuilder() : null}
                <tbody>
                    {items.length > 0
                    ? items.map(props.tableRowBuilder)
                    : props.isLoading ? <LoadingTableRow colSpan={props.colSpan} />
                    : <NoEntriesTableRow colSpan={props.colSpan} />}
                </tbody>
            </Table>
        </InfiniteScroll>
    </>
    );

}