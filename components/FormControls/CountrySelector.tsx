import { FormSelect } from "react-bootstrap";
import { Country } from "../../../localComponents/types/enums";
import { resolveText } from "../../helpers/Globalizer";
import { CustomFormControlProps } from "../../types/frontendTypes";

interface CountrySelectorProps extends CustomFormControlProps {
    value: Country;
    onChange: (country: Country) => void;
}

export const CountrySelector = (props: CountrySelectorProps) => {

    const { value, onChange, required } = props;

    return (<FormSelect
        value={value}
        onChange={e => onChange(e.target.value as Country)}
        required={required}
        disabled={props.disabled || props.readOnly}
        size={props.size}
        isValid={props.isValid}
        isInvalid={props.isInvalid}
        aria-describedby={props.ariaDescribedBy}
    >
        {Object.values(Country).map(x => (
            <option key={x} value={x}>{x} - {resolveText(`Country_${x}`)}</option>
        ))}
    </FormSelect>);

}