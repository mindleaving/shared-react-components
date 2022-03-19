import React, { PropsWithChildren, ReactNode } from 'react';
import { Accordion } from 'react-bootstrap';
import '../styles/accordion-card.css';

interface AccordionCardProps extends PropsWithChildren<{}> {
    eventKey: string;
    title: ReactNode;
    className?: string;
    bg?: string;
}

export const AccordionCard = (props: AccordionCardProps) => {

    return (
        <Accordion>
        <Accordion.Item
            className={"accordion-card" + (props.className ? " " + props.className : "")}
            eventKey={props.eventKey}
        >
            <Accordion.Header>
                {props.title}
            </Accordion.Header>
            <Accordion.Body>
                {props.children}
            </Accordion.Body>
        </Accordion.Item>
        </Accordion>
    );

}