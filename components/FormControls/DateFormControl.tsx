import Flatpickr from 'react-flatpickr';
import { toDateOnly } from '../../helpers/DateHelpers';
import { Row, Col, Button } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';

interface DateFormControlProps {
    id?: string;
    name?: string;
    value?: string,
    onChange: (date: string | undefined) => void;
    disabled?: boolean;
    required?: boolean;
    enableTime?: boolean;
    defaultHour?: number;
    size?: "sm" | "lg";
    static?: boolean;
}

export const DateFormControl = (props: DateFormControlProps) => {

    return (
    <Row className='align-items-center'>
        <Col>
            <Flatpickr
                options={{
                    allowInput: true,
                    enableTime: props.enableTime,
                    time_24hr: true,
                    defaultHour: props.defaultHour,
                    mode: 'single',
                    static: props.static,
                    locale: {
                        firstDayOfWeek: 1
                    }
                }}
                id={props.id}
                name={props.name}
                className="form-control"
                required={props.required}
                disabled={props.disabled}
                value={props.value}
                onChange={(dates) => {
                    if(dates.length > 0) {
                        props.onChange(props.enableTime ? dates[0].toISOString() : toDateOnly(dates[0])); 
                    } else {
                        props.onChange(undefined);
                    }
                }} 
            />
        </Col>
        <Col xs="auto" className="no-print">
            <Button
                onClick={() => {
                    const now = new Date();
                    if(props.enableTime) {
                        props.onChange(now.toISOString());
                    } else {
                        props.onChange(toDateOnly(now) as any);
                    }
                }}
                size={props.size}
            >
                {props.enableTime ? resolveText("Now") : resolveText("Today")}
            </Button>
        </Col>
    </Row>);

}