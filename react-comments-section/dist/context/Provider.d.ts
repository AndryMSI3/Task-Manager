import React from 'react';
export declare const GlobalContext: React.Context<{}>;
export declare const GlobalProvider: ({ children, currentUser, replyTop, customImg, inputStyle, formStyle, submitBtnStyle, cancelBtnStyle, imgStyle, commentsCount, commentData, onSubmitAction, onDeleteAction, onReplyAction, onEditAction, currentData, replyInputStyle, removeEmoji, advancedInput, placeHolder }: {
    children: any;
    currentUser?: {
        currentUserId: string;
        currentUserImg: string;
        currentUserProfile?: string | undefined;
        currentUserFullName: string;
    } | null | undefined;
    replyTop?: boolean | undefined;
    customImg?: string | undefined;
    inputStyle?: object | undefined;
    formStyle?: object | undefined;
    submitBtnStyle?: object | undefined;
    cancelBtnStyle?: object | undefined;
    imgStyle?: object | undefined;
    replyInputStyle?: object | undefined;
    commentsCount?: number | undefined;
    removeEmoji?: boolean | undefined;
    commentData?: {
        userId: string;
        comId: string;
        fullName: string;
        avatarUrl: string;
        text: string;
        timestamp?: string | undefined;
        userProfile?: string | undefined;
        replies?: Array<{
            userId: string;
            comId: string;
            fullName: string;
            avatarUrl: string;
            text: string;
            timestamp?: string;
            userProfile?: string;
        }> | undefined;
    }[] | undefined;
    onSubmitAction?: Function | undefined;
    onDeleteAction?: Function | undefined;
    onReplyAction?: Function | undefined;
    onEditAction?: Function | undefined;
    currentData?: Function | undefined;
    advancedInput?: boolean | undefined;
    placeHolder?: string | undefined;
}) => React.JSX.Element;
export default GlobalProvider;
