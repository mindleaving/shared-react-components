import Flatpickr, { OptionsType } from 'react-flatpickr';
import { isValidDate, toDateOnly } from '../../helpers/DateHelpers';
import { Row, Col, Button } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { useCallback, useMemo } from 'react';
import { format } from 'date-fns';

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
    
    const { 
        id,
        name,
        value,
        onChange: onChangeFromProps,
        disabled,
        required,
        enableTime,
        defaultHour,
        size
    } = props;

    const flatpickrOptions = useMemo(() => ({
        allowInput: true,
        enableTime: enableTime,
        time_24hr: true,
        defaultHour: defaultHour,
        mode: 'single',
        static: props.static,
        locale: {
            firstDayOfWeek: 1
        }
    } as OptionsType), [ enableTime, defaultHour, props.static ]);
    const parsedValue = useMemo(() => {
        if(!value) {
            return undefined;
        }
        const date = new Date(value);
        if(!isValidDate(date)) {
            return undefined;
        }
        return enableTime ? format(date, 'yyyy-MM-dd HH:mm') : format(date, 'yyyy-MM-dd');
    }, [ value, enableTime ]);
    const onChange = useCallback((dates: Date[]) => {
        if(dates.length > 0 && isValidDate(dates[0])) {
            const date = dates[0];
            onChangeFromProps(enableTime ? date.toISOString() : toDateOnly(date)); 
        } else {
            onChangeFromProps(undefined);
        }
    }, [ enableTime, onChangeFromProps ]);

    return (
    <Row className='align-items-center'>
        <Col>
            <Flatpickr
                options={flatpickrOptions}
                id={id}
                name={name}
                className="form-control"
                required={required}
                disabled={disabled}
                value={parsedValue ?? ''}
                onChange={onChange} 
            />
        </Col>
        <Col xs="auto" className="no-print">
            <Button
                onClick={() => {
                    const now = new Date();
                    if(enableTime) {
                        onChangeFromProps(now.toISOString());
                    } else {
                        onChangeFromProps(toDateOnly(now) as any);
                    }
                }}
                size={size}
            >
                {enableTime ? resolveText("Now") : resolveText("Today")}
            </Button>
        </Col>
    </Row>);

}