import { OidcClient, WebStorageStateStore } from 'oidc-client-ts';

export interface OidcClientSettings {
    authority: string;
    clientId: string;
    redirectUri: string;
    scope: string;
}

export const createOidcClient = (settings: OidcClientSettings): OidcClient => new OidcClient({
    authority: settings.authority,
    metadataUrl: `${settings.authority}/.well-known/openid-configuration`,
    client_id: settings.clientId,
    redirect_uri: settings.redirectUri,
    response_type: 'code',
    scope: settings.scope,
    fetchRequestCredentials: 'include',
    stateStore: new WebStorageStateStore({ store: window.sessionStorage }),
});
