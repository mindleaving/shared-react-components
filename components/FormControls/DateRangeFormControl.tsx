import React from 'react';
import Flatpickr from 'react-flatpickr';

interface DateRangeFormControlProps {
    value?: string[];
    onChange: (startDate: string | undefined, endDate: string | undefined) => void;
    disabled?: boolean;
    required?: boolean;
    enableTime?: boolean;
    noCalendar?: boolean;
    triggerOnChangeForUndefinedRange?: boolean;
    static?: boolean;
}

export const DateRangeFormControl = (props: DateRangeFormControlProps) => {

    return (
        <Flatpickr
            options={{
                allowInput: true,
                noCalendar: props.noCalendar,
                enableTime: props.enableTime,
                time_24hr: true,
                mode: 'range',
                static: props.static
            }}
            className="form-control"
            required={props.required}
            disabled={props.disabled}
            value={props.value}
            onChange={(dates) => {
                if(dates.length === 2) { 
                    props.onChange(dates[0].toISOString(), dates[1].toISOString()); 
                } else if(props.triggerOnChangeForUndefinedRange) {
                    props.onChange(undefined, undefined);
                }
            }} 
        />
    );

}