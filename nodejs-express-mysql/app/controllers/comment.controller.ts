import { Request, Response } from "express";
import { MysqlError } from "mysql";
const comment = require("../models/comment.model").default;

type MySqlCustomError = MysqlError & { kind?: string };

interface Comment {
    comment_id: string;
    user_id: string;
    text:string;
    card_id: string;
}

/**
 * Crée et sauvegarde un nouveau commentaire.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.createComment = (req: Request, res: Response) => {
    // Valide la requête
    if (!req.body) {
        res.status(400).send({
            message: "Le contenu ne peut pas être vide !"
        });
        return;
    }

    // Sauvegarde le commentaire dans la base de données
    comment.create(req.body.comment,req.body.cardId, (err: MySqlCustomError | null, data: Comment[] | null) => {
        if (err)
            res.status(500).send({
                message: err.message || "Une erreur est survenue lors de la création du commentaire."
            });
        else res.send(data);
    });
};

/**
 * Supprime un commentaire avec l'ID spécifié dans la requête.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.deleteComment = (req: Request, res: Response) => {
    comment.delete(req.params.id,  (err: MySqlCustomError | null, data: Comment[] | null) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Commentaire non trouvé avec l'ID ${req.params.commentId}.`
                });
            } else {
                res.status(500).send({
                    message: "Erreur lors de la suppression du commentaire avec l'ID " + req.params.commentId
                });
            }
        } else res.send({ message: "Le commentaire a été supprimé avec succès !" });
    });
};

/**
 * Récupère tous les commentaires d'une carte spécifique à partir de l'ID de la carte.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.findAllComments = (req: Request, res: Response) => {
    const cardId = req.params.id;
    comment.getAllByCardId(cardId,  (err: MySqlCustomError | null, data: Comment[] | null) => {
        if (err)
            res.status(500).send({
                message: err.message || "Une erreur est survenue lors de la récupération des commentaires."
            });
        else res.send(data);
    });
};

exports.findAllReplies = (req: Request, res: Response) => {
    const commentId = req.params.id;
    comment.getAllRepliesByCommentId(commentId,  (err: MySqlCustomError | null, data: Comment[] | null) => {
        if (err)
            res.status(500).send({
                message: err.message || "Une erreur est survenue lors de la récupération des commentaires."
            });
        else res.send(data);
    });
};