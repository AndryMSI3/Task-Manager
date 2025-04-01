"use client";

import { useEffect, useState, useRef, useMemo ,memo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui-elements/button";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import FontSize from '@tiptap/extension-font-size';
import FontFamily from '@tiptap/extension-font-family'; 
import TextStyle from "@tiptap/extension-text-style"; // ✅ Ajout
import Image from "@tiptap/extension-image";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import Comments from "./Comments";
import htmlToDraft from 'html-to-draftjs';
import { toast } from 'react-toastify';

interface Comment {
  userId: string;
  comId: string;
  fullName: string;
  avatarUrl: string;
  text: string;
  userProfile?: string;
  timestamp?: string;
  replies?: {
    userId: string;
    comId: string;
    fullName: string;
    avatarUrl: string;
    text: string;
    userProfile?: string;
  }[];
}

const CardPage = ({ cardData }:{ cardData: number[] }) => {
  const userId = localStorage.getItem("userConnectedId");
  const [htmlContent, setHtmlContent] = useState('');

  const [isEditMode, setIsEditMode] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null); // Référence pour le picker
  const [isPickerVisible, setIsPickerVisible] = useState(false); // Gère l'affichage du ChromePicker
  const [contents, setContents] = useState<string | null>(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());


  const editor = useEditor({
    extensions: [
      Underline, 
      StarterKit,
      FontFamily,
      FontSize,
      TextStyle, 
      Color,
      Image,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: contents,
    editable: false,
    editorProps: { 
      handleDOMEvents: { beforeinput: () => true } 
    },
    immediatelyRender: false,
  });
  
  useEffect(() => {
    if (cardData[0]) {
      editor?.commands.setContent(contents);
      fetchContentData();
    }
  }, [contents,cardData[0]]); 

  // Fermer le picker en cliquant en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerVisible(false);
      }
    }

    if (isPickerVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPickerVisible]);

  const handleSaveContent = async () => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContent).trim();
    try {
      const response = await fetch(`http://localhost:8080/contents/${cardData[0]}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlContent,
        }),
      });
  
      if (response.ok) {
        toast.success("Contenu enregistré avec succès !");
      } else {
        toast.error(`Erreur lors de l'enregistrement : ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    } 
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {

      if (!userId) return; // Vérifie que userId existe avant d'appeler setState

      if (userId && cardData[0]) {
          fetchContentData();
      }
    }
  }, [cardData[0]]);

  const fetchContentData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/contents/card/${cardData[0]}`);
      if (!response.ok) throw new Error("Erreur lors du chargement du contenu");
      const data = await response.json();
      
      // 1. Convertir le HTML en blocs de contenu utilisables
      const contentBlock = htmlToDraft(JSON.parse(data.content));
      // 2. Créer un ContentState avec ces blocs
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);

      setEditorState(EditorState.createWithContent(contentState));
    } catch (error) {
      console.error("Erreur de conversion HTML → EditorState :", error);
    }
  };

  return (
    <>
      <div style={{ position: "relative" }}>
          {cardData[1] == parseInt(userId as string) && <Button 
            className="boutonEnregistrer"
            onClick={() => {
              const newMode = !editor?.isEditable;
              editor?.setEditable(newMode);
              setIsEditMode(newMode); // Met à jour l'état local si nécessaire
            }}
            size="small"
            label={editor?.isEditable ? 'Mode Affichage' : 'Mode Édition'}
            variant="outlineDark" 
            shape="rounded"  
          />}
          <div>
            <Editor 
            editorState={editorState}
            wrapperStyle={isEditMode ? {border:"1px solid #cfcdcd"}:{border:"none"}} 
            toolbarHidden={!isEditMode} 
            onEditorStateChange={setEditorState}
            />
          </div>
          <style jsx>{`
            .editor-container {
              border: 1px solid #ddd;
              padding: 10px;
              border-radius: 5px;
            }
            .toolbar {
              display: flex;
              gap: 5px;
              margin-bottom: 10px;
            }
            .toolbar button {
              padding: 5px 10px;
              border: none;
              cursor: pointer;
              background: #f0f0f0;
            }
            .toolbar .active {
              background: #ddd;
            }
            .editor {
              min-height: 200px;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
          `}</style>

          {cardData[1] == parseInt(userId as string) && <Button 
            className="boutonEnregistrer"
            onClick={handleSaveContent}
            size="small"
            label="Enregistrer" 
            variant="outlinePrimary" 
            shape="rounded" 
           />}
          <Comments 
            userId={userId as string} 
            cardId={cardData[0]}   
          /> 
      </div>
    </>
  );
};
export default memo(CardPage);
