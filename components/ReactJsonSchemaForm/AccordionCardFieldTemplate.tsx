import { FieldTemplateProps } from '@rjsf/utils';
import { AccordionCard } from '../AccordionCard';

export const AccordionCardFieldTemplate = (props: FieldTemplateProps) => {

    if(props.schema.type === 'null') {
        return null;
    }
    if(props.schema.oneOf || props.schema.anyOf || props.schema.allOf) {
        return (<div id={props.id}>
            <label htmlFor={props.id}>{props.label}{props.required ? '*' : ''}</label>
            {props.description}
            {props.children}
            {props.errors}
            {props.help}
        </div>)
    }
    
    return (
        <AccordionCard standalone isOpenAtCreate
            title={props.label}
            eventKey={props.id}
        >
            {props.description}
            {props.children}
            {props.errors}
            {props.help}
        </AccordionCard>
    );

}