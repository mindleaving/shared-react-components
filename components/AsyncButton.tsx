import React from "react"
import { Button } from "react-bootstrap";

interface AsyncButtonProps {
    type?: "button" | "submit" | "reset" | undefined;
    form?: string;
    onClick?: () => void;
    variant?: string;
    size?: "sm" | "lg";
    isExecuting?: boolean;
    activeText: string;
    executingText: string;
    className?: string;
    disabled?: boolean;
}

export const AsyncButton = (props: AsyncButtonProps) => {
    return (
        <Button
            type={props.type}
            form={props.form}
            className={props.className}
            variant={props.variant}
            size={props.size}
            onClick={props.onClick}
            disabled={props.isExecuting || props.disabled}
        >
            {!props.isExecuting
                ? <>{props.activeText}</>
                : <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> {props.executingText}</>
            }
        </Button>
    )
}