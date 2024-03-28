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
    usesCustomLayout?: boolean;
};
export interface IdAutocompleteProps {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    disabled?: boolean;
    required?: boolean;
}
export interface FormStepProps<T> {
    formData: T;
    onChange: (update: Update<T>) => void;
}
export interface FormStep<T> {
    title: string;
    element: (props: FormStepProps<T>) => ReactNode;
    canMovePrevious?: (formData: T) => boolean;
    canMoveNext?: (formData: T) => boolean;
}