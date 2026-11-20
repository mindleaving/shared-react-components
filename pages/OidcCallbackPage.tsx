import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '../communication/ApiClient';

export const OidcCallbackPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const hasStarted = useRef(false);

    useEffect(() => {
        if (hasStarted.current) {
            return;
        }
        hasStarted.current = true;
        apiClient.instance!.completeSignIn(window.location.href)
            .then(() => navigate('/accounts', { replace: true }))
            .catch((signInError: unknown) => {
                setError(signInError instanceof Error ? signInError.message : 'Sign-in failed');
            });
    }, [navigate]);

    if (error) {
        return (
            <main className="card">
                <p className="error" role="alert">
                    {error}
                </p>
                <Link to="/login">Back to login</Link>
            </main>
        );
    }
    return <p className="status">Signing in…</p>;
}
export default OidcCallbackPage;
