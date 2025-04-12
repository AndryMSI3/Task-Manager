"use client";

import dynamic from "next/dynamic";
import "react-comments-section/dist/index.css";
import '../components/css/CardPage.css';
import { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Charger CommentSection dynamiquement pour éviter les problèmes SSR
const CommentSection = dynamic(() => import("react-comments-section").then((mod) => mod.CommentSection), { ssr: false });

interface Comment {
  repliedToCommentId?: string;
  userId: string;
  comId: string;
  fullName: string;
  avatarUrl: string;
  text: string;
  userProfile?: string;
  timestamp?: string;
  replies?: Comment[];
}

interface userData {
  password: string;
  user_id: number;
  user_name: string;
  user_picture: string;
}

function Comments({ cardId }: { cardId: number }) {
  const userId = localStorage.getItem("userConnectedId");

  const [comments,setComments] = useState<any[]>([
    {
      userId: '1',
      comId: '1',  // Identifiant unique pour ce commentaire
      fullName: 'Alice',
      avatarUrl: 'http://localhost:3000/images/alice.jpg',  // URL de l'avatar
      text: 'C’est un super article, j’ai vraiment apprécié !',
      timestamp: new Date().toISOString(),
      replies: [
        {
          userId: '2',
          comId: '1-1',  // Identifiant unique pour la réponse
          fullName: 'Bob',
          avatarUrl: 'http://localhost:3000/images/bob.jpg',  // URL de l'avatar
          text: 'Merci Alice ! Content que ça t’ait plu.',
          timestamp: new Date().toISOString(),
        }
      ],
    },
    {
      userId: '3',
      comId: '2',  // Identifiant unique pour ce commentaire
      fullName: 'Charlie',
      avatarUrl: 'http://localhost:3000/images/charlie.jpg',  // URL de l'avatar
      text: 'Intéressant, mais j’aurais aimé plus de détails sur ce point...',
      timestamp: new Date().toISOString(),
      replies: [],
    }
  ]);
  const [currentUserData, setCurrentUserData] = useState<userData | null>(null);
  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/${userId}`);
      const data = await response.json();
      setCurrentUserData(data);
    } catch (error) {
      console.log("Error fetching user data: ", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  useEffect(() =>{
    fetch(`http://localhost:8080/comments/card/${cardId}`)
    .then((res)=>res.json())
    .then((data)=>setComments(data))
  },[cardId])

  const handleSubmitComment = (comment: Comment) => {
    fetch('http://localhost:8080/comments/create', {
      method: 'POST',
      body: JSON.stringify({
        comment: comment,
        cardId: cardId
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  };

  const data = [
    {
      userId: '02b',
      comId: '017',
      fullName: 'Lily',
      userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
      text: 'I think you have a point🤔',
      avatarUrl: 'https://ui-avatars.com/api/name=Lily&background=random',
      timestamp: '2024-09-28T12:34:56Z',
      replies: [],
    }
  ]
  return (
    <>
        {currentUserData && (
          <CommentSection
          advancedInput={true}
          showTimestamp={false}
          removeEmoji={true}
          currentUser={{
            currentUserId: userId as string,
            currentUserImg: currentUserData?.user_picture
              ? `http://localhost:3000/images/${currentUserData.user_picture}`
              : 'http://localhost:3000/images/default.png',
            currentUserProfile: 'http://localhost:3000/profile',
            currentUserFullName: currentUserData.user_name,
          }}
          commentData={comments}
          onReplyAction={(data: Comment) => handleSubmitComment(data)}
          onSubmitAction={(data: Comment) => handleSubmitComment(data)}
        />
        )}
    </>
  );
}

export default Comments;
