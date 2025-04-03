import React from 'react';
import './InputField.scss';
interface RegularInputProps {
    formStyle?: object;
    comId?: string;
    mode?: string;
    customImg?: string;
    inputStyle?: object;
    cancelBtnStyle?: object;
    submitBtnStyle?: object;
    imgStyle?: object;
    imgDiv?: object;
    handleSubmit: Function;
    text: string;
    setText: Function;
    placeHolder?: string;
}
declare const RegularInput: ({ formStyle, imgDiv, imgStyle, customImg, mode, inputStyle, cancelBtnStyle, comId, submitBtnStyle, handleSubmit, text, setText, placeHolder }: RegularInputProps) => React.JSX.Element;
export default RegularInput;
