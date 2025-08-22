import Flatpickr, { OptionsType } from 'react-flatpickr';
import { Row, Col, Button } from "react-bootstrap";
import { isValidDate, toTimeOnly } from "../../helpers/DateHelpers";
import { resolveText } from "../../helpers/Globalizer";
import { useCallback, useEffect, useMemo, useState } from 'react';

interface TimeFormControlProps {
    id?: string;
    name?: string;
    value?: string,
    onChange: (time: string | undefined) => void;
    disabled?: boolean;
    required?: boolean;
    size?: "sm" | "lg";
    static?: boolean;
    enableSeconds?: boolean;
}

export const TimeFormControl = (props: TimeFormControlProps) => {

    const { id, name, value, onChange: onChangeFromProps, enableSeconds, required, disabled} = props;

    const [ localValue, setLocalValue ] = useState<string>('');

    useEffect(() => {
        if(value && /^[0-2]?[0-9]:[0-5][0-9](:[0-5][0-9])?$/.test(value)) {
            if(!enableSeconds) {
                const splitted = value.split(':');
                setLocalValue(`${splitted[0]}:${splitted[1]}`);
            } else {
                setLocalValue(value);
            }
        } else {
            setLocalValue('');
        }
        setLocalValue(value ?? '');
    }, [ value, enableSeconds ]);

    const flatpickrOptions = useMemo(() => ({
        noCalendar: true,
        allowInput: true,
        enableTime: true,
        time_24hr: true,
        minuteIncrement: 1,
        enableSeconds: enableSeconds ?? false,
        mode: 'single',
        static: props.static
    } as OptionsType), [ enableSeconds, props.static ]);

    const onChange = useCallback((dates: Date[]) => {
        if(dates.length > 0 && isValidDate(dates[0])) {
            const time = toTimeOnly(dates[0]);
            onChangeFromProps(time);
        } else {
            onChangeFromProps(undefined);
        }
    }, [ onChangeFromProps ]);
    
    return (
    <Row>
        <Col>
            <Flatpickr
                options={flatpickrOptions}
                id={id}
                name={name}
                className="form-control"
                required={required}
                disabled={disabled}
                value={localValue}
                onChange={(_dates,_dateStr,instance) => setLocalValue(instance.input.value)}
                onClose={onChange}
            />
        </Col>
        <Col xs="auto">
            <Button
                onClick={() => onChangeFromProps(toTimeOnly(new Date()))}
            >
                {resolveText("Now")}
            </Button>
        </Col>
    </Row>);

}