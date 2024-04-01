import Flatpickr from 'react-flatpickr';
import { toDateOnly } from '../../helpers/DateHelpers';
import { Row, Col, Button } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';

interface DateFormControlProps {
    id?: string;
    name?: string;
    value?: Date,
    onChange: (date: Date | undefined) => void;
    disabled?: boolean;
    required?: boolean;
    enableTime?: boolean
}

export const DateFormControl = (props: DateFormControlProps) => {

    return (
    <Row>
        <Col>
            <Flatpickr
                options={{
                    allowInput: true,
                    enableTime: props.enableTime,
                    time_24hr: true,
                    mode: 'single'
                }}
                id={props.id}
                name={props.name}
                className="form-control"
                required={props.required}
                disabled={props.disabled}
                value={props.value}
                onChange={(dates) => {
                    if(dates.length > 0) {
                        props.onChange(props.enableTime ? dates[0].toISOString() as any : toDateOnly(dates[0])); 
                    } else {
                        props.onChange(undefined);
                    }
                }} 
            />
        </Col>
        <Col xs="auto">
            <Button
                onClick={() => {
                    const now = new Date();
                    if(props.enableTime) {
                        props.onChange(now.toISOString() as any);
                    } else {
                        props.onChange(toDateOnly(now) as any);
                    }
                }}
            >
                {props.enableTime ? resolveText("Now") : resolveText("Today")}
            </Button>
        </Col>
    </Row>);

}