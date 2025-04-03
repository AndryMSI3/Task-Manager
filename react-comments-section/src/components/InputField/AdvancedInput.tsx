import React, { useState, useEffect, useMemo, useContext } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { GlobalContext } from '../../context/Provider';
import { Modifier, EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import  "./AdvancedInput.css";

interface AdvancedInputProps {
  formStyle?: object;
  handleSubmit: (text: string) => void; // Correction ici
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

const cleanText = (text: string) => text.replace(/\r/g, ""); // Supprime les retours chariots (\r)

const handlePastedText = (
  text: string,
  html: string,
  editorState: EditorState,
  onChange: (editorState: EditorState) => void
) => {
  console.log(html);
  const selection = editorState.getSelection();

  // S'assurer que la sélection est bien "collapsed"
  const collapsedSelection = selection.merge({
    anchorOffset: selection.getEndOffset(),
    focusOffset: selection.getEndOffset(),
    isBackward: false
  });

  const newContentState = Modifier.insertText(
    editorState.getCurrentContent(),
    collapsedSelection, // Utilisation de la sélection collapsed
    cleanText(text),
    editorState.getCurrentInlineStyle()
  );

  const newEditorState = EditorState.push(editorState, newContentState, "insert-characters");
  onChange(newEditorState); // Met à jour l'état de l'éditeur

  return true; // Indique que le texte a été géré
};

// Composant pour gérer la soumission
const SubmitButton = ({
  setEditorState,
  editorState,
  handleSubmit,
}: {
  setEditorState: (state: EditorState) => void;
  editorState: EditorState;
  handleSubmit: (text: string) => void;
}) => {
  const submitText = () => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContent).trim();
    if (htmlContent !== '<p></p>') {
      handleSubmit(htmlContent);
      setEditorState(EditorState.createEmpty());
    }
  };

  return (
    <button
      type="button"
      onClick={submitText}
      disabled={false}
      id='button'
      style={{
        paddingBottom: "6px",
        paddingTop: "6px",
        marginTop: "5px",
        marginBottom: "10px",
        marginRight: "15px",
        marginLeft: "auto"
      }}
    >
      Envoyer
    </button>
  );
};

const AdvancedInput = ({
  // formStyle,
  handleSubmit,
  imgDiv,
  imgStyle,
  customImg,
  text,
  placeHolder,
}: AdvancedInputProps) => {
  const globalStore: any = useContext(GlobalContext);

  const [html, setHtml] = useState('<p></p>');

  useEffect(() => {
    if (text !== '') setHtml(text);
  }, [text]);

  const contentState = useMemo(() => {
    if (html) {
      const contentBlock = htmlToDraft(html);
      return ContentState.createFromBlockArray(contentBlock.contentBlocks);
    }
    return ContentState.createFromText(''); // Si le texte est vide, crée un état par défaut
  }, [html]);

  const [editorState, setEditorState] = useState(() => EditorState.createWithContent(contentState));


  return (
    <div className="advanced-overlay">
      <div className="userImg" style={imgDiv}>
        <a target="_blank" href={globalStore.currentUserData.currentUserProfile}>
          <img
            src={globalStore.customImg || customImg || globalStore.currentUserData.currentUserImg}
            style={globalStore.imgStyle || imgStyle}
            alt="userIcon"
            className="imgdefault"
          />
        </a>
      </div>

      <div className="advanced-input">
        <div className="form advanced-form"  /* style={ globalStore.formStyle || formStyle } */>
          <div className="advanced-border">
			{/* @ts-ignore*/}
            <Editor
              editorState={editorState}
              placeholder={placeHolder || 'Tapez votre réponse.'}
              onEditorStateChange={setEditorState}
              handlePastedText={(text, editorState, html, onChange) => handlePastedText(text, editorState, html, onChange)}
              toolbarCustomButtons={[
                <SubmitButton key="submit-button" editorState={editorState} setEditorState={setEditorState} handleSubmit={handleSubmit} />
              ]}
              toolbar={{
                options: ['inline', 'list', 'fontSize', 'fontFamily','colorPicker', 'emoji'],

                inline: { options: ['bold', 'italic', 'underline', 'strikethrough'] },
                list: { inDropdown: false, options: ['unordered', 'ordered'] },
                fontSize: { inDropdown:true,
                  options: [10, 11, 12, 14, 16, 18, 24, 30, 36, 48 ]
                },
                fontFamily: { inDropdown: true,
                  options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedInput;
