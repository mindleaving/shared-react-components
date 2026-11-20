import { useMemo } from 'react';
import { Alert, Button, Stack } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { MenschIdLoginStep } from '../../types/enums';
import { getMenschIdOutcomeResourceId } from '../../helpers/MenschIdHelpers';

interface MenschIdChallengeOutcomeProps {
    step: MenschIdLoginStep;
    onTryAgain: () => void;
}

export const MenschIdChallengeOutcome = (props: MenschIdChallengeOutcomeProps) => {
    const { step, onTryAgain } = props;

    const outcomeText = useMemo(() => resolveText(getMenschIdOutcomeResourceId(step)), [step]);

    return (
        <Stack gap={3}>
            <Alert variant="warning" className="mb-0">
                {outcomeText}
            </Alert>
            <Button variant="primary" onClick={onTryAgain}>
                {resolveText('MenschIdLogin_TryAgain')}
            </Button>
        </Stack>
    );
};
