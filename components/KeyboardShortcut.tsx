import { ReactNode, useMemo } from "react";

interface KeyboardShortcutProps {
    shortcut: string;
}

const getKeyOrIcon = (key: string): ReactNode => {
    switch(key) {
        case "ArrowLeft":
            return (<i className="fa fa-long-arrow-left" />);
        case "ArrowRight":
            return (<i className="fa fa-long-arrow-right" />);
        case "ArrowUp":
            return (<i className="fa fa-long-arrow-up" />);
        case "ArrowDown":
            return (<i className="fa fa-long-arrow-down" />);
        case "Enter":
            return (<i className="bi bi-arrow-return-left" />);
        case "Shift":
            return (<i className="bi bi-shift" />);
        default:
            return key;
    }
}
export const KeyboardShortcut = (props: KeyboardShortcutProps) => {

    const { shortcut } = props;

    const keys = useMemo(() => {
        const splitted = shortcut.split('+');
        return splitted;
    }, [ shortcut ]);

    return (<div className="d-inline-block my-1">
        {keys.map((key,keyIndex) => (<>
            {keyIndex > 0 ? <span>&nbsp;+&nbsp;</span> : null}
            <div className="d-inline p-2 border border-solid rounded bg-light">
                {getKeyOrIcon(key)}
            </div>
        </>))}
    </div>);

}