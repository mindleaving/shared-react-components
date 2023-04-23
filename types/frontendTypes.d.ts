type Update<T> = (item: T) => T;
type Group<T> = {
    key: string;
    items: T[];
}
type Groups<T> = Group<T>[];
type QueryParameter = { key: string, value: string | undefined };
type QueryParameters = { [key:string]: string | undefined } | QueryParameter[];
interface JsonWebToken {
    id: string;
    nbf: number;
    exp: number;
    iat: number;
    iss: string;
    aud: string;
    [key: string]: string
}
export interface RouteDefinition {
    path: string;
    element: ReactNode;
    audience: AccountType[];
    usesCustomLayout?: boolean;
};