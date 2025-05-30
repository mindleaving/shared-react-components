import '../styles/star-button.css';

import { useMemo } from "react";

interface StarToggleButtonProps {
    isActive: boolean;
    onClick?: () => void;
}

export const StarToggleButton = (props: StarToggleButtonProps) => {

    const { isActive, onClick } = props;

    const icon = useMemo(() => isActive ? 'fa-star' : 'fa-star-o', [ isActive ]);

    return (<div
        onClick={onClick}
        className={`star-button ${isActive ? 'text-warning' : 'text-secondary'}`}
    >
        <i className={`fa ${icon}`} />
    </div>);

}