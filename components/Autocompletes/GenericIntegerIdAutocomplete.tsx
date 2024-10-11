import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../helpers/Globalizer';
import { loadObject } from '../../helpers/LoadingHelpers';
import { uuid } from '../../helpers/uuid';
import { GenericAutocompleteImplementationProps } from './GenericAutocomplete';

interface GenericIntegerIdAutocompleteProps<T> {
    value: number | null | undefined;
    onChange: (value: number | undefined) => void;
    disabled?: boolean;
    required?: boolean;
    autocompleteBuilder: (
        key: string,
        props: GenericAutocompleteImplementationProps<T>) => ReactNode;
    loadItemApiPathBuilder: (id: number) => string;
}

export const GenericIntegerIdAutocomplete = <T extends Models.IId<number>>(props: GenericIntegerIdAutocompleteProps<T>) => {

    const { value, onChange, disabled, required } = props;
    const [ isLoading, setIsLoading ] = useState<boolean>(!!value);
    const [ item, setItem ] = useState<T>();
    const key = useMemo(() => uuid(), []);

    useEffect(() => {
        if(isLoading) {
            return;
        }
        if(item?.id === value) {
            return;
        }
        onChange(item?.id);
    }, [ item ]);

    useEffect(() => {
        if(!value) {
            return;
        }
        if(item && item.id === value) {
            return;
        }
        const loadItem = async () => {
            const apiPath = props.loadItemApiPathBuilder(value!);
            await loadObject(
                apiPath, {},
                resolveText("GenericItem_CouldNotLoad"),
                setItem,
                undefined,
                () => setIsLoading(false)
            )
        }
        loadItem();
    }, [ value ]);

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