import { Button } from "react-bootstrap";
import { resolveText } from "../helpers/Globalizer";

interface ResetButtonProps {
    type?: "button" | "reset";
    onClick: () => void;
    size?: "sm" | "lg";
    className?: string;
}

export const ResetButton = (props: ResetButtonProps) => {

    const { type, onClick, size, className } = props;

    return (<Button
        type={type}
        variant="secondary"
        onClick={onClick}
        size={size}
        className={className}
    >
        {resolveText("Reset")}
    </Button>);

}