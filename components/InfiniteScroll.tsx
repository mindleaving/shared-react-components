import { PropsWithChildren } from 'react';
import InfiniteScrollFromLibrary from 'react-infinite-scroll-component';
import { LoadingAlert } from './LoadingAlert';
import { NoMoreEntriesAlert } from './NoMoreEntriesAlert';
import { NoEntriesAlert } from './NoEntriesAlert';

interface InfiniteScrollProps {
    dataLength: number;
    isLoading: boolean;
    hasMore: boolean;
    next: () => void;
    scrollThreshold?: string | number;
    className?: string;
}

export const InfiniteScroll = (props: PropsWithChildren<InfiniteScrollProps>) => {

    return (
        <InfiniteScrollFromLibrary
            dataLength={props.dataLength}
            hasMore={props.hasMore}
            next={props.next}
            scrollThreshold={props.scrollThreshold}
            loader={<LoadingAlert variant='secondary' />}
            endMessage={props.dataLength > 0 ? <NoMoreEntriesAlert /> : null}
            className={props.className}
            style={{ overflowX: 'hidden' }}
        >
            {props.dataLength > 0
            ? props.children
            : props.isLoading ? <LoadingAlert />
            : <NoEntriesAlert />}
        </InfiniteScrollFromLibrary>
    );

}