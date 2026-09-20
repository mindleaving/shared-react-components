import { Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { FormEvent, useCallback, useState } from "react";
import { apiClient } from "../communication/ApiClient";
import { ApiError } from "../communication/ApiError";
import { showErrorAlert } from "../helpers/AlertHelpers";
import { resolveText } from "../helpers/Globalizer";
import { AsyncButton } from "./AsyncButton";
import { Center } from "./Center";

interface PasskeyLoginFormProps {
    onLoggedIn: () => void;
}

export const PasskeyLoginForm = (props: PasskeyLoginFormProps) => {

    const { onLoggedIn } = props;

    const [ username, setUsername ] = useState<string>('');
    const [ isLoggingIn, setIsLoggingIn ] = useState<boolean>(false);

    const loginWithPasskey = useCallback(async (e?: FormEvent) => {
        e?.preventDefault();
        if(!username) {
            return;
        }
        setIsLoggingIn(true);
        let authOptions: PublicKeyCredentialRequestOptions;
        try {
            const response = await apiClient.instance!.get(`api/logins/${username}/passkey-auth-options`);
            const authOptionsJson = await response.json() as PublicKeyCredentialRequestOptionsJSON;
            authOptions = PublicKeyCredential.parseRequestOptionsFromJSON(authOptionsJson);
        } catch {
            setIsLoggingIn(false);
            showErrorAlert(resolveText("Passkey_CouldNotLoadAuthOptions"));
            return;
        }
        try {
            const credential = await navigator.credentials.get({ publicKey: authOptions });
            const response = await apiClient.instance!.post(`api/logins/${username}/passkey-login`, credential);
            if(response.status !== 200) {
                throw new ApiError(response.status, "Could not authenticate with passkey");
            }
            onLoggedIn();
        } catch {
            showErrorAlert(resolveText("Passkey_AuthenticationWasUnsuccessful"));
        } finally {
            setIsLoggingIn(false);
        }
    }, [ username, onLoggedIn ]);

    return (<Form onSubmit={loginWithPasskey}>
        <FormGroup>
            <FormLabel>{resolveText("PasskeyLogin_Username")}</FormLabel>
            <FormControl
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
        </FormGroup>
        <Center className="mt-2">
            <AsyncButton
                type="submit"
                isExecuting={isLoggingIn}
                activeText={resolveText("Login")}
            />
        </Center>
    </Form>);

}