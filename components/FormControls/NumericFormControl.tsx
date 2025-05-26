import { FormControl } from "react-bootstrap";
import { CustomFormControlProps } from "../../types/frontendTypes";

interface NumericFormControlProps extends CustomFormControlProps {
    value: number;
    onChange: (value: number) => void;
}

export const NumericFormControl = (props: NumericFormControlProps) => {

    const { value, onChange } = props;

    return (
    <FormControl
        type="text"
        defaultValue={value}
        onBlur={e => onChange(Number(e.target.value.replaceAll(',', '.')))}
        min={props.min}
        max={props.max}
        step={props.step}
        required={props.required}
        readOnly={props.readOnly}
        disabled={props.disabled}
        size={props.size}
        isValid={props.isValid}
        isInvalid={props.isInvalid}
    />);

}