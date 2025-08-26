import { ArrayFieldTemplateProps } from '@rjsf/utils';
import { Button, Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';

export const BareArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {

    return (
    <FormGroup>
        <FormLabel>{props.title}</FormLabel>
        {props.items.map((item,index) => (
            <Row 
                key={index} 
                className='align-items-center mb-1 ms-3'
            >
                <Col>
                    {item.children}
                </Col>
                <Col xs="auto">
                    <Button 
                        variant="danger"
                        onClick={() => item.onDropIndexClick(index)()}
                    >
                        <i className='fa fa-trash' /> {resolveText("Delete")}
                    </Button>
                </Col>
            </Row>
        ))}
        {props.canAdd
        ? <Button 
            className='d-block m-2' 
            size="sm" 
            onClick={props.onAddClick}
        >
            {resolveText("Add")}
        </Button> : null}
    </FormGroup>);

}