import { confirmAlert } from 'react-confirm-alert';
import { resolveText } from '../helpers/Globalizer';
import { AsyncButton } from './AsyncButton';

interface DeleteButtonProps {
    isDeleting?: boolean;
    onClick: (isConfirmed?: boolean) => void;
    requireConfirm?: boolean;
    confirmDialogTitle?: string;
    confirmDialogMessage?: string;
    className?: string;
    size?: "xs";
}

export const DeleteButton = (props: DeleteButtonProps) => {

    if(props.requireConfirm && !(props.confirmDialogTitle && props.confirmDialogMessage)) {
        throw new Error("If delete confirmation is required, title and message for the confirmation dialog must be specified");
    }

    const onClick = () => {
        if(props.requireConfirm) {
            confirmDelete();
            return;
        }
        props.onClick(false);
    }

    const confirmDelete = () => {
        confirmAlert({
            title: props.confirmDialogTitle,
            message: props.confirmDialogMessage,
            closeOnClickOutside: true,
            buttons: [
                {
                    label: resolveText('Delete_No'),
                    onClick: () => {}
                },
                {
                    label: resolveText('Delete_Yes'),
                    onClick: () => props.onClick(true)
                }
            ]
        });
    }

    if(props.size === "xs") {
        return (<i
            className='fa fa-trash red clickable'
            onClick={onClick}
        />);
    }

    return (
        <AsyncButton
            variant="danger"
            className={props.className ?? 'm-2'}
            activeText={resolveText('Delete')}
            executingText={resolveText('Deleting...')}
            isExecuting={props.isDeleting}
            onClick={onClick}
        />
    );

}