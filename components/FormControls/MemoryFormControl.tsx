import React, { useMemo } from 'react';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { Autocomplete } from '../Autocompletes/Autocomplete';

interface MemoryFormControlProps {
    context: string;
    onChange: (value: string) => void;
    defaultValue?: string;
    placeholder?: string;
    minSearchTextLength?: number;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    size?: "sm" | "lg";
}

export const MemoryFormControl = (props: MemoryFormControlProps) => {

    const autocompleteRunner = useMemo(() => new AutocompleteRunner<string>(`api/autocomplete/${props.context}`, 'searchText', 10), [ props.context ]);
    return (
        <Autocomplete
            className={props.className}
            defaultValue={props.defaultValue}
            search={autocompleteRunner.search}
            displayNameSelector={x => x}
            onItemSelected={props.onChange}
            onSearchTextChange={props.onChange}
            placeholder={props.placeholder}
            minSearchTextLength={props.minSearchTextLength}
            disabled={props.disabled}
            size={props.size}
        />
    );

}