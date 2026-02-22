import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Models } from '../../../localComponents/types/models';
import { uuid } from '../../helpers/uuid';
import { GenericAutocompleteImplementationProps } from './GenericAutocomplete';
import { IdAutocompleteProps } from '../../types/frontendTypes';
import { ApiGetActionCreator, SliceStateSelector } from '../../../sharedHealthComponents/types/reduxTypes';
import { useMemorizedSelector } from '../../../sharedHealthComponents/redux/helpers/ReduxHooks';
import { RootState, useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { LoadItemArgs } from '../../../sharedHealthComponents/types/reduxInterfaces';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

interface GenericReduxLoaderIdAutocompleteProps<
    ItemType extends Models.IId<string>,
    ViewModelType extends ItemType,
    FilterType> extends IdAutocompleteProps 
{
    autocompleteBuilder: (
        key: string,
        props: GenericAutocompleteImplementationProps<ViewModelType>) => ReactNode;
    sliceSelector: SliceStateSelector<ItemType,ViewModelType,FilterType>;
    itemSelectorFactory: () => (state: RootState, args: { id?: string }) => ViewModelType | undefined;
    loadIfNotLoadedYetAction: ApiGetActionCreator<LoadItemArgs,ViewModelType>;
    addOrUpdateItemAction: ActionCreatorWithPayload<ViewModelType>;
}

export const GenericReduxLoaderIdAutocomplete = <
    ItemType extends Models.IId<string>, 
    ViewModelType extends ItemType,
    FilterType>(
        props: GenericReduxLoaderIdAutocompleteProps<ItemType,ViewModelType,FilterType>
    ) => {

    const { 
        value, 
        onChange, 
        disabled, 
        required, 
        placeholder,
        sliceSelector,
        itemSelectorFactory,
        loadIfNotLoadedYetAction,
        addOrUpdateItemAction
    } = props;

    const isLoading = useAppSelector(state => sliceSelector(state).isLoading);
    const item = useMemorizedSelector(itemSelectorFactory, { id: value ?? undefined });
    const key = useMemo(() => uuid(), []);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!value) {
            return;
        }
        if(item && item.id === value) {
            return;
        }
        dispatch(loadIfNotLoadedYetAction({
            args: {
                itemId: value
            }
        }));
    }, [ value ]);

    const setItem = useCallback((changedValue: ViewModelType | undefined) => {
        if(!!changedValue) {
            dispatch(addOrUpdateItemAction(changedValue));
        }
        onChange(changedValue?.id);
    }, [ onChange ]);

    return (<>
    {props.autocompleteBuilder(
        key, 
        {
            isLoading: isLoading,
            value: item,
            onChange: setItem,
            disabled,
            required,
            placeholder
        }
    )}
    </>);

}