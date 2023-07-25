import React, { ReactNode } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { LoadingTableRow } from './LoadingTableRow';
import { NoEntriesTableRow } from './NoEntriesTableRow';
import { resolveText } from '../helpers/Globalizer';
import { InfiniteScroll } from './InfiniteScroll';
import { Models } from '../../localComponents/types/models';
import { Center } from './Center';

interface NonExhaustiveTableProps<ItemType> {
    autoScroll?: boolean;
    hover?: boolean;
    isLoading: boolean;
    items: ItemType[];
    hasMoreItems: boolean;
    loadMoreItems: () => void;
    tableHeaderBuilder?: () => ReactNode;
    tableRowBuilder: (item: ItemType) => ReactNode;
    colSpan: number;
    hasCreateNewButton?: boolean;
    onCreateNew?: () => void;
    showNoMoreItemsAlert?: boolean;
}

export const NonExhaustiveTable = <ItemType extends Models.IId>(props: NonExhaustiveTableProps<ItemType>) => {

    const { 
        autoScroll, 
        hover, 
        isLoading, 
        items,
        hasMoreItems,
        loadMoreItems,
        hasCreateNewButton,
        onCreateNew,
        tableHeaderBuilder,
        tableRowBuilder,
        colSpan,
        showNoMoreItemsAlert
    } = props;

    const table = (
        <Table hover={hover}>
            {tableHeaderBuilder ? tableHeaderBuilder() : null}
            <tbody>
                {items.length > 0
                ? items.map(tableRowBuilder)
                : isLoading ? <LoadingTableRow colSpan={colSpan} />
                : <NoEntriesTableRow colSpan={colSpan} />}
            </tbody>
        </Table>
    )
    return (
    <>
        {hasCreateNewButton 
        ? <Row>
            <Col></Col>
            <Col xs="auto">
                <Button 
                    className="m-1 float-right" 
                    onClick={onCreateNew}
                >
                    {resolveText('CreateNew')}
                </Button>
            </Col>
        </Row> : null}
        {autoScroll
        ? <InfiniteScroll
            dataLength={items.length}
            hasMore={hasMoreItems}
            next={loadMoreItems}
            isLoading={isLoading}
            showNoMoreItemsAlert={showNoMoreItemsAlert}
        >
            {table}
        </InfiniteScroll>
        : <>
            {table}
            {hasMoreItems
            ? <Center>
                <Button
                    variant='link'
                    onClick={loadMoreItems}
                >
                    {resolveText("LoadMore")}
                </Button>
            </Center> : null}
        </>}
    </>
    );

}