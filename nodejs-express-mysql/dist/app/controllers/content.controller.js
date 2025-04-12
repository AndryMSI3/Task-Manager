"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardContent = require("../models/content.model").default;
/**
 * Crée et enregistre un nouveau contenu de carte.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.createCardContent =
    (req, res) => {
        // Valide la requête
        if (!req.body) {
            res.status(400).send({
                message: "Content cannot be empty!"
            });
            return;
        }
        // Enregistre le contenu de la carte dans la base de données
        CardContent.create(req.body, (err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Card Content."
                });
            }
            else {
                res.send(data);
            }
        });
    };
/**
 * Met à jour un contenu de carte identifié par l'Id de la carte dans la requête.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.updateCardContent = (req, res) => {
    // Valide la requête
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }
    const cardId = req.params.id;
    const updatedContent = JSON.stringify(req.body.htmlContent);
    CardContent.updateById(cardId, updatedContent, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(400).send({
                    message: `Not found Card Content with id ${cardId}.`
                });
            }
            else {
                res.status(500).send({
                    message: "Error updating Card Content with id " + cardId
                });
            }
        }
        else {
            res.send(data);
        }
    });
};
/**
 * Supprime un contenu de carte avec l'Id spécifié dans la requête.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.deleteCardContent = (req, res) => {
    const cardId = req.params.id;
    CardContent.remove(cardId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Card Content with id ${cardId}.`
                });
            }
            else {
                res.status(500).send({
                    message: `Could not delete Card Content with id ${cardId}.`
                });
            }
        }
        else {
            res.send({ message: "Card Content was deleted successfully!" });
        }
    });
};
/**
 * Trouve un contenu de carte par son Id.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.findCardContent = (req, res) => {
    const cardId = req.params.id;
    CardContent.findByCardId(cardId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Card Content with id ${cardId}.`
                });
            }
            else {
                res.status(500).send({
                    message: "Error retrieving Card Content with id " + cardId
                });
            }
        }
        else {
            res.send(data);
        }
    });
};
