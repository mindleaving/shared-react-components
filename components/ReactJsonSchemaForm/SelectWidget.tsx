import { WidgetProps } from '@rjsf/utils';
import { FormControl } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';

export const SelectWidget = (props: WidgetProps) => {

    return (
        <FormControl
            as="select"
            value={props.value ?? ''}
            onChange={e => props.onChange(e.target.value)}
        >
            <option value='' disabled>{resolveText("PleaseSelect...")}</option>
            {(props.options.enumOptions ?? []).map(x => (
                <option key={x.value} value={x.value}>{x.label}</option>
            ))}
        </FormControl>
    );

}