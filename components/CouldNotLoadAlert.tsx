import React from 'react';
import { Alert } from 'react-bootstrap';
import { resolveText } from '../helpers/Globalizer';

interface CouldNotLoadAlertProps {}

export const CouldNotLoadAlert = (props: CouldNotLoadAlertProps) => {

    return (
        <Alert
            variant='danger'
        >
            {resolveText("CouldNotLoad")}
        </Alert>
    );

}