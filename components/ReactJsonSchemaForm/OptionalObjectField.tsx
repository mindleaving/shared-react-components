import { FieldProps } from '@rjsf/utils';
import { Col, FormCheck, FormGroup, Row } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { uuid } from '../../helpers/uuid';

export const OptionalObjectField = (props: FieldProps) => {

    const { SchemaField } = props.registry.fields;

    const notNullProps = {
        ...props,
        schema: (props.schema.oneOf as any[])?.find(x => x.type !== 'null') ?? props.schema
    };
    return (
    <Row className='align-items-center'>
        <Col xs="auto">
            <FormGroup>
                <FormCheck
                    checked={!!props.formData}
                    onChange={e => props.onChange(e.target.checked ? { id: uuid() } : null)}
                    label={resolveText("GenericTypeForm_NullableSet")}
                />
            </FormGroup>
        </Col>
        <Col>
            {props.formData
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