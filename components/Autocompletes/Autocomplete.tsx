import { KeyboardEvent, useEffect, useMemo, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { defaultGlobalizer, resolveText } from '../../helpers/Globalizer';
import '../../styles/react-autosuggest.css';

export interface AutocompleteProps<T> {
    defaultValue?: string;
    displayNameSelector: (item: T) => string;
    search: (searchText: string) => Promise<T[]>;
    onItemSelected: (item: T) => void;
    onSearchTextChange?: (value: string) => void;
    onKeyUp?: (keyEvent: KeyboardEvent<HTMLElement>, currentSearchText: string) => void;
    resetOnSelect?: boolean;
    searchDelayInMilliseconds?: number;
    minSearchTextLength?: number;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    autoFocus?: boolean;
    autoSelectSingleItem?: boolean;
    highlightFirstSuggestion?: boolean;
    size?: "sm" | "lg";
}

export const Autocomplete = <T,>(props: AutocompleteProps<T>) => {

    const { 
        defaultValue,
        displayNameSelector,
        onSearchTextChange: onChange,
        onKeyUp,
        resetOnSelect,
        searchDelayInMilliseconds,
        minSearchTextLength,
        placeholder,
        disabled,
        required,
        className,
        autoFocus,
        autoSelectSingleItem,
        highlightFirstSuggestion,
        size
    } = props;
    const [ searchTimer, setSearchTimer ] = useState<NodeJS.Timeout>();
    const [ searchText, setSearchText ] = useState<string>(defaultValue ?? '');
    const [ suggestions, setSuggestions ] = useState<T[]>([]);

    useEffect(() => {
        if(defaultValue) {
            setSearchText(defaultValue);
        }
    }, [ defaultValue]);

    useEffect(() => {
        if(autoSelectSingleItem && suggestions.length === 1) {
            onItemSelected(suggestions[0])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ autoSelectSingleItem, suggestions ]);

    const onItemSelected = (item: any) => {
        if(props.onItemSelected) {
            props.onItemSelected(item);
        }
        if(resetOnSelect) {
            setSearchText('');
            setSuggestions([]);
        } else {
            const itemDisplayName = displayNameSelector ? displayNameSelector(item) : item;
            setSearchText(itemDisplayName);
        }
    }

    const runSearch = (searchText: string) => {
        const localSearchText = searchText.trim();
        const search = async () => {
            const searchResults = await props.search(localSearchText);
            setSuggestions(searchResults);
        };
        if(searchDelayInMilliseconds && searchDelayInMilliseconds <= 0) {
            search();
            return;
        }
        if(searchTimer) {
            clearTimeout(searchTimer);
        }
        const searchTimerHandle = setTimeout(search, searchDelayInMilliseconds ?? 500);
        setSearchTimer(searchTimerHandle);
    }

    const keyPressed = (keyEvent: KeyboardEvent<HTMLElement>) => {
        if(!onKeyUp) {
            return;
        }
        onKeyUp(keyEvent, searchText);
    }

    const formControlClasses = useMemo(() => {
        const classes: string[] = [ "form-control"];
        if(size) {
            classes.push(`form-control-${size}`);
        }
        if(className) {
            classes.push(className);
        }
        return classes.join(' ');
    }, [ className, size ]);

    return (
        <Autosuggest
            getSuggestionValue={displayNameSelector}
            suggestions={suggestions}
            inputProps={{
                value: searchText,
                onChange: (_e, { newValue }) => {
                    setSearchText(newValue);
                    if(onChange) {
                        onChange(newValue);
                    }
                },
                onKeyUp: keyPressed,
                placeholder: placeholder ?? (defaultGlobalizer.instance ? resolveText('Search') : 'Enter search text'),
                className: formControlClasses,
                disabled: disabled,
                required: required,
                pattern: required ? '/Please select a value/' : undefined,
                autoFocus: autoFocus,
            }}
            renderSuggestion={item => (
                <div>{displayNameSelector(item)}</div>
            )}
            highlightFirstSuggestion={highlightFirstSuggestion}
            onSuggestionsFetchRequested={({ value }) => runSearch(value)}
            onSuggestionsClearRequested={() => setSuggestions([])}
            shouldRenderSuggestions={(value) => value ? value.trim().length >= (minSearchTextLength ?? 3) : false}
            onSuggestionSelected={(_e, { suggestion }) => onItemSelected(suggestion)}
        />
    );

}