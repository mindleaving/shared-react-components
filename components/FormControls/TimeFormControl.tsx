import Flatpickr, { OptionsType } from 'react-flatpickr';
import { Row, Col, Button } from "react-bootstrap";
import { toTimeOnly } from "../../helpers/DateHelpers";
import { resolveText } from "../../helpers/Globalizer";
import { useCallback, useMemo } from 'react';

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

    const onChange = useCallback((dates: Date[], dateString: string) => {
        if(dates.length > 0) { 
            onChangeFromProps(toTimeOnly(dates[0]));
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
                value={value}
                onChange={onChange}
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