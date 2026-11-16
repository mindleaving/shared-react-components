import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useEffect, useRef } from 'react';
import { AnonymousCsrfToken, apiClient, CsrfHeaderName } from '../../communication/ApiClient';

export const useMenschIdChallengeSubscription = (
    hubPath: string,
    challengeId: string | undefined,
    onChallengeAnswered: (challengeId: string) => void,
): void => {
    const callbackRef = useRef(onChallengeAnswered);
    useEffect(() => {
        callbackRef.current = onChallengeAnswered;
    }, [onChallengeAnswered]);

    useEffect(() => {
        if (!challengeId) {
            return;
        }
        const connection = new HubConnectionBuilder()
            .withUrl(apiClient.instance!.buildUrl(hubPath), {
                headers: { [CsrfHeaderName]: AnonymousCsrfToken },
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Warning)
            .build();
        const subscribe = () => connection.invoke('SubscribeToChallenge', challengeId);
        connection.on('ChallengeAnswered', (answeredChallengeId: string) => {
            if (answeredChallengeId === challengeId) {
                callbackRef.current(answeredChallengeId);
            }
        });
        connection.onreconnected(() => {
            void subscribe();
        });
        const started = connection
            .start()
            .then(subscribe)
            .catch((error: unknown) => {
                console.warn('mensch.ID challenge subscription failed', error);
            });
        return () => {
            void started.then(() => connection.stop());
        };
    }, [hubPath, challengeId]);
};
