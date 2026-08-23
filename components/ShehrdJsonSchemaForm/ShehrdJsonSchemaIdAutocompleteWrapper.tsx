import { JSX } from "react/jsx-runtime";
import { IdAutocompleteProps } from "../../types/frontendTypes";
import { ShehrdJsonSchemaCustomFormControlProps } from "../../types/shehrdJsonSchemaFormTypes";

interface ShehrdJsonSchemaIdAutocompleteWrapperProps {
    props: ShehrdJsonSchemaCustomFormControlProps;
    idAutocomplete: (props: IdAutocompleteProps) => JSX.Element;
}

export const ShehrdJsonSchemaIdAutocompleteWrapper = (props: ShehrdJsonSchemaIdAutocompleteWrapperProps) => {

    const { props: innerProps, idAutocomplete } = props;

    return idAutocomplete({
        required: innerProps.required,
        value: innerProps.value as string | undefined,
        onChange: newValue => innerProps.onChange(() => newValue),
        disabled: innerProps["disabled"] as boolean ?? false,
        placeholder: innerProps["placeholder"] as string
    });

}