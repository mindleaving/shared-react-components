import '../styles/feedback.css';

import { useState } from 'react';
import { FeedbackModal } from '../modals/FeedbackModal';
import { resolveText } from '../helpers/Globalizer';

interface FeedbackIconProps {}

export const FeedbackIcon = (props: FeedbackIconProps) => {

    const [ showFeedbackModal, setShowFeedbackModal ] = useState<boolean>(false);

    return (
    <div className="feedback no-print" title={resolveText("Feedback")}>
        <i 
            className='fa fa-comment-o' 
            onClick={() => setShowFeedbackModal(true)}
        />
        <FeedbackModal
            show={showFeedbackModal}
            onClose={() => setShowFeedbackModal(false)}
        />
    </div>);

}