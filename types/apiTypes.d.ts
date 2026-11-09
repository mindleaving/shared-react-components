interface AuthSession {
  name: string;
  accessToken: string;
  refreshToken?: string;
  csrfToken: string;
  expiresAt?: number;
  account?: Account;
}

type ApiRequest = (path: string, init?: RequestInit) => Promise<Response>;

interface AuthContextValue {
  session: AuthSession | null;
  startSession: (session: AuthSession) => void;
  completeSignIn: (callbackUrl: string) => Promise<void>;
  signOut: () => Promise<void>;
  signOutEverywhere: () => Promise<void>;
  apiRequest: ApiRequest;
  getValidSession: () => Promise<AuthSession | null>;
}

interface ApiProblem {
  title?: string;
  detail?: string;
  status?: number;
}

interface TokenEndpointResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  csrf_token?: string;
  error?: string;
  error_description?: string;
  errorCode: string;
}