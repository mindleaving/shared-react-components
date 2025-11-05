import { FieldProps } from '@rjsf/utils';
import { Col, FormCheck, FormGroup, Row } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { uuid } from '../../helpers/uuid';
import { useRjsfFieldOnChange } from '../../helpers/ReactJsonSchemaFormsHelpers';

export const OptionalObjectField = (props: FieldProps) => {

    const { formData, fieldPathId, onChange, schema, registry } = props;

    const { SchemaField } = registry.fields;
    const notNullProps = {
        ...props,
        schema: (schema.oneOf as any[])?.find(x => x.type !== 'null') ?? schema
    };

    const localOnChange = useRjsfFieldOnChange(fieldPathId, onChange);
    
    return (
    <Row className='align-items-center'>
        <Col xs="auto">
            <FormGroup>
                <FormCheck
                    checked={!!formData}
                    onChange={e => localOnChange(e.target.checked ? { id: uuid() } : null)}
                    label={resolveText("GenericTypeForm_NullableSet")}
                />
            </FormGroup>
        </Col>
        <Col>
            {formData
            ? <SchemaField
                {...notNullProps}
                uiSchema={{
                    ...notNullProps.uiSchema,
                    "ui:options": notNullProps.uiSchema?.['ui:options']
                    ? {
                        ...notNullProps.uiSchema['ui:options'],
                        label: false
                    }
                    : { label: false }
                }}
            /> : null}
        </Col>
    </Row>);

}