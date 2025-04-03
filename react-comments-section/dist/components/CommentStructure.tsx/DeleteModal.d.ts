import 'react-responsive-modal/styles.css';
import React from 'react';
interface DeleteModalProps {
    comId: string;
    parentId?: string;
}
declare const DeleteModal: ({ comId, parentId }: DeleteModalProps) => React.JSX.Element;
export default DeleteModal;
