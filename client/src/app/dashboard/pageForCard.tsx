"use client";

import { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CommentSection } from "react-comments-section";
import { Button } from "@/components/ui-elements/button";
import "react-comments-section/dist/index.css";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import FontSize from '@tiptap/extension-font-size';
import FontFamily from '@tiptap/extension-font-family'; 
import TextStyle from "@tiptap/extension-text-style"; // ✅ Ajout
import { faBold, faItalic, faUnderline,faAlignLeft, faAlignCenter, faAlignRight, faTextHeight, faFont  } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChromePicker } from "react-color";
import Image from "@tiptap/extension-image";
import '../components/css/CardPage.css';

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

interface reply {
  user_id: number;
  reply_id: number;
  text: any;
  repliedToCommentId: number;
}

const CardPage = ({ cardId }:{ cardId: number }) => {
  const userId = localStorage.getItem("userConnectedId");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<any>({});
  const pickerRef = useRef<HTMLDivElement | null>(null); // Référence pour le picker
  const [color, setColor] = useState("#000000");
  const [isPickerVisible, setIsPickerVisible] = useState(false); // Gère l'affichage du ChromePicker
  const [comments, setComments] = useState<Comment[]>([]);
  const [contents, setContents] = useState<string | null>(null);

  const handleSubmitComment = (comment: any) => {
    fetch('http://localhost:8080/comments/create', {
      method: 'POST',
      body: JSON.stringify({
        comment: comment,
        cardId: comment?.repliedToCommentId? null : cardId
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }); 
  };

  const editor = useEditor({
    extensions: [
      Bold,
      Italic,
      Underline, 
      StarterKit,
      FontFamily,
      FontSize,
      TextStyle, // Ajout obligatoire pour la couleur
      Color,
      Image,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }), // Permet d'aligner titres et paragraphes
    ],
    content: contents,
    editable: false,
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
    if (cardId) {
      editor?.commands.setContent(contents);
      fetchContentData();
    }
  }, [contents]); 

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
      const response = await fetch(`http://localhost:8080/contents/${cardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });
  
      if (response.ok) {
        console.log("Contenu enregistré avec succès !");
      } else {
        console.error("Erreur lors de l'enregistrement :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    } 
  };


  useEffect(() => {
    const fetchCommentsAndUserData = async () => {
      if (!userId || !cardId) return;
  
      try {
        const response = await fetch(`http://localhost:8080/comments/card/${cardId}`);
        const commentsData = await response.json();
  
        if (!commentsData) return setComments([]);
  
        const commentPromises = commentsData.map(async (comment: any) => {
          try {
            const userResponse = await fetch(`http://localhost:8080/users/${comment.user_id}`);
            const userData = await userResponse.json();
  
            const repliesResponse = await fetch(`http://localhost:8080/comments/card/replies/${comment.comment_id}`);
            const repliesData = await repliesResponse.json();
  
            // Récupération des utilisateurs ayant fait des replies
            const replyPromises = repliesData.map(async (reply: any) => {
              try {
                const replyUserResponse = await fetch(`http://localhost:8080/users/${reply.user_id}`);
                const replyUserData = await replyUserResponse.json();
  
                return {
                  userId: String(reply.user_id),
                  repliedToCommentId: reply.replied_to_comment_id,
                  avatarUrl: `http://localhost:3000/images/${replyUserData.user_picture || "default.png"}`,
                  userProfile: `http://localhost:3000/profile`,
                  text: reply.text,
                  comId: reply.comment_id,
                  fullName: replyUserData.user_name, // Ajout du nom de l'utilisateur
                };
              } catch (error) {
                console.error("Error fetching reply user:", error);
                return null;
              }
            });
  
            const formattedReplies = (await Promise.all(replyPromises)).filter(Boolean);
  
            return {
              userId: String(comment.user_id),
              comId: comment.comment_id,
              fullName: userData.user_name,
              text: comment.text,
              avatarUrl: `http://localhost:3000/images/${userData.user_picture || "default.png"}`,
              replies: formattedReplies,
            };
          } catch (error) {
            console.error("Error fetching user or replies:", error);
            return null;
          }
        });
  
        const comments = (await Promise.all(commentPromises)).filter(Boolean);
        setComments(comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
  
    fetchCommentsAndUserData();
  }, [cardId]);
    
  // Fonction qui change la couleur du texte sélectionné
  const handleColorChange = (color: any) => {
    setColor(color.hex); // Mise à jour de l'état avec la couleur sélectionnée
    if (editor) {
      editor.chain().focus().setMark("textStyle", { color: color.hex }).run();
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {

      if (!userId) return; // Vérifie que userId existe avant d'appeler setState
      // setUserConnectedId(userId);

      if (userId) {
        const fetchUserData = async () => {
          try {
            const response = await fetch(`http://localhost:8080/users/${userId}`);
            const data = await response.json();
            setCurrentUserData(data);
          } catch (error) {
            console.log("Error fetching user data: ", error);
          }
        };
        fetchUserData();
        if(cardId) fetchContentData();
      }
    }
  }, [cardId]);

  const fetchContentData = async() => {
    console.log("cardId ",cardId);
    fetch(`http://localhost:8080/contents/card/${cardId}`)
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
          <Button 
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
          />
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
                {/* Fenêtre Modal avec le color picker */}
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
          {/* Affichage du ChromePicker quand isPickerVisible est true */}

          {/* Éditeur */}
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

          <Button 
            className="boutonEnregistrer"
            onClick={handleSaveContent}
            size="small"
            label="Enregistrer" 
            variant="outlinePrimary" 
            shape="rounded" 
          />
          {currentUserData && (
            <CommentSection  
              removeEmoji={true}     
              currentUser={{
                currentUserId: userId as string,
                currentUserImg: currentUserData?.user_picture? 
                `http://localhost:3000/images/${currentUserData.user_picture}`
                  : 'http://localhost:3000/images/default.png',
                currentUserProfile: 'http://localhost:3000/profile',
                currentUserFullName: currentUserData.user_name,
              }}
              logIn={{
                onLogin: () => alert('call login function'),
                signUpLink: 'http://localhost:3001/',
              }}
              commentData={comments}
              onReplyAction={(data: string) => handleSubmitComment(data)}
              onSubmitAction={(data: string) => handleSubmitComment(data)}
            />
          )}
        </div>
    </>
  );
};
export default CardPage;
