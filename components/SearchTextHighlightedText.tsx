import { useMemo } from "react";

interface SearchTextHighlightedTextProps {
    text: string;
    searchText: string;
    caseSensitive?: boolean;
    highlightedClassName?: string;
}
interface TextFragment {
    text: string;
    isHighlighted: boolean;
}

export const SearchTextHighlightedText = (props: SearchTextHighlightedTextProps) => {

    const { text, searchText, caseSensitive, highlightedClassName } = props;

    const searchTerms = useMemo(() => {
        return searchText.split(' ')
            .map(term => term.trim())
            .filter(term => term.length > 0)
            .map(term => caseSensitive ? term : term.toLowerCase());
    }, [ searchText, caseSensitive ]);
    const fragments = useMemo(() => {
        const fragments: TextFragment[] = [];
        const normalizedText = caseSensitive ? text : text.toLowerCase();
        let remainingTextOffset = 0;
        while(remainingTextOffset < normalizedText.length) {
            const remainingText = normalizedText.substring(remainingTextOffset);
            const matchedSearchTerms = searchTerms.map(term => {
                const matchPosition = remainingText.indexOf(term);
                return { term, matchPosition };
            }).filter(x => x.matchPosition >= 0);
            if(matchedSearchTerms.length === 0) {
                fragments.push({
                    text: text.substring(remainingTextOffset),
                    isHighlighted: false
                });
                break;
            }
            const firstMatchedPosition = Math.min(...matchedSearchTerms.map(x => x.matchPosition));
            const lengthSortedFirstMatchedTerms = matchedSearchTerms
                .filter(x => x.matchPosition === firstMatchedPosition)
                .sort((a,b) => b.term.length - a.term.length);
            const longestFirstMatch = lengthSortedFirstMatchedTerms[0];
            if(longestFirstMatch.matchPosition > 0) {
                fragments.push({
                    text: text.substring(remainingTextOffset, remainingTextOffset + longestFirstMatch.matchPosition),
                    isHighlighted: false
                });
            }
            const matchStartPosition = remainingTextOffset + longestFirstMatch.matchPosition;
            fragments.push({
                text: text.substring(matchStartPosition, matchStartPosition + longestFirstMatch.term.length),
                isHighlighted: true
            });
            remainingTextOffset += longestFirstMatch.matchPosition + longestFirstMatch.term.length;
        }
        return fragments;
    }, [ text, searchTerms ]);

    return (<div className="d-inline">
        {fragments.map((fragment,fragmentIndex) => {
            if(fragment.isHighlighted) {
                if(highlightedClassName !== undefined) {
                    return (<span key={fragment.text+fragmentIndex} className={highlightedClassName}>{fragment.text}</span>);
                }
                return (<span key={fragment.text+fragmentIndex}><strong>{fragment.text}</strong></span>);
            } else {
                return (<span key={fragment.text+fragmentIndex}>{fragment.text}</span>);
            }
        })}
    </div>);

}