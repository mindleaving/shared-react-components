import { PropsWithChildren } from 'react';
import InfiniteScrollFromLibrary from 'react-infinite-scroll-component';
import { LoadingAlert } from '../../sharedHealthComponents/components/LoadingAlert';
import { NoMoreEntriesAlert } from '../../sharedHealthComponents/components/NoMoreEntriesAlert';
import { NoEntriesAlertTimelineItem } from '../../sharedHealthComponents/components/Patients/NoEntriesAlertTimelineItem';

interface InfiniteScrollProps extends PropsWithChildren {
    dataLength: number;
    isLoading: boolean;
    hasMore: boolean;
    next: () => void;
    scrollThreshold?: string | number;
}

export const InfiniteScroll = (props: InfiniteScrollProps) => {

    return (
        <InfiniteScrollFromLibrary
            dataLength={props.dataLength}
            hasMore={props.hasMore}
            next={props.next}
            scrollThreshold={props.scrollThreshold}
            loader={<LoadingAlert variant='secondary' />}
            endMessage={<NoMoreEntriesAlert />}
            style={{ overflowX: 'hidden' }}
        >
            {props.dataLength > 0
            ? props.children
            : props.isLoading ? <LoadingAlert />
            : <NoEntriesAlertTimelineItem />}
        </InfiniteScrollFromLibrary>
    );

}