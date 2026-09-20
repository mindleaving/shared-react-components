import { useCallback, useState } from "react";
import { resolveText } from "../helpers/Globalizer";
import { apiClient } from "../communication/ApiClient";
import { showErrorAlert } from "../helpers/AlertHelpers";
import { ApiError } from "../communication/ApiError";
import { FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { Center } from "./Center";
import { AsyncButton } from "./AsyncButton";

interface RegisterPasskeyProps {
    onRegistered?: () => void;
}

export const RegisterPasskey = (props: RegisterPasskeyProps) => {

    const { onRegistered } = props;

    const [ name, setName ] = useState<string>('');
    const [ isRegistering, setIsRegistering ] = useState<boolean>(false);

    const fetchCreationOptions = useCallback(async () => {
        setIsRegistering(true);
        const username = "jan"; // TODO
        let creationOptions: PublicKeyCredentialCreationOptions;
        try {
            const response = await apiClient.instance!.get(`api/logins/${username}/passkey-registration-options`);
            const creationOptionsJson = await response.json() as PublicKeyCredentialCreationOptionsJSON;
            creationOptions = PublicKeyCredential.parseCreationOptionsFromJSON(creationOptionsJson);
        } catch {
            setIsRegistering(false);
            showErrorAlert(resolveText("Passkey_CouldNotLoadCreationOptions"));
            return;
        }
        try {
            const credential = await navigator.credentials.create({ publicKey: creationOptions });
            const response = await apiClient.instance!.post(`api/logins/${username}/register-passkey`, credential);
            if(response.status !== 200) {
                throw new ApiError(response.status, "Could not register passkey");
            }
            if(!!onRegistered) {
                onRegistered();
            }
        } catch {
            showErrorAlert(resolveText("Passkey_AttestationWasUnsuccessful"));
        } finally {
            setIsRegistering(false);
        }
    }, [ onRegistered ]);

    return (<>
        <h3>{resolveText("Passkey_Register_Title")}</h3>
        <FormGroup>
            <FormLabel>{resolveText("PasskeyLogin_Name")}</FormLabel>
            <FormControl
                value={name}
                onChange={e => setName(e.target.value)}
            />
        </FormGroup>
        <Center className="mt-2">
            <AsyncButton
                onClick={fetchCreationOptions}
                isExecuting={isRegistering}
                activeText={resolveText("Passkey_Register")}
            />
        </Center>
    </>);

}