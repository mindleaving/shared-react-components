import type { OidcClient, SigninResponse } from 'oidc-client-ts';
import { authSessionStorageKey } from '../helpers/Constants';
import { buildUrl } from '../helpers/UrlBuilder';
import type { JsonPatchDocument, QueryParameters } from '../types/frontendTypes';
import { ApiError } from './ApiError';
import { createOidcClient } from './oidcClient';

export interface ApiClientOptions {
    handleError?: boolean;
    contentType?: string;
    includeCredentials?: boolean;
    stringifyBody?: boolean;
    csrfHeaderName?: string;
}

export interface ApiClientOidcOptions {
    authorityPath: string;
    clientId: string;
    redirectPath: string;
    scope: string;
    signOutPath: string;
    signOutEverywherePath: string;
}

export interface TokenExchangeOptions {
    replaceSession: boolean;
}

export const CsrfHeaderName = 'X-XSRF-TOKEN';
export const AnonymousCsrfToken = '1';

const TokenExchangeGrantType = 'urn:ietf:params:oauth:grant-type:token-exchange';
const AccessTokenTypeIdentifier = 'urn:ietf:params:oauth:token-type:access_token';
const RefreshMarginInSeconds = 30;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const getExpiresAt = (expiresInSeconds: number | undefined): number | undefined =>
    expiresInSeconds !== undefined ? Math.floor(Date.now() / 1000) + expiresInSeconds : undefined;

const isExpiring = (session: AuthSession): boolean =>
    session.expiresAt !== undefined && session.expiresAt - RefreshMarginInSeconds <= Date.now() / 1000;

const isValidStoredSession = (session: Partial<AuthSession> | null): session is AuthSession =>
    !!session && !!session.accessToken && !!session.csrfToken && !!session.name;

export class ApiClient {
    isLoggedIn: boolean;
    serverAddress: string;
    port: number;
    accessToken: string | undefined;
    csrfToken: string | undefined;
    loginExpirationTime: string | undefined;
    session: AuthSession | undefined;
    defaultOptions: ApiClientOptions;
    oidcOptions: ApiClientOidcOptions | undefined;
    onSessionEnded: (() => void) | undefined;
    private oidcClient: OidcClient | undefined;
    private refreshPromise: Promise<AuthSession | undefined> | undefined;

    constructor(serverAddress: string, port: number, oidcOptions?: ApiClientOidcOptions) {
        this.isLoggedIn = false;
        this.serverAddress = serverAddress;
        this.port = port;
        this.accessToken = undefined;
        this.csrfToken = undefined;
        this.loginExpirationTime = undefined;
        this.session = undefined;
        this.defaultOptions = {
            handleError: true,
            contentType: 'application/json',
            stringifyBody: true,
            csrfHeaderName: CsrfHeaderName
        };
        if(oidcOptions) {
            this.configureOidc(oidcOptions);
        }
    }

    configureOidc = (oidcOptions: ApiClientOidcOptions) => {
        this.oidcOptions = oidcOptions;
        this.oidcClient = createOidcClient({
            authority: this.buildUrl(oidcOptions.authorityPath),
            clientId: oidcOptions.clientId,
            redirectUri: `${window.location.origin}${oidcOptions.redirectPath}`,
            scope: oidcOptions.scope
        });
    }

    restoreSession = () => {
        try {
            const json = sessionStorage.getItem(authSessionStorageKey);
            const storedSession = json ? JSON.parse(json) as Partial<AuthSession> : null;
            const isExpired = !!storedSession?.expiresAt && storedSession.expiresAt <= Date.now() / 1000;
            if(isValidStoredSession(storedSession) && (!isExpired || storedSession.refreshToken)) {
                this._setSession(storedSession);
            }
        } catch {
            this._setSession(undefined);
        }
    }

    updateSession = (changes: Partial<AuthSession>) => {
        if(!this.session) {
            throw new Error('There is no session to update');
        }
        this._setSession({ ...this.session, ...changes });
    }

    signIn = async (loginPath: string, body?: unknown): Promise<Response> => {
        const oidcClient = this._getOidcClient();
        this._setSession(undefined);
        const loginResponse = await this.post(loginPath, body ?? null);
        const signinRequest = await oidcClient.createSigninRequest({});
        const callbackUrl = await this._fetchAuthorizationCallbackUrl(signinRequest.url);
        await this.completeSignIn(callbackUrl);
        return loginResponse;
    }

    createSignInRedirectUrl = async (): Promise<string> => {
        const oidcClient = this._getOidcClient();
        const signinRequest = await oidcClient.createSigninRequest({});
        return signinRequest.url;
    }

    completeSignIn = async (callbackUrl: string): Promise<AuthSession> => {
        const oidcClient = this._getOidcClient();
        const extraHeaders = { [CsrfHeaderName]: AnonymousCsrfToken };
        const signinResponse = await oidcClient.processSigninResponse(callbackUrl, extraHeaders);
        const session = this._createSessionFromSigninResponse(signinResponse);
        this._setSession(session);
        return session;
    }

    exchangeToken = async (
        endpointPath: string,
        parameters: Record<string, string>,
        options: TokenExchangeOptions): Promise<string> => {

        const validSession = await this.getValidSession();
        if(!validSession) {
            throw new ApiError(401, 'Not signed in');
        }
        const tokenResponse = await this._postToTokenEndpoint(endpointPath, {
            grant_type: TokenExchangeGrantType,
            subject_token: validSession.accessToken,
            subject_token_type: AccessTokenTypeIdentifier,
            ...parameters
        });
        if(options.replaceSession) {
            this._setSession({
                name: validSession.name,
                accessToken: tokenResponse.access_token!,
                refreshToken: tokenResponse.refresh_token,
                csrfToken: tokenResponse.csrf_token ?? validSession.csrfToken,
                expiresAt: getExpiresAt(tokenResponse.expires_in)
            });
        }
        return tokenResponse.access_token!;
    }

    getValidSession = async (): Promise<AuthSession | undefined> => {
        if(this.session && isExpiring(this.session)) {
            return await this.refreshSession();
        }
        return this.session;
    }

    refreshSession = (): Promise<AuthSession | undefined> => {
        if(!this.refreshPromise) {
            this.refreshPromise = this._refreshSession().finally(() => {
                this.refreshPromise = undefined;
            });
        }
        return this.refreshPromise;
    }

    signOut = async () => {
        await this._signOutAt(this._getOidcOptions().signOutPath);
    }

    signOutEverywhere = async () => {
        await this._signOutAt(this._getOidcOptions().signOutEverywherePath);
    }

    get = async (path: string, params?: QueryParameters, options?: ApiClientOptions) => {
        return await this._sendRequest("GET", path, params, undefined, options);
    }

    put = async (path: string, body: any, params?: QueryParameters, options?: ApiClientOptions) => {
        return await this._sendRequest("PUT", path, params, body, options);
    }

    post = async (path: string, body: any, params?: QueryParameters, options?: ApiClientOptions) => {
        return await this._sendRequest("POST", path, params, body, options);
    }

    patch = async (path: string, body: JsonPatchDocument[], params?: QueryParameters, options?: ApiClientOptions) => {
        return await this._sendRequest("PATCH", path, params, body, options);
    }

    delete = async (path: string, params?: QueryParameters, options?: ApiClientOptions) => {
        return await this._sendRequest("DELETE", path, params, undefined, options);
    }

    buildUrl = (path: string, params?: QueryParameters) => {
        return buildUrl(`https://${this.serverAddress}:${this.port}`, path, params);
    }

    _sendRequest = async (
        method: HttpMethod,
        path: string,
        params?: QueryParameters,
        body?: any,
        options?: ApiClientOptions) => {

        const effectiveOptions = Object.assign({}, this.defaultOptions, options ?? {});
        const session = await this.getValidSession();
        const response = await this._fetch(method, path, params, body, effectiveOptions, session);
        const finalResponse = response.status === 401 && session
            ? await this._retryAfterRefresh(method, path, params, body, effectiveOptions)
            : response;
        if(effectiveOptions.handleError && !finalResponse.ok) {
            return await this._handleError(finalResponse);
        }
        return finalResponse;
    }

    _retryAfterRefresh = async (
        method: HttpMethod,
        path: string,
        params: QueryParameters | undefined,
        body: any,
        options: ApiClientOptions) => {

        const refreshedSession = await this.refreshSession();
        const response = await this._fetch(method, path, params, body, options, refreshedSession);
        if(response.status === 401 && refreshedSession) {
            this._endSession(true);
        }
        return response;
    }

    _fetch = async (
        method: HttpMethod,
        path: string,
        params: QueryParameters | undefined,
        body: any,
        options: ApiClientOptions,
        session: AuthSession | undefined) => {

        const requestUrl = this.buildUrl(path, params);
        const jsonBody = body && options.stringifyBody ? this._convertToJson(body) : body;
        const headers: Record<string, string> = {};
        if(method === "PATCH") {
            headers['Content-Type'] = 'application/json-patch+json';
        } else if(options.contentType) {
            headers['Content-Type'] = options.contentType;
        }
        if(method !== "GET") {
            headers[options.csrfHeaderName ?? CsrfHeaderName] = session?.csrfToken ?? AnonymousCsrfToken;
        }
        if(session) {
            headers['Authorization'] = `Bearer ${session.accessToken}`;
        }
        return await fetch(requestUrl, {
            method: method,
            body: jsonBody,
            headers: headers,
            credentials: options.includeCredentials ? 'include' : 'omit'
        });
    }

    _convertToJson = (body: any, isFile: boolean = false) => {
        if(typeof body === "string" || isFile) {
            return body;
        }
        if(typeof body === "object") {
            return JSON.stringify(body);
        }
        throw new Error(`Body to be sent to server must be either of type 'object' or a JSON-string, but was ${typeof body}`);
    }

