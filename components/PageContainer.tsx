import { PropsWithChildren } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export const PageContainer = (props: PropsWithChildren<{}>) => {
    return (
    <Container style={{ maxWidth: '90%' }}>
        <Row>
            <Col>{props.children}</Col>
        </Row>
    </Container>
    );
}
export default PageContainer;