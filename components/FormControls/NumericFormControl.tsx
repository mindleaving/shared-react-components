import { FormControl } from "react-bootstrap";
import { CustomFormControlProps } from "../../types/frontendTypes";
import { useRef, useState } from "react";

interface NumericFormControlProps extends CustomFormControlProps {
    value: number;
    onChange: (value: number) => void;
    autoBlur?: boolean;
    autoBlurDelayInMilliseconds?: number;
    precision?: number;
    onIsChangeInProgress: (isChangeInProgress: boolean) => void;
}

export const NumericFormControl = (props: NumericFormControlProps) => {

    const { 
        value, 
        onChange, 
        autoBlur, 
        autoBlurDelayInMilliseconds, 
        precision,
        onIsChangeInProgress
    } = props;

    const ref = useRef<HTMLInputElement>(null);
    const [ autoBlurTimeout, setAutoBlurTimeout ] = useState<NodeJS.Timeout>();

    const blur = () => {
        ref.current?.blur();
        ref.current?.focus();
    }

    return (
    <FormControl
        ref={ref}
        type="text"
        pattern="^[0-9,]+$"
        defaultValue={value.toPrecision(precision ?? 3)}
        onBlur={e => {
            onChange(Number(e.target.value.replaceAll(',', '.')));
            if(autoBlurTimeout) {
                clearTimeout(autoBlurTimeout);
            }
            onIsChangeInProgress(false);
        }}
        min={props.min}
        max={props.max}
        step={props.step}
        required={props.required}
        readOnly={props.readOnly}
        disabled={props.disabled}
        size={props.size}
        isValid={props.isValid}
        isInvalid={props.isInvalid}
        onFocus={e => e.target.select()}
        onKeyDown={e => {
            if(e.key === 'Enter') {
                blur();
                return;
            }
            if(autoBlur) {
                if(autoBlurTimeout) {
                    clearTimeout(autoBlurTimeout);
                }
                const timeout = setTimeout(blur, autoBlurDelayInMilliseconds ?? 1500);
                setAutoBlurTimeout(timeout);
            }
            onIsChangeInProgress(true);
        }}
    />);

}