import { useCallback, useRef, useState } from 'react';
import { MenschIdChallengeStatus } from '../../../localComponents/types/enums';
import type { Models } from '../../../localComponents/types/models.d';
import { apiClient } from '../../communication/ApiClient';
import { resolveText } from '../../helpers/Globalizer';
import { MenschIdChallengeOutcome } from './MenschIdChallengeOutcome';
import { MenschIdChallengePanel } from './MenschIdChallengePanel';
import { MenschIdEntry } from './MenschIdEntry';
import { formatMenschIdLoginError, getMenschIdChallengePath } from '../../helpers/MenschIdHelpers';
import { getMenschIdChallengeStatus, startMenschIdChallenge } from './menschIdLoginApi';
import { useMenschIdChallengeSubscription } from './useMenschIdChallengeSubscription';
import { MenschIdLoginStep } from '../../types/enums';

interface MenschIdLoginFormProps {
    apiBasePath: string;
    hubPath: string;
    onLoginCompleted: () => void;
    formatError?: (error: unknown) => string;
}

export const MenschIdLoginForm = (props: MenschIdLoginFormProps) => {
    const {
        apiBasePath,
        hubPath,
        onLoginCompleted,
        formatError = formatMenschIdLoginError,
    } = props;

    const [menschId, setMenschId] = useState('');
    const [step, setStep] = useState<MenschIdLoginStep>(MenschIdLoginStep.EnterMenschId);
    const [challenge, setChallenge] = useState<Models.MenschId.StartMenschIdChallengeResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [isBusy, setIsBusy] = useState(false);
    const isCompletingRef = useRef(false);

    const subscribedChallengeId = step === MenschIdLoginStep.Challenge ? challenge?.challengeId : undefined;

    const completeLogin = useCallback(async (challengeId: string) => {
        if (isCompletingRef.current) {
            return;
        }
        isCompletingRef.current = true;
        const loginPath = getMenschIdChallengePath(apiBasePath, challengeId, 'login');
        try {
            await apiClient.instance!.signIn(loginPath, {});
            onLoginCompleted();
        } catch (signInError) {
            isCompletingRef.current = false;
            setError(formatError(signInError));
        }
    }, [apiBasePath, formatError, onLoginCompleted]);

    const checkChallengeStatus = useCallback(async (challengeId: string, isManualCheck: boolean) => {
        setError(null);
        setInfo(null);
        try {
            const status = await getMenschIdChallengeStatus(apiBasePath, challengeId);
            switch (status) {
                case MenschIdChallengeStatus.Accepted:
                {
                    await completeLogin(challengeId);
                    break;
                }
                case MenschIdChallengeStatus.Rejected:
                {
                    setStep(MenschIdLoginStep.Rejected);
                    break;
                }
                case MenschIdChallengeStatus.Expired:
                {
                    setStep(MenschIdLoginStep.Expired);
                    break;
                }
                case MenschIdChallengeStatus.Invalid:
                {
                    setStep(MenschIdLoginStep.Invalid);
                    break;
                }
                case MenschIdChallengeStatus.Pending:
                {
                    if (isManualCheck) {
                        setInfo(resolveText('MenschIdLogin_NotAnsweredYet'));
                    }
                    break;
                }
            }
        } catch (statusError) {
            setError(formatError(statusError));
        }
    }, [apiBasePath, completeLogin, formatError]);

    const handleChallengeAnswered = useCallback((challengeId: string) => {
        void checkChallengeStatus(challengeId, false);
    }, [checkChallengeStatus]);

    const handleStart = useCallback(async () => {
        setError(null);
        setInfo(null);
        setIsBusy(true);
        try {
            const startedChallenge = await startMenschIdChallenge(apiBasePath, menschId);
            isCompletingRef.current = false;
            setChallenge(startedChallenge);
            setStep(MenschIdLoginStep.Challenge);
        } catch (startError) {
            setError(formatError(startError));
        } finally {
            setIsBusy(false);
        }
    }, [apiBasePath, formatError, menschId]);

    const handleManualCheck = useCallback(async () => {
        if (!challenge) {
            return;
        }
        setIsBusy(true);
        await checkChallengeStatus(challenge.challengeId, true);
        setIsBusy(false);
    }, [challenge, checkChallengeStatus]);

    const handleRestart = useCallback(() => {
        setChallenge(null);
        setError(null);
        setInfo(null);
        setStep(MenschIdLoginStep.EnterMenschId);
    }, []);

    useMenschIdChallengeSubscription(
        hubPath,
        subscribedChallengeId,
        handleChallengeAnswered,
    );

    if (step === MenschIdLoginStep.EnterMenschId) {
        return (
            <MenschIdEntry
                menschId={menschId}
                error={error}
                isBusy={isBusy}
                onMenschIdChange={setMenschId}
                onSubmit={() => void handleStart()}
            />
        );
    }
    if (step === MenschIdLoginStep.Challenge && challenge) {
        return (
            <MenschIdChallengePanel
                menschId={menschId}
                appLink={challenge.appLink}
                info={info}
                error={error}
                isBusy={isBusy}
                onCheckCompleted={() => void handleManualCheck()}
                onCancel={handleRestart}
            />
        );
    }

    return (<MenschIdChallengeOutcome step={step} onTryAgain={handleRestart} />);
};
