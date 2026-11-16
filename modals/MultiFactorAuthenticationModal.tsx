import { Button, Form, FormControl, FormGroup, FormLabel, Modal } from "react-bootstrap";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AsyncButton } from "../components/AsyncButton";
import { resolveText } from "../helpers/Globalizer";

interface MultiFactorAuthenticationModalProps {
    show: boolean;
    onClose: () => void;
    accountId: string;
    onTotpSubmitted: (accountId: string, totpCode: string) => Promise<void>;
}

export const MultiFactorAuthenticationModal = (props: MultiFactorAuthenticationModalProps) => {

    const { show, onClose, accountId, onTotpSubmitted } = props;

    const [ totpCode, setTotpCode ] = useState<string>('');
    const [ isLoggingIn, setIsLoggingIn ] = useState<boolean>(false);

    useEffect(() => {
        setTotpCode('');
    }, [ accountId ]);

    if(!accountId) {
        return null;
    }

    const logIntoAccount = async (e?: FormEvent) => {
        e?.preventDefault();

        setIsLoggingIn(true);
        try {
            await onTotpSubmitted(accountId, totpCode);
            onClose();
        } finally {
            setIsLoggingIn(false);
        }
    }

    return (<Modal
        show={show}
        onHide={onClose}
        onEntered={() => document.getElementById("totp-form-control")?.focus()}
    >
        <Modal.Header closeButton>
            <Modal.Title>{resolveText("MultiFactorAuthentication")}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-1">
            <Form validated
                id="mfa-form" 
                onSubmit={logIntoAccount}
            >
                <div className="mb-2">
                    <small><span className="text-secondary">{resolveText("Account")}-ID: {accountId}</span></small>
                </div>
                <FormGroup>
                    <FormLabel>{resolveText("MultiFactorAuthentication_CodeFromAuthenticatorApp")}</FormLabel>
                    <FormControl required
                        id="totp-form-control"
                        value={totpCode}
                        onChange={e => setTotpCode(e.target.value)}
                        pattern="[0-9]{6}"
                    />
                </FormGroup>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button
                variant="secondary"
                onClick={onClose}
            >
                {resolveText("Cancel")}
            </Button>
            <AsyncButton
                type="submit"
                form="mfa-form"
                disabled={!/^[0-9]{6}$/.test(totpCode)}
                isExecuting={isLoggingIn}
                activeText={resolveText("Login")}
                executingText={resolveText("LoggingIn...")}
            />
        </Modal.Footer>
    </Modal>);

}