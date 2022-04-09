import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { resolveText } from '../helpers/Globalizer';

interface CopyButtonProps {
    value: string;
}

export const CopyButton = (props: CopyButtonProps) => {

    const [ isCopied, setIsCopied ] = useState<boolean>(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(props.value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 5000);
    }

    return (
        <Button
            variant={isCopied ? 'success' : 'primary'}
            onClick={copyToClipboard}
        >
            {isCopied ? resolveText("Copied!") : resolveText("Copy")}
        </Button>
    );

}