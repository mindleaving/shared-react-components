import { useMemo } from "react";

interface VerbatimTextProps {
    text: string;
    allowEmptyLines?: boolean;
}

export const VerbatimText = (props: VerbatimTextProps) => {

    const { text, allowEmptyLines } = props;

    const lines = useMemo(() => text.split('\n').map(str => str.trim()), [ text ]);
    const paragraphs = allowEmptyLines ? lines : lines.filter(x => x.length > 0);
    return (
    <>
        {paragraphs.map((paragraph,idx) => {
            if(paragraph.length === 0) {
                return (<br key={idx} />);
            }
            return (<p key={idx} className='m-0'>
                {paragraph}
            </p>);
        })}
    </>
    );

}