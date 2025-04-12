"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sql = require("./db");
const mapToDbFormat = (comment, cardId) => {
    return {
        card_id: cardId,
        text: comment.text,
        comment_id: comment.comId,
        user_id: comment.userId, // Mapper 'userId' vers 'user_id' pour l'insertion
        replied_to_comment_id: comment.repliedToCommentId || null
    };
};
const comment = {
    create: (newComment, cardId, result) => {
        sql.query("INSERT INTO commentaire SET ?", mapToDbFormat(newComment, cardId), (err, res) => {
            if (err) {
                console.log("Erreur :", err);
                result(err, null);
                return;
            }
            console.log("Commentaire créé : ", { id: res.insertId, ...newComment });
            result(null, [{ id: res.insertId, ...newComment }]);
        });
    },
    getAllByCardId: (cardId, result) => {
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
        `, [cardId], (err, res) => {
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
                    avatarUrl: comment.avatarUrl ? `http://localhost:3000/images/${comment.avatarUrl}` : "http://localhost:3000/images/default.png",
                    text: comment.text,
                    timestamp: comment.timestamp,
                    replies: repliesForComment.map(reply => ({
                        userId: reply.userId,
                        comId: reply.comId, // Identifiant unique pour la réponse
                        fullName: reply.fullName,
                        avatarUrl: reply.avatarUrl ? `http://localhost:3000/images/${reply.avatarUrl}` : "http://localhost:3000/images/default.png",
                        text: reply.text,
                        timestamp: reply.timestamp,
                    }))
                };
            });
            console.log("Commentaires avec réponses : ", groupedComments);
            result(null, groupedComments); // Retourner les commentaires avec leurs réponses et informations utilisateur
        });
    },
    delete: (commentId, result) => {
        sql.query("DELETE FROM commentaire WHERE comment_id = ?", commentId, (err, res) => {
            if (err) {
                console.log("Erreur :", err);
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                // Commentaire non trouvé avec l'ID
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("Commentaire supprimé avec l'ID : ", commentId);
            result(null, null);
        });
    }
};
exports.default = comment;
