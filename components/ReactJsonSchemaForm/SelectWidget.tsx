import { GlobalUISchemaOptions, WidgetProps } from '@rjsf/utils';
import { FormControl } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { useEffect, useMemo } from 'react';

export interface SelectWidgetOptions extends GlobalUISchemaOptions {
    defaultValue?: string;
}
export const SelectWidget = (props: WidgetProps) => {

    const uiSchema = props.uiSchema;
    const options = uiSchema?.['ui:options'] as SelectWidgetOptions;
    const value = useMemo(() => props.options.enumOptions && !props.options.enumOptions.some(x => x.value === props.value)
        ? options?.defaultValue ?? ''
        : props.value ?? ''
    , [ props.value, props.options.enumOptions, options]);

    useEffect(() => {
        if(!value) {
            return;
        }
        if(props.value !== value) {
            props.onChange(value);
        }
    }, []);

    return (
        <FormControl
            as="select"
            value={value ?? ''}
            onChange={e => props.onChange(e.target.value !== '' ? e.target.value : undefined)}
            required={props.required}
            disabled={props.disabled}
        >
            <option value=''>{resolveText("PleaseSelect...")}</option>
            {(props.options.enumOptions ?? []).map(x => (
                <option key={x.value} value={x.value}>{x.label}</option>
            ))}
        </FormControl>
    );

}