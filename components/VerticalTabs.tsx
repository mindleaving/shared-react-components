import { PropsWithChildren, ReactNode } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface VerticalTabsProps extends PropsWithChildren {
    tabSelectorButtons: ReactNode[];
}

export const VerticalTabs = (props: VerticalTabsProps) => {

    const { tabSelectorButtons } = props;

    return (<Card>
        <Card.Body>
            <Row className="g-3">
                <Col 
                    lg={3} xl={2}
                    className="bg-light p-0"
                >
                    <div className="d-flex flex-column">
                        {tabSelectorButtons}
                    </div>
                </Col>
                <Col>
                    {props.children}
                </Col>
            </Row>
        </Card.Body>
    </Card>);

}