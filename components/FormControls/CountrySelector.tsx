import { FormControl } from "react-bootstrap";
import { Country } from "../../../localComponents/types/enums";
import { resolveText } from "../../helpers/Globalizer";

interface CountrySelectorProps {
    value: Country;
    onChange: (country: Country) => void;
}

export const CountrySelector = (props: CountrySelectorProps) => {

    const { value, onChange } = props;

    return (<FormControl
        as="select"
        value={value}
        onChange={e => onChange(e.target.value as Country)}
    >
        {Object.values(Country).map(x => (
            <option key={x} value={x}>{x} - {resolveText(`Country_${x}`)}</option>
        ))}
    </FormControl>);

}