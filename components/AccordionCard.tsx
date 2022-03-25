import React, { PropsWithChildren, ReactNode } from 'react';
import { Accordion } from 'react-bootstrap';
import '../styles/accordion-card.css';

interface AccordionCardProps extends PropsWithChildren<{}> {
    eventKey: string;
    title: ReactNode;
    className?: string;
    bg?: string;
    standalone?: boolean;
}

export const AccordionCard = (props: AccordionCardProps) => {

    const accordionItem = (
        <Accordion.Item
            className={props.className}
            eventKey={props.eventKey}
        >
            <Accordion.Button bsPrefix={`accordion-button` + (props.bg ? ` bg-${props.bg}` : '')}>
                {props.title}
            </Accordion.Button>
            <Accordion.Body>
                {props.children}
            </Accordion.Body>
        </Accordion.Item>
    );
    if(props.standalone) {
        return accordionItem;
    }
    return (
        <Accordion>
            {accordionItem}
        </Accordion>
    );

}