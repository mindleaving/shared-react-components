import { FieldProps } from '@rjsf/utils';
import { FormCheck, FormGroup } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { uuid } from '../../helpers/uuid';

export const OptionalObjectField = (props: FieldProps) => {

    const { SchemaField } = props.registry.fields;

    const notNullProps = {
        ...props,
        schema: (props.schema.oneOf as any[])?.find(x => x.type !== 'null') ?? props.schema
    };
    return (
        <>
            <FormGroup>
                <FormCheck
                    checked={!!props.formData}
                    onChange={e => props.onChange(e.target.checked ? { id: uuid() } : null)}
                    label={resolveText("GenericTypeForm_NullableSet")}
                />
            </FormGroup>
            {!!props.formData
            ? <SchemaField
                {...notNullProps}
            /> : null}
        </>
    );

}