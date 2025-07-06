import { FormControl } from "react-bootstrap";
import { CustomFormControlProps } from "../../types/frontendTypes";
import { useCallback, useEffect, useRef, useState } from "react";

interface NumericFormControlProps extends CustomFormControlProps {
    value: number;
    onChange: (value: number) => void;
    autoBlur?: boolean;
    autoBlurDelayInMilliseconds?: number;
    precision?: number;
    decimals?: number;
    onIsChangeInProgress?: (isChangeInProgress: boolean) => void;
}

const formatNumber = (value: number, decimals?: number, precision?: number) => {
    if(decimals) {
        return value.toFixed(decimals);
    }
    if(precision) {
        if(value >= Math.pow(10, precision)) {
            return value.toFixed(0);
        }
        return value.toPrecision(precision);
    }
    return value.toFixed(0);
}
export const NumericFormControl = (props: NumericFormControlProps) => {

    const { 
        value, 
        onChange, 
        autoBlur, 
        autoBlurDelayInMilliseconds, 
        precision,
        decimals,
        onIsChangeInProgress
    } = props;

    const ref = useRef<HTMLInputElement>(null);
    const [ inputValue, setInputValue ] = useState<string>(formatNumber(value, decimals, precision));
    const [ autoBlurTimeout, setAutoBlurTimeout ] = useState<NodeJS.Timeout>();

    const blur = () => {
        ref.current?.blur();
        ref.current?.focus();
    }

    const commit = () => {
        onChange(Number(inputValue));
    }

    useEffect(() => {
        setInputValue(formatNumber(value, decimals, precision));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ value ]);

    return (
    <FormControl
        ref={ref}
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value.replaceAll(',', '.'))}
        onBlur={() => {
            commit();
            if(autoBlurTimeout) {
                clearTimeout(autoBlurTimeout);
            }
            if(onIsChangeInProgress) {
                onIsChangeInProgress(false);
            }
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
            if(onIsChangeInProgress) {
                onIsChangeInProgress(true);
            }
        }}
    />);

}