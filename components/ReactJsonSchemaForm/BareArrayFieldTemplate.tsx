import { ReactNode } from 'react';
import { ArrayFieldTemplateProps } from '@rjsf/utils';
import { Button, Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';

export interface BareArrayFieldTemplateOptions {
    buttons?: ReactNode;
    overListNode?: ReactNode;
    underListNode?: ReactNode;
}
export const BareArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {

    const options = props.uiSchema?.["ui:options"] as BareArrayFieldTemplateOptions;
    const buttons = options?.buttons;

    return (
    <FormGroup>
        <Row>
            <Col>
                <FormLabel>
                    <h5>{props.title}</h5>
                </FormLabel>
            </Col>
            {buttons
            ? <Col xs="auto">
                {buttons}
            </Col> : null}
        </Row>
        {options?.overListNode}
        {props.items}
        {props.canAdd
        ? <Button 
            className='d-block m-2' 
            size="sm" 
            onClick={props.onAddClick}
        >
            {resolveText("Add")}
        </Button> : null}
        {options?.underListNode}
    </FormGroup>);

}