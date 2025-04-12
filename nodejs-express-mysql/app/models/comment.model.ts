const sql = require("./db");
import mysql, { OkPacket } from 'mysql';
import { Request, Response } from "express";
interface Comment {
    text: string;
    comId: string;
    cardId: number;
    userId: number;
    repliedToCommentId?: string | null;
    replies?: Comment[];  // Ajouter un tableau de réponses
}

const mapToDbFormat = (comment: Comment, cardId: number): any => {
    return {
        card_id: cardId,
        text: comment.text,
        comment_id: comment.comId,
        user_id: comment.userId,  // Mapper 'userId' vers 'user_id' pour l'insertion
        replied_to_comment_id: comment.repliedToCommentId || null
    };
};

interface MySqlCustomError extends mysql.MysqlError {
    kind: string;
}

type ResultCallback<T> = (err: Error | null, result: T[] | T | null) => void;

const comment = {
    create: (newComment: Comment, cardId: number,result: ResultCallback<Comment>) => {
        sql.query("INSERT INTO commentaire SET ?", 
        mapToDbFormat(newComment,cardId) , 
        (err: MySqlCustomError | null, res: OkPacket) => {
            if (err) {
                console.log("Erreur :", err);
                result(err, null);
                return;
            }
            console.log("Commentaire créé : ", { id: res.insertId, ...newComment });
            result(null, [{ id: res.insertId, ...newComment } as Comment]);
        });
        
    },  
    getAllByCardId: (cardId: number, result: ResultCallback<any>) => {
        // Étape 1: Récupérer tous les commentaires et leurs réponses associés pour un cardId spécifique avec les informations utilisateur
        sql.query(`
            SELECT
                c.comment_id AS comId,
                c.text,
                c.user_id AS userId,
                c.card_id AS cardId,
                c.replied_to_comment_id AS repliedToCommentId,
                u.user_name AS fullName,
                u.user_picture AS avatarUrl
            FROM
                commentaire c
            LEFT JOIN utilisateur u ON c.user_id = u.user_id
            WHERE
                c.card_id = ?;
        `, [cardId], (err: MySqlCustomError | null, res: any[] | null) => {
            if (err) {
                console.log("Erreur :", err);
                result(err, null);
                return;
            }
    
            // Séparer les commentaires principaux et les réponses
            const mainComments = res?.filter(comment => comment.repliedToCommentId === null) || [];
            const replies = res?.filter(comment => comment.repliedToCommentId !== null) || [];
    
            // Étape 2: Regrouper les réponses sous les commentaires principaux et ajouter les informations utilisateur
            const groupedComments = mainComments.map(comment => {
                const repliesForComment = replies.filter(reply => reply.repliedToCommentId === comment.comId);
    
                // Ajouter les réponses sous le commentaire principal
                return {
                    userId: comment.userId,
                    comId: comment.comId,
                    fullName: comment.fullName,
                    avatarUrl: comment.avatarUrl ?`http://localhost:3000/images/${comment.avatarUrl}`: "http://localhost:3000/images/default.png",
                    text: comment.text,
                    timestamp: comment.timestamp,
                    replies: repliesForComment.map(reply => ({
                        userId: reply.userId,
                        comId: reply.comId,  // Identifiant unique pour la réponse
                        fullName: reply.fullName,
                        avatarUrl: reply.avatarUrl ?`http://localhost:3000/images/${reply.avatarUrl}`: "http://localhost:3000/images/default.png",
                        text: reply.text,
                        timestamp: reply.timestamp,
                    }))
                };
            });
    
            console.log("Commentaires avec réponses : ", groupedComments);
            result(null, groupedComments); // Retourner les commentaires avec leurs réponses et informations utilisateur
        });
    }
    ,
    delete: (commentId: number, result: ResultCallback<Comment>)  => {
        sql.query("DELETE FROM commentaire WHERE comment_id = ?", commentId, 
        (err: MySqlCustomError | null, res: OkPacket) => {
            if (err) {
                console.log("Erreur :", err);
                result(err, null);
                return;
            }
    
            if (res.affectedRows == 0) {
                // Commentaire non trouvé avec l'ID
                result({ kind: "not_found" } as MySqlCustomError, null);
                return;
            }
            console.log("Commentaire supprimé avec l'ID : ", commentId);
            result(null,null);
        });
    }
}

export default comment;