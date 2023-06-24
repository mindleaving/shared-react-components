import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../helpers/Globalizer';
import { loadObject } from '../../helpers/LoadingHelpers';
import { uuid } from '../../helpers/uuid';

interface GenericIdAutocompleteProps<T> {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    autocompleteBuilder: (
        key: string,
        onChange: (item: T | undefined) => void, 
        isLoading: boolean,
        value?: T) => ReactNode;
    loadItemApiPathBuilder: (id: string) => string;
}

export const GenericIdAutocomplete = <T extends Models.IId>(props: GenericIdAutocompleteProps<T>) => {

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

    return (<>{props.autocompleteBuilder(key, setItem, isLoading, item)}</>);

}
export default GenericIdAutocomplete;