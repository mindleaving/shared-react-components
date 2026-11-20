import { useCallback, useMemo, type ChangeEvent, type FormEvent } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { formatMenschIdInput, isCompleteMenschIdInput, isValidMenschId } from '../../helpers/MenschIdHelpers';

interface MenschIdEntryProps {
    menschId: string;
    error: string | null;
    isBusy: boolean;
    onMenschIdChange: (menschId: string) => void;
    onSubmit: () => void;
}

export const MenschIdEntry = (props: MenschIdEntryProps) => {
    const { menschId, error, isBusy, onMenschIdChange, onSubmit } = props;

    const isValid = useMemo(() => isValidMenschId(menschId), [menschId]);
    const isInvalidInput = useMemo(() => isCompleteMenschIdInput(menschId) && !isValid, [menschId, isValid]);

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const formattedMenschId = formatMenschIdInput(event.target.value, menschId);
        onMenschIdChange(formattedMenschId);
    }, [menschId, onMenschIdChange]);

    const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
    }, [onSubmit]);

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="menschId">
                <Form.Label>{resolveText('MenschIdLogin_MenschId')}</Form.Label>
                <Form.Control
                    placeholder="yyyyMMdd-XXXXX"
                    autoComplete="username"
                    autoCapitalize="characters"
                    spellCheck={false}
                    value={menschId}
                    isInvalid={isInvalidInput}
                    onChange={handleChange}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    {resolveText('MenschIdLogin_InvalidFormat')}
                </Form.Control.Feedback>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button type="submit" className="w-100" disabled={isBusy || !isValid}>
                {isBusy ? resolveText('MenschIdLogin_Starting') : resolveText('MenschIdLogin_Continue')}
            </Button>
        </Form>
    );
};
