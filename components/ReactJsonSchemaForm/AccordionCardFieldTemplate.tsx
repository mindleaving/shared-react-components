import { FieldTemplateProps } from '@rjsf/utils';
import { AccordionCard } from '../AccordionCard';

export interface AccordionCardFieldTemplateOptions {
    isOpenAtCreate?: boolean;
}

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

    const options = props.uiSchema?.['ui:options'] as any as AccordionCardFieldTemplateOptions;
    const isOpenAtCreate = options?.isOpenAtCreate ?? false;
    
    return (
        <AccordionCard 
            standalone 
            isOpenAtCreate={isOpenAtCreate}
            title={props.label}
            eventKey={props.id}
            headerClassName='py-2 border border-secondary'
        >
            {props.description}
            {props.children}
            {props.errors}
            {props.help}
        </AccordionCard>
    );

}