import Flatpickr, { OptionsType } from 'react-flatpickr';
import { isValidDate, parseDateInput, toDateOnly } from '../../helpers/DateHelpers';
import { Row, Col, Button } from 'react-bootstrap';
import { getPreferredLanguage, resolveText } from '../../helpers/Globalizer';
import { FocusEvent, KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { combineCssClasses } from '../../helpers/StylingHelpers';

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
    autoFocus?: boolean;
    placeholder?: string;
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
        size,
        autoFocus,
        placeholder
    } = props;

    const [ localValue, setLocalValue ] = useState<string>('');

    const formatValue = useCallback((date: Date) => format(date, enableTime ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'), [ enableTime ]);

    useEffect(() => {
        if(!value) {
            setLocalValue('');
        } else {
            setLocalValue(formatValue(new Date(value)));
        }
    }, [ value, formatValue ]);

    const flatpickrOptions = useMemo(() => ({
        allowInput: true,
        enableTime: enableTime,
        time_24hr: true,
        defaultHour: defaultHour,
        mode: 'single',
        static: props.static,
        parseDate: (dateString: string) => parseDateInput(dateString, getPreferredLanguage(), enableTime) as Date,
        locale: {
            firstDayOfWeek: 1
        }
    } as OptionsType), [ enableTime, defaultHour, props.static ]);

    const commitDate = useCallback((date: Date | undefined) => {
        if(!date || !isValidDate(date)) {
            if(value) {
                onChangeFromProps(undefined);
            }
            return;
        }
        setLocalValue(formatValue(date));
        const newValue = enableTime ? date.toISOString() : toDateOnly(date);
        if(newValue !== value) {
            onChangeFromProps(newValue);
        }
    }, [ value, enableTime, formatValue, onChangeFromProps ]);

    const commitInput = useCallback((input: string) => {
        commitDate(parseDateInput(input, getPreferredLanguage(), enableTime));
    }, [ enableTime, commitDate ]);

    return (
    <Row className='align-items-center'>
        <Col className='pe-1'>
            <Flatpickr
                options={flatpickrOptions}
                id={id}
                name={name}
                className={combineCssClasses([
                    "form-control",
                    size ? `form-control-${size}` : undefined
                ])}
                required={required}
                disabled={disabled}
                value={localValue}
                onChange={(_dates,_dateStr,instance) => setLocalValue(instance.input.value)}
                onClose={(_dates,_dateStr,instance) => commitInput(instance.input.value)}
                onBlur={(e: FocusEvent<HTMLInputElement>) => commitInput(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if(e.key === 'Enter') {
                        commitInput(e.currentTarget.value);
                    }
                }}
                autoFocus={autoFocus}
                placeholder={placeholder}
            />
        </Col>
        <Col xs="auto" className="no-print ps-1">
            <Button
                onClick={() => commitDate(new Date())}
                size={size}
            >
                {enableTime ? resolveText("Now") : resolveText("Today")}
            </Button>
        </Col>
    </Row>);

}