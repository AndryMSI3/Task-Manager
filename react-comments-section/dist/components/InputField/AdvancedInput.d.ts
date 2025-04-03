import React from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./AdvancedInput.css";
interface AdvancedInputProps {
    formStyle?: object;
    handleSubmit: (text: string) => void;
    mode?: string;
    cancelBtnStyle?: object;
    submitBtnStyle?: object;
    comId?: string;
    imgStyle?: object;
    imgDiv?: object;
    customImg?: string;
    text: string;
    placeHolder?: string;
}
declare const AdvancedInput: ({ handleSubmit, imgDiv, imgStyle, customImg, text, placeHolder, }: AdvancedInputProps) => React.JSX.Element;
export default AdvancedInput;
