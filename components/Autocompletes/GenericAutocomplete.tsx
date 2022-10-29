import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { Autocomplete } from './Autocomplete';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { resolveText } from '../../helpers/Globalizer';

export interface GenericAutocompleteProps<T> {
    apiPath: string;
    isLoading?: boolean;
    value?: T;
    onChange: (item: T | undefined) => void;
    displayFunc: (item: T) => string;
    required?: boolean;
    minSearchTextLength?: number;
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
        required={props.required}
        search={autocompleteRunner.search}
        displayNameSelector={props.displayFunc}
        onItemSelected={props.onChange}
        minSearchTextLength={props.minSearchTextLength}
    />);

}