import { ArrayFieldTemplateProps } from '@rjsf/core';
import { Button, Col, Row } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { buildWidgetProps } from '../../helpers/ReactJsonSchemaFormsHelpers';

export const BareArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
    const hasItemsWidget = props.uiSchema.items && props.uiSchema.items["ui:widget"];
    const itemsWidgetOptions = hasItemsWidget ? props.uiSchema.items["ui:options"] : undefined;

    const Widget = hasItemsWidget ? props.uiSchema.items["ui:widget"] : undefined;
    return (
    <>
        {props.TitleField(props as any)}
        {props.DescriptionField(props as any)}
        {props.items.map((item,index) => (
            <Row 
                key={index} 
                className='align-items-center'
            >
                <Col>
                    {hasItemsWidget ?
                    <Widget 
                        {...buildWidgetProps(item.children, itemsWidgetOptions)}
                    />
                    : item.children}
                </Col>
                <Col xs="auto">
                    <Button 
                        variant="danger" 
                        className="mt-2" 
                        onClick={() => item.onDropIndexClick(index)()}
                    >
                        <i className='fa fa-trash' /> {resolveText("Delete")}
                    </Button>
                </Col>
            </Row>
        ))}
        {props.canAdd
        ? <Button 
            className='m-2' 
            size="sm" 
            onClick={props.onAddClick}
        >
            {resolveText("Add")}
        </Button> : null}
    </>);

}