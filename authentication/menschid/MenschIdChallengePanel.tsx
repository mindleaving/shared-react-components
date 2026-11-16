import { useCallback } from 'react';
import { Alert, Button, Stack } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import { resolveText } from '../../helpers/Globalizer';

interface MenschIdChallengePanelProps {
    menschId: string;
    appLink: string;
    info: string | null;
    error: string | null;
    isBusy: boolean;
    onCheckCompleted: () => void;
    onCancel: () => void;
}

export const MenschIdChallengePanel = (props: MenschIdChallengePanelProps) => {
    const { menschId, appLink, info, error, isBusy, onCheckCompleted, onCancel } = props;

    const openApp = useCallback(() => {
        window.location.assign(appLink);
    }, [appLink]);

    return (
        <Stack gap={3}>
            <p className="mb-0">
                {resolveText('MenschIdLogin_ScanQrCode')} <strong>{menschId}</strong>
            </p>
            <div className="align-self-center bg-white p-3 rounded border">
                <QRCode value={appLink} size={200} />
            </div>
            <Button variant="primary" onClick={openApp}>
                {resolveText('MenschIdLogin_OpenApp')}
            </Button>
            <Button variant="outline-primary" disabled={isBusy} onClick={onCheckCompleted}>
                {isBusy ? resolveText('MenschIdLogin_Checking') : resolveText('MenschIdLogin_ChallengeCompleted')}
            </Button>
            {info && <Alert variant="info" className="mb-0">{info}</Alert>}
            {error && <Alert variant="danger" className="mb-0">{error}</Alert>}
            <Button variant="link" onClick={onCancel}>
                {resolveText('MenschIdLogin_Cancel')}
            </Button>
        </Stack>
    );
};
