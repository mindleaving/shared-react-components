type Update<T> = (item: T) => T;
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