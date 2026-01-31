import { addDays } from 'date-fns';
import { Row, Col, Button } from 'react-bootstrap';
import { DateFormControl } from './FormControls/DateFormControl';
import { PropsWithChildren } from 'react';

interface DateSelectionRowProps extends PropsWithChildren {
    date: string;
    onChange: (date: string) => void;
    size?: 'sm' | 'lg';
}
export const DateSelectionRow = (props: DateSelectionRowProps) => {

    const { date: selectedDate, onChange, size } = props;

    return (<Row className='align-items-center'>
        <Col>{props.children}</Col>
        <Col xs="auto" className='pe-1'>
            <Button
                onClick={() => onChange(addDays(new Date(selectedDate), -1).toISOString())}
                size={size}
            >
                &lt;
            </Button>
        </Col>
        <Col xs="auto" style={{ maxWidth: '240px' }} className='px-1'>
            <DateFormControl
                value={selectedDate}
                onChange={date => {
                    if(date) {
                        onChange(date);
                    }
                }}
                size={size}
            />
        </Col>
        <Col xs="auto" className='ps-1'>
            <Button
                onClick={() => onChange(addDays(new Date(selectedDate), 1).toISOString())}
                size={size}
            >
                &gt;
            </Button>
        </Col>
    </Row>);
}
export default DateSelectionRow;