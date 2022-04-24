import React from 'react';
import Flatpickr from 'react-flatpickr';

interface DateRangeFormControlProps {
    value?: Date[];
    onChange: (startDate: Date, endDate: Date) => void;
    disabled?: boolean;
    required?: boolean;
    enableTime?: boolean;
}

export const DateRangeFormControl = (props: DateRangeFormControlProps) => {

    return (
        <Flatpickr
            options={{
                allowInput: true,
                enableTime: props.enableTime,
                time_24hr: true,
                mode: 'range'
            }}
            className="form-control"
            required={props.required}
            disabled={props.disabled}
            value={props.value}
            onChange={(dates) => {
                if(dates.length === 2) { 
                    props.onChange(dates[0], dates[1]); 
                }
            }} 
        />
    );

}