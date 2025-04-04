"use client";

import { useEffect, useState, useRef, useMemo ,memo } from "react";
import { Button } from "@/components/ui-elements/button";
import dynamic from 'next/dynamic'; // (if using Next.js or use own dynamic loader)
import { ContentBlock, Modifier, EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import Comments from "./Comments";
import { toast } from 'react-toastify';

// Charger le composant de manière dynamique sans SSR
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }  // Désactive le SSR pour ce composant
);

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

  const [isEditMode, setIsEditMode] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null); // Référence pour le picker
  const [isPickerVisible, setIsPickerVisible] = useState(false); // Gère l'affichage du ChromePicker
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const cleanText = (text: string) => text.replace(/\r/g, ""); // Supprime les retours chariots (\r)

  const handlePastedText = (
    text: string,
    html: string,
    editorState: EditorState,
    onChange: (editorState: EditorState) => void
  ) => {
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

  useEffect(() => {
    if (cardData[0]) {
      fetchContentData();
    }
  }, [cardData[0]]); 

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
    console.log("htmlContent ",htmlContent);
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
      let data = await response.json();
      
      import("html-to-draftjs").then(({ default: htmlToDraft }) => {
        let blocksFromHtml;
        if (data.content) {
          blocksFromHtml = htmlToDraft(JSON.parse(data.content));
        }
        else {
          blocksFromHtml = htmlToDraft("<p></p>");
        }
        const contentState = ContentState.createFromBlockArray(
          blocksFromHtml.contentBlocks,
          blocksFromHtml.entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));   
      });
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
              setIsEditMode(!isEditMode); // Met à jour l'état local si nécessaire */
            }}
            size="small"
            label={isEditMode ? 'Mode Affichage' : 'Mode Édition'}
            variant="outlineDark" 
            shape="rounded"  
          />}
          <div>
          <Editor 
            readOnly={!isEditMode}
            editorState={editorState}
            wrapperStyle={isEditMode ? {border:"1px solid #cfcdcd"}:{border:"none"}} 
            toolbarHidden={!isEditMode} 
            onEditorStateChange={setEditorState}
            handlePastedText={(text, html, editorState, onChange) => handlePastedText(text, html, editorState, onChange)}
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

          {cardData[1] == parseInt(userId as string) && isEditMode && <Button 
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
