import { PropsWithChildren, useEffect, useState } from 'react';
import { AccordionCard } from './AccordionCard';
import { resolveText } from '../helpers/Globalizer';
import { ApiGetActionCreator } from '../../sharedHealthComponents/types/reduxTypes';
import { RootState, useAppDispatch, useAppSelector } from '../../localComponents/redux/store/healthRecordStore';

interface GenericFilterViewProps<ArgsType,ItemType> {
    filterSelector: (state: RootState) => any;
    loadItems: ApiGetActionCreator<ArgsType,ItemType>;
}

export const GenericFilterView = <ArgsType,ItemType>(props: PropsWithChildren<GenericFilterViewProps<ArgsType,ItemType>>) => {

    const dispatch = useAppDispatch();
    const filter = useAppSelector(props.filterSelector);
    const [ searchTimeout, setSearchTimeout ] = useState<NodeJS.Timeout>();

    useEffect(() => {
        if(searchTimeout) {
            clearTimeout(searchTimeout);
        }
        const timeout = setTimeout(() => dispatch(props.loadItems({})), 300);
        setSearchTimeout(timeout);
    }, [ filter, dispatch ]);

    return (
        <AccordionCard standalone
            eventKey='filter'
            title={resolveText("Filters")}
            bg='info'
            headerClassName='py-2'
            className='mb-2'
        >
            {props.children}
        </AccordionCard>
    );

}