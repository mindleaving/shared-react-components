import React, { PropsWithChildren, ReactNode } from 'react';
import { Accordion, Card } from 'react-bootstrap';

interface AccordionCardProps extends PropsWithChildren<{}> {
    eventKey: string;
    title: ReactNode;
    className?: string;
    bg?: string;
}

export const AccordionCard = (props: AccordionCardProps) => {

    return (
        <Card
            className={props.className}
            bg={props.bg}
        >
            <Accordion.Header className="px-3 py-2 clickable" as={Card.Header} eventKey={props.eventKey}>
                {props.title}
            </Accordion.Header>
            <Accordion.Collapse eventKey={props.eventKey}>
                <Card.Body>
                    {props.children}
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    );

}