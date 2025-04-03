import './CommentSection.css';
import React from 'react';
interface CommentSectionProps {
    overlayStyle?: object;
    hrStyle?: object;
    titleStyle?: object;
    customNoComment?: Function;
    showTimestamp?: boolean;
}
declare const CommentSection: ({ overlayStyle, hrStyle, titleStyle, customNoComment, showTimestamp, }: CommentSectionProps) => React.JSX.Element;
export default CommentSection;
