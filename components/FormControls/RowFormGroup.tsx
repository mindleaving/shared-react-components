import { ElementType, PropsWithChildren } from 'react';
import { Col, FormCheck, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { DateFormControl } from './DateFormControl';

interface RowFormGroupProps {
    label: string;
    as?: ElementType<any>;
    type?: string;
    value: any;
    min?: number,
    max?: number,
    onChange: (changedValue: any) => void;
    disabled?: boolean;
    required?: boolean;
}

export const RowFormGroup = (props: PropsWithChildren<RowFormGroupProps>) => {

    return (
        <FormGroup as={Row} className='my-1'>
            <FormLabel column>{props.label}</FormLabel>
            <Col>
                {props.type?.toLowerCase() === "date" || props.type?.toLowerCase() === "datetime"
                ? <DateFormControl
                    required={props.required}
                    disabled={props.disabled}
                    enableTime={props.type!.toLowerCase() === "datetime"}
                    value={props.value}
                    onChange={props.onChange}
                />
                : props.type?.toLowerCase() === "checkbox"
                ? <FormCheck
                    required={props.required}
                    checked={props.value}
                    onChange={(e:any) => props.onChange(e.target.checked)}
                    disabled={props.disabled}
                />
                : <FormControl
                    required={props.required}
                    as={props.as}
                    type={props.type}
                    value={props.value}
                    min={props.min}
                    max={props.max}
                    onChange={(e:any) => props.onChange(e.target.value)}
                    disabled={props.disabled}
                >
                    {props.children}
                </FormControl>
                }
            </Col>
        </FormGroup>
    );

}