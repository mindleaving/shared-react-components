import { ArrayFieldItemTemplateProps } from "@rjsf/utils";
import { Row, Col, Button } from "react-bootstrap";
import { resolveText } from "../../helpers/Globalizer";

export const BareArrayFieldItemTemplate = (props: ArrayFieldItemTemplateProps) => {

    const { children, buttonsProps, itemKey } = props;

    return (<Row 
        className='align-items-center mb-1 ms-3'
        data-rjsf-itemkey={itemKey}
    >
        <Col>
            {children}
        </Col>
        <Col xs="auto">
            <Button 
                variant="danger"
                onClick={buttonsProps.onRemoveItem}
            >
                <i className='fa fa-trash' /> {resolveText("Delete")}
            </Button>
        </Col>
    </Row>);

}