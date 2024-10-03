import { FormControl } from "react-bootstrap";
import { CustomFormControlProps } from "../../types/frontendTypes";
import { resolveText } from "../../helpers/Globalizer";

interface SelectFormControlProps extends CustomFormControlProps {
    enumValues: string[];
    enumName: string;
    value?: string;
    onChange: (value: string) => void;
}

export const SelectFormControl = (props: SelectFormControlProps) => {

    const { 
        enumValues, 
        enumName, 
        value, 
        onChange,
        required,
        readOnly,
        disabled,
    } = props;

    return (<FormControl
        as="select"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        isValid={props.isValid}
        isInvalid={props.isInvalid}
        aria-describedby={props.ariaDescribedBy}
    >
        {Object.values(enumValues).map(x => (
            <option key={x} value={x}>{resolveText(`${enumName}_${x}`)}</option>
        ))}
    </FormControl>);

}