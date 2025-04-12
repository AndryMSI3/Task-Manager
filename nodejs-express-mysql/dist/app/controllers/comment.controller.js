"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment = require("../models/comment.model").default;
/**
 * Crée et sauvegarde un nouveau commentaire.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.createComment = (req, res) => {
    // Valide la requête
    if (!req.body) {
        res.status(400).send({
            message: "Le contenu ne peut pas être vide !"
        });
        return;
    }
    // Sauvegarde le commentaire dans la base de données
    comment.create(req.body.comment, req.body.cardId, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Une erreur est survenue lors de la création du commentaire."
            });
        else
            res.send(data);
    });
};
/**
 * Supprime un commentaire avec l'ID spécifié dans la requête.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.deleteComment = (req, res) => {
    comment.delete(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Commentaire non trouvé avec l'ID ${req.params.commentId}.`
                });
            }
            else {
                res.status(500).send({
                    message: "Erreur lors de la suppression du commentaire avec l'ID " + req.params.commentId
                });
            }
        }
        else
            res.send({ message: "Le commentaire a été supprimé avec succès !" });
    });
};
/**
 * Récupère tous les commentaires d'une carte spécifique à partir de l'ID de la carte.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.findAllComments = (req, res) => {
    const cardId = req.params.id;
    comment.getAllByCardId(cardId, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Une erreur est survenue lors de la récupération des commentaires."
            });
        else
            res.send(data);
    });
};
