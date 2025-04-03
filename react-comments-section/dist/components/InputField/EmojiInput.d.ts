import React from 'react';
import './InputField.scss';
interface EmojiInputProps {
    text: string;
    setText: Function;
    mode?: string;
    inputStyle?: object;
    placeHolder?: string;
}
declare const EmojiInput: ({ text, setText, mode, inputStyle, placeHolder }: EmojiInputProps) => React.JSX.Element;
export default EmojiInput;
