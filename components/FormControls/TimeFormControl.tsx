import Flatpickr from 'react-flatpickr';
import { Row, Col, Button } from "react-bootstrap";
import { toTimeOnly } from "../../helpers/DateHelpers";
import { resolveText } from "../../helpers/Globalizer";

interface TimeFormControlProps {
    id?: string;
    name?: string;
    value?: string,
    onChange: (time: string | undefined) => void;
    disabled?: boolean;
    required?: boolean;
    size?: "sm" | "lg";
    static?: boolean;
}

export const TimeFormControl = (props: TimeFormControlProps) => {

    return (
    <Row>
        <Col>
            <Flatpickr
                options={{
                    noCalendar: true,
                    allowInput: true,
                    enableTime: true,
                    time_24hr: true,
                    minuteIncrement: 1,
                    mode: 'single',
                    static: props.static
                }}
                id={props.id}
                name={props.name}
                className="form-control"
                required={props.required}
                disabled={props.disabled}
                value={props.value}
                onChange={(dates: Date[]) => {
                    if(dates.length > 0) { 
                        props.onChange(toTimeOnly(dates[0]));
                    } else {
                        props.onChange(undefined);
                    }
                }}
            />
        </Col>
        <Col xs="auto">
            <Button
                onClick={() => props.onChange(toTimeOnly(new Date()))}
            >
                {resolveText("Now")}
            </Button>
        </Col>
    </Row>);

}