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
import { faBold, faItalic, faUnderline,faAlignLeft, faAlignCenter, faAlignRight, faTextHeight, faFont  } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChromePicker, ColorResult } from "react-color";
import Image from "@tiptap/extension-image";
// import dynamic from "next/dynamic";
import Comments from "./Comments";
// const Comments = dynamic(import("./Comments"),{ssr:false})

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
  const [color, setColor] = useState("#000000");
  const [isPickerVisible, setIsPickerVisible] = useState(false); // Gère l'affichage du ChromePicker
  const [contents, setContents] = useState<string | null>(null);
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
    if (typeof window !== 'undefined') {
      const button = document.querySelector(".postBtn"); // Vérifie la classe correcte
      if (button) {
        button.textContent = "Envoyer"; // Remplace complètement le texte
      }
    } 
  },[]);

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
    if (!editor) return;
    const content = editor.getHTML(); // Récupère le contenu de l'éditeur
    try {
      const response = await fetch(`http://localhost:8080/contents/${cardData[0]}}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });
  
      if (response.ok) {
        ("Contenu enregistré avec succès !");
      } else {
        console.error("Erreur lors de l'enregistrement :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    } 
  };

  // Fonction qui change la couleur du texte sélectionné
  const handleColorChange = (color: ColorResult) => {
    setColor(color.hex); // Mise à jour de l'état avec la couleur sélectionnée
    if (editor) {
      editor.chain().focus().setMark("textStyle", { color: color.hex }).run();
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

  const fetchContentData = async() => {
    fetch(`http://localhost:8080/contents/card/${cardData[0]}`)
    .then(res => res.json())
    .then(data => {
      setContents(data.content);
      if (!data.content) return <p>Chargement...</p>;
      if(typeof data.content === "string")
      {
        setContents(JSON.parse(data.content));
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    editor?.chain().focus().setFontFamily(e.target.value).run();
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
          { isEditMode &&          
            <div className="toolbar">
              <button onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive("bold") ? "active" : ""}> 
                <FontAwesomeIcon icon={faBold} />
              </button>
              <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive("italic") ? "active" : ""}>
                <FontAwesomeIcon icon={faItalic} />  
              </button>
              <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={editor?.isActive("underline") ? "active" : ""}>
                <FontAwesomeIcon icon={faUnderline} />          
              </button>
              <button onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
                <FontAwesomeIcon icon={faAlignLeft} />
              </button>
              <button onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
                <FontAwesomeIcon icon={faAlignCenter} />
              </button>
              <button onClick={() => editor?.chain().focus().setTextAlign("right").run()}>
                <FontAwesomeIcon icon={faAlignRight} />
              </button>
              <select onChange={(e) => editor?.chain().focus().setFontSize(e.target.value).run()}>
                <option value="10px">10px</option>
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="28px">28px</option>
              </select>
              <select onChange={handleFontChange} className="font-select">
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Tahoma">Tahoma</option>
              </select>
              <div>
                <button
                  onClick={() => setIsPickerVisible(!isPickerVisible)}
                  className="color-button"
                >
                  🎨 Sélectionner une couleur
                </button>
                {isPickerVisible && (
                  <div
                    ref={pickerRef}
                    style={{
                      position: "absolute",
                      marginTop: "5px",
                      zIndex: 10,
                      background: "white",
                      boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                    }}
                  >              
                    <ChromePicker color={color} onChange={handleColorChange} />
                  </div>
                )}
              </div>
              <button onClick={() => editor?.chain().focus().toggleHighlight().run()} className={editor?.isActive("highlight") ? "active" : ""}>
                🖍
              </button>
            </div>
          }

          <EditorContent editor={editor}   
            style={{
              border: 'none',
              outline: 'none',
              boxShadow: 'none'
          }} />
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