    _handleError = async (response: Response): Promise<never> => {
        const errorText = await response.text();
        if(errorText.startsWith('{') && errorText.endsWith('}')) {
            const errorObject = JSON.parse(errorText);
            const errorCode = typeof errorObject['errorCode'] === "string" ? errorObject['errorCode'] as string : undefined;
            const errorsToken = errorObject['errors'];
            if(errorsToken) {
                const errors = Array.isArray(errorsToken)
                    ? (errorsToken as any[]).flatMap(x => x) as string[]
                    : Object.values(errorsToken as Record<string, string[]>).flatMap(x => x);
                throw new ApiError(response.status, errors.join(', '), errorCode);
            }
            const description = errorObject['errorText'] ?? errorObject['detail'] ?? errorObject['error_description'] ?? errorObject['title'];
            if(typeof description === "string" || errorCode) {
                throw new ApiError(response.status, description ?? errorCode, errorCode);
            }
        }
        throw new ApiError(response.status, errorText || `Request failed (${response.status})`);
    }

    _refreshSession = async (): Promise<AuthSession | undefined> => {
        const currentSession = this.session;
        if(!currentSession?.refreshToken) {
            this._endSession(true);
            return undefined;
        }
        try {
            const tokenResponse = await this._postToTokenEndpoint('token', {
                grant_type: 'refresh_token',
                refresh_token: currentSession.refreshToken
            });
            const refreshedSession: AuthSession = {
                ...currentSession,
                accessToken: tokenResponse.access_token!,
                refreshToken: tokenResponse.refresh_token ?? currentSession.refreshToken,
                csrfToken: tokenResponse.csrf_token ?? currentSession.csrfToken,
                expiresAt: getExpiresAt(tokenResponse.expires_in)
            };
            this._setSession(refreshedSession);
            return refreshedSession;
        } catch {
            this._endSession(true);
            return undefined;
        }
    }

    _postToTokenEndpoint = async (endpointPath: string, parameters: Record<string, string>): Promise<TokenEndpointResponse> => {
        const oidcOptions = this._getOidcOptions();
        const response = await fetch(this.buildUrl(`${oidcOptions.authorityPath}/${endpointPath}`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                [CsrfHeaderName]: AnonymousCsrfToken
            },
            body: new URLSearchParams({ client_id: oidcOptions.clientId, ...parameters }),
            credentials: this.defaultOptions.includeCredentials ? 'include' : 'omit'
        });
        const tokenResponse = await response.json() as TokenEndpointResponse;
        if(!response.ok || !tokenResponse.access_token) {
            throw new ApiError(
                response.status,
                tokenResponse.error_description ?? tokenResponse.error ?? `Token request failed (${response.status})`,
                tokenResponse.errorCode);
        }
        return tokenResponse;
    }

    _fetchAuthorizationCallbackUrl = async (authorizeUrl: string): Promise<string> => {
        const response = await fetch(authorizeUrl, { credentials: 'include' });
        const finalUrl = new URL(response.url);
        const redirectUri = new URL(`${window.location.origin}${this._getOidcOptions().redirectPath}`);
        const isCallback = finalUrl.origin === redirectUri.origin && finalUrl.pathname === redirectUri.pathname;
        const hasAuthorizationResult = finalUrl.searchParams.has('code') || finalUrl.searchParams.has('error');
        if(!isCallback || !hasAuthorizationResult) {
            throw new ApiError(401, 'The authorization endpoint did not return an authorization code (login required)');
        }
        return finalUrl.toString();
    }

    _createSessionFromSigninResponse = (signinResponse: SigninResponse): AuthSession => {
        const csrfToken = (signinResponse as unknown as TokenEndpointResponse).csrf_token;
        if(typeof csrfToken !== 'string') {
            throw new Error('The token response contains no CSRF token');
        }
        return {
            name: signinResponse.profile.name ?? signinResponse.profile.sub,
            accessToken: signinResponse.access_token,
            refreshToken: signinResponse.refresh_token,
            csrfToken,
            expiresAt: signinResponse.expires_at
        };
    }

    _signOutAt = async (path: string) => {
        try {
            await this.post(path, null, undefined, { handleError: false });
        } finally {
            this._endSession(false);
        }
    }

    _endSession = (notify: boolean) => {
        const hadSession = !!this.session;
        this._setSession(undefined);
        if(notify && hadSession && this.onSessionEnded) {
            this.onSessionEnded();
        }
    }

    _setSession = (session: AuthSession | undefined) => {
        this.session = session;
        this.isLoggedIn = !!session;
        this.accessToken = session?.accessToken;
        this.csrfToken = session?.csrfToken;
        this.loginExpirationTime = session?.expiresAt ? new Date(session.expiresAt * 1000).toISOString() : undefined;
        try {
            if(session) {
                sessionStorage.setItem(authSessionStorageKey, JSON.stringify(session));
            } else {
                sessionStorage.removeItem(authSessionStorageKey);
            }
        } catch {
            return;
        }
    }

    _getOidcClient = (): OidcClient => {
        if(!this.oidcClient) {
            throw new Error('OIDC is not configured. Call configureOidc first.');
        }
        return this.oidcClient;
    }

    _getOidcOptions = (): ApiClientOidcOptions => {
        if(!this.oidcOptions) {
            throw new Error('OIDC is not configured. Call configureOidc first.');
        }
        return this.oidcOptions;
    }
}

export const apiClient: { instance?: ApiClient } = {};
