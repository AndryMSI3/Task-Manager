import * as React from 'react';
import './Index.scss';
interface CommentSectionProps {
    currentUser: {
        currentUserId: string;
        currentUserImg: string;
        currentUserProfile: string;
        currentUserFullName: string;
    } | null;
    replyTop?: boolean;
    customImg?: string;
    inputStyle?: object;
    formStyle?: object;
    submitBtnStyle?: object;
    cancelBtnStyle?: object;
    overlayStyle?: object;
    imgStyle?: object;
    replyInputStyle?: object;
    commentsCount?: number;
    hrStyle?: object;
    titleStyle?: object;
    onSubmitAction?: Function;
    onDeleteAction?: Function;
    onReplyAction?: Function;
    onEditAction?: Function;
    customNoComment?: Function;
    currentData?: Function;
    removeEmoji?: boolean;
    advancedInput?: boolean;
    placeHolder?: string;
    showTimestamp?: boolean;
    commentData: Array<{
        userId: string;
        comId: string;
        fullName: string;
        avatarUrl: string;
        text: string;
        userProfile?: string;
        timestamp?: string;
        replies?: Array<{
            userId: string;
            comId: string;
            fullName: string;
            avatarUrl: string;
            text: string;
            timestamp?: string;
            userProfile?: string;
        }>;
    }>;
}
export declare const CommentSection: ({ currentUser, customImg, inputStyle, formStyle, submitBtnStyle, cancelBtnStyle, overlayStyle, replyInputStyle, imgStyle, replyTop, commentsCount, commentData, placeHolder, showTimestamp, hrStyle, titleStyle, removeEmoji, onSubmitAction, onDeleteAction, onReplyAction, onEditAction, customNoComment, currentData, advancedInput }: CommentSectionProps) => React.JSX.Element;
export {};
