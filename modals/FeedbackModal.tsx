import { Button, Form, FormControl, Modal } from "react-bootstrap";
import { resolveText } from "../helpers/Globalizer";
import { StoreButton } from "../components/StoreButton";
import { FormEvent, useState } from "react";
import { Models } from "../../localComponents/types/models";
import { uuid } from "../helpers/uuid";
import { sendPostRequest } from "../helpers/StoringHelpers";
import { showSuccessAlert } from "../helpers/AlertHelpers";

interface FeedbackModalProps {
    show: boolean;
    onClose: () => void;
}

export const FeedbackModal = (props: FeedbackModalProps) => {

    const { show, onClose } = props;

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>('');

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        if(/^\s+$/.test(message)) {
            return;
        }
        const feedback: Models.Feedback = {
            id: uuid(),
            timestamp: new Date().toISOString() as any, // Will be replaced by API
            submitterAccountId: '', // Will be filled in by API
            url: window.location.pathname,
            message: message
        };
        setIsSubmitting(true);
        await sendPostRequest(
            'api/feedback', {},
            resolveText("Feedback_CouldNotSubmit"),
            feedback,
            async () => {
                showSuccessAlert(resolveText("Feedback_SuccessfullySubmitted"));
                onClose();
                setMessage('');
            },
            undefined,
            () => setIsSubmitting(false)
        );
    }

    return (
    <Modal
        show={show}
        onHide={onClose}
        size="lg"
        backdrop="static"
    >
        <Modal.Header closeButton>
            <Modal.Title>{resolveText("Feedback")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form id="feedback-form" onSubmit={store}>
                <FormControl
                    as="textarea"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    style={{ height: '120px' }}
                    onKeyDown={e => {
                        if(e.shiftKey && e.key === "Enter") {
                            e.preventDefault();
                            store();
                        }
                    }}
                />
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button
                variant="secondary"
                onClick={onClose}
            >
                {resolveText("Cancel")}
            </Button>
            <StoreButton
                form="feedback-form"
                type="submit"
                isStoring={isSubmitting}
                disabled={!message.trim()}
            />
        </Modal.Footer>
    </Modal>
    );

}