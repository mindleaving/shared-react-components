import { useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";

interface DelayedFormControlProps {
    required?: boolean;
    disabled?: boolean;
    minLength?: number;
    isValid?: boolean;
    isInvalid?: boolean;
    size?: "sm" | "lg";
    placeholder?: string;
    delayInMs: number;
    value: string;
    onChange: (newValue: string) => void;
}

export const DelayedFormControl = (props: DelayedFormControlProps) => {

    const { delayInMs } = props;

    const [ value, setValue ] = useState<string>(props.value);

    useEffect(() => {
        const timeout = setTimeout(() => props.onChange(value), delayInMs);
        return () => {
            clearTimeout(timeout);
        }
    }, [ value ]);

    return (<FormControl
        required={props.required}
        disabled={props.disabled}
        minLength={props.minLength}
        isValid={props.isValid}
        isInvalid={props.isInvalid}
        size={props.size}
        placeholder={props.placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
    />);

}