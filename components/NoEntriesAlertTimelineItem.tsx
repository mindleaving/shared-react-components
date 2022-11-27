import React from 'react';
import { Alert } from 'react-bootstrap';
import { resolveText } from '../helpers/Globalizer';

interface NoEntriesAlertTimelineItemProps {}

export const NoEntriesAlertTimelineItem = (props: NoEntriesAlertTimelineItemProps) => {

    return (
        <Alert variant="info" className='text-center'>{resolveText("NoEntries")}</Alert>
    );

}