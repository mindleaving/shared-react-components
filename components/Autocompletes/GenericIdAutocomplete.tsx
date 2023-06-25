import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../helpers/Globalizer';
import { loadObject } from '../../helpers/LoadingHelpers';
import { uuid } from '../../helpers/uuid';
import { GenericAutocompleteImplementationProps } from './GenericAutocomplete';
import { IdAutocompleteProps } from '../../types/frontendTypes';

interface GenericIdAutocompleteProps<T> extends IdAutocompleteProps {
    autocompleteBuilder: (
        key: string,
        props: GenericAutocompleteImplementationProps<T>) => ReactNode;
    loadItemApiPathBuilder: (id: string) => string;
}

export const GenericIdAutocomplete = <T extends Models.IId>(props: GenericIdAutocompleteProps<T>) => {

    const { disabled, required } = props;
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ item, setItem ] = useState<T>();
    const key = useMemo(() => uuid(), []);

    useEffect(() => {
        if(item?.id === props.value) {
            return;
        }
        props.onChange(item?.id);
    }, [ item ]);

    useEffect(() => {
        if(!props.value) {
            return;
        }
        if(item && item.id === props.value) {
            return;
        }
        const loadItem = async () => {
            const apiPath = props.loadItemApiPathBuilder(props.value!);
            await loadObject(
                apiPath, {},
                resolveText("GenericItem_CouldNotLoad"),
                setItem,
                undefined,
                () => setIsLoading(false)
            )
        }
        loadItem();
    }, [ props.value ]);

    return (<>
    {props.autocompleteBuilder(
        key, 
        {
            isLoading: isLoading,
            value: item,
            onChange: setItem,
            disabled,
            required
        }
    )}
    </>);

}
export default GenericIdAutocomplete;