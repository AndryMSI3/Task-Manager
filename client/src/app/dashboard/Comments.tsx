import dynamic from "next/dynamic";
import "react-comments-section/dist/index.css";
import { CommentSection } from "react-comments-section";
import '../components/css/CardPage.css';


function Comments({userId , cardId, currentUserData, comments }:
  {userId:string,cardId:number,currentUserData:any,comments:any}) {
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
  return (
    <>
      <CommentSection  
        showTimestamp={false}
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
          onLogin: () => console.log('call login function'),
          signUpLink: '',
        }}
        commentData={comments}
        onReplyAction={(data: string) => handleSubmitComment(data)}
        onSubmitAction={(data: string) => handleSubmitComment(data)}
      />
    </>
  )
}

export default Comments