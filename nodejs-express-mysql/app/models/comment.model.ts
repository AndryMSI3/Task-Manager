const sql = require("./db");
import mysql, { OkPacket } from 'mysql';
import { Request, Response } from "express";

interface Comment {
    text: string;
    comId: string;
    cardId: number;
    userId: number;
    repliedToCommentId: string;
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
    getAllByCardId: (cardId: number, result: ResultCallback<Comment>) => {
        sql.query(`SELECT user_id AS userId, text ,comment_id AS comId, user_id AS userId,
            replied_to_comment_id AS repliedToCommentId
            FROM commentaire WHERE card_id = ?`, 
            cardId, 
            (err: MySqlCustomError | null, res: Comment[] | null) => {
            if (err) {
                console.log("Erreur :", err);
                result(err,null);
                return;
            }
            console.log("Commentaires : ", res);
            result(null, res);
        });        
    },
    getAllRepliesByCommentId: (commentId: string, result: ResultCallback<Comment>) => {
        sql.query("SELECT * FROM commentaire WHERE replied_to_comment_id = ?", commentId, 
            (err: MySqlCustomError | null, res: Comment[] | null) => {
            if (err) {
                console.log("Erreur :", err);
                result(err,null);
                return;
            }
            console.log("Commentaires : ", res);
            result(null, res);
        });        
    },
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