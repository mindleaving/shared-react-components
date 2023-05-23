import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { Autocomplete } from './Autocomplete';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { resolveText } from '../../helpers/Globalizer';

export interface GenericAutocompleteImplementationProps<T> {
    isLoading?: boolean;
    value?: T;
    onChange: (item: T | undefined) => void;

    // From AutocompleteProps
    searchDelayInMilliseconds?: number;
    minSearchTextLength?: number;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    autoFocus?: boolean;
    autoSelectSingleItem?: boolean;
}
export interface GenericAutocompleteProps<T> extends GenericAutocompleteImplementationProps<T> {
    apiPath: string;
    displayFunc: (item: T) => string;
}

export const GenericAutocomplete = <T extends unknown>(props: GenericAutocompleteProps<T>) => {

    const autocompleteRunner = useMemo(() => new AutocompleteRunner<T>(props.apiPath, 'searchText', 10), [ props.apiPath ]);

    if(props.value || props.isLoading) {
        return (<Alert 
            variant="info"
            dismissible
            onClose={() => props.onChange(undefined)}
        >
            {props.isLoading 
            ? resolveText('Loading...') 
            : props.displayFunc(props.value!)}
        </Alert>);
    }
    return (<Autocomplete
        search={autocompleteRunner.search}
        displayNameSelector={props.displayFunc}
        onItemSelected={props.onChange}
        searchDelayInMilliseconds={props.searchDelayInMilliseconds}
        minSearchTextLength={props.minSearchTextLength}
        placeholder={props.placeholder}
        disabled={props.disabled}
        required={props.required}
        className={props.className}
        autoFocus={props.autoFocus}
        autoSelectSingleItem={props.autoSelectSingleItem}
        resetOnSelect
    />);

}