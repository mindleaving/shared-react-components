import { Alert } from 'react-bootstrap';
import { resolveText } from '../helpers/Globalizer';

interface LoadingAlertProps {
    variant?: string;
    className?: string;
}

export const LoadingAlert = (props: LoadingAlertProps) => {

    return (
        <Alert
            variant={props.variant ?? 'info'}
            className={props.className}
        >
            {resolveText("Loading...")}
        </Alert>
    );

}