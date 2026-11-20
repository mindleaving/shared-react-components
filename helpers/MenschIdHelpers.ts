import { ApiError } from '../communication/ApiError';
import { MenschIdLoginStep } from '../types/enums';
import { resolveText } from './Globalizer';

export const MenschIdSuffixAlphabet = 'ACDEFGHJKLMNPQRSTUVWXYZ2345679';

const DatePartLength = 8;
const SuffixLength = 5;
const MenschIdPattern = new RegExp(`^(\\d{4})(\\d{2})(\\d{2})-[${MenschIdSuffixAlphabet}]{${SuffixLength}}$`);

export const formatMenschIdInput = (rawInput: string, previousValue: string): string => {
    const characters = rawInput
        .toUpperCase()
        .replace(/[^0-9A-Z]/g, '')
        .slice(0, DatePartLength + SuffixLength);
    const isDeleting = rawInput.length < previousValue.length;
    if (characters.length < DatePartLength || (characters.length === DatePartLength && isDeleting)) {
        return characters;
    }
    return `${characters.slice(0, DatePartLength)}-${characters.slice(DatePartLength)}`;
};

export const isValidMenschId = (menschId: string): boolean => {
    const match = MenschIdPattern.exec(menschId);
    if (!match) {
        return false;
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};

export const isCompleteMenschIdInput = (menschId: string): boolean =>
    menschId.length >= DatePartLength + 1 + SuffixLength;

const OutcomeResourceIds: Partial<Record<MenschIdLoginStep, string>> = {
    [MenschIdLoginStep.Rejected]: 'MenschIdLogin_Rejected',
    [MenschIdLoginStep.Expired]: 'MenschIdLogin_Expired',
    [MenschIdLoginStep.Invalid]: 'MenschIdLogin_Invalid',
};

export const getMenschIdOutcomeResourceId = (step: MenschIdLoginStep): string =>
    OutcomeResourceIds[step] ?? 'MenschIdLogin_Invalid';

export const getMenschIdChallengePath =(apiBasePath: string, challengeId: string, action: string): string =>
    `${apiBasePath}/challenges/${encodeURIComponent(challengeId)}/${action}`;

export const formatMenschIdLoginError = (error: unknown): string => {
    if (error instanceof ApiError || error instanceof Error) {
        return error.message;
    }
    return resolveText('MenschIdLogin_ServerUnreachable');
};
