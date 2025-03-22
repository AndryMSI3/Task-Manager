"use client";

import dynamic from "next/dynamic";
import "react-comments-section/dist/index.css";
import { CommentSection } from "react-comments-section";
import '../components/css/CardPage.css';
import { useEffect, useState } from "react";

interface Comment {
  repliedToCommentId?: string;
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

interface userData {
  password: string;
  user_id: number;
  user_name: string;
  user_picture: string;
}

function Comments({userId,cardId,comments }:
  {userId:string,cardId:number,comments: Comment[]}) {
  const [currentUserData,setCurrentUserData] = useState<userData>();
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
  },[])
  const handleSubmitComment = (comment: Comment) => {
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
  return (
    <>
      {currentUserData && <CommentSection  
        showTimestamp={false}
        removeEmoji={true}     
        currentUser={{
          currentUserId: userId as string,
          currentUserImg: currentUserData?.user_picture? 
          `http://localhost:3000/images/${currentUserData.user_picture}`: 
          'http://localhost:3000/images/default.png' ,
          currentUserProfile: 'http://localhost:3000/profile',
          currentUserFullName: currentUserData.user_name,
        }}
        logIn={{
          onLogin: () => console.log('call login function'),
          signUpLink: '',
        }}
        commentData={comments}
        onReplyAction={(data: Comment) => handleSubmitComment(data)}
        onSubmitAction={(data: Comment) => handleSubmitComment(data)}
      />}
    </>
  )
}

export default Comments