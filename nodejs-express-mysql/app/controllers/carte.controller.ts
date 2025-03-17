import { Request, Response } from "express";
import { MysqlError } from "mysql";
const card = require("../models/card.model").default;

type MySqlCustomError = MysqlError & { kind?: string };

interface cardData {
    list_id: number;
    card_title: string;
    card_description: string;
    due_date: Date;
}
/**
 * Crée et sauvegarde une nouvelle carte.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.createCard = (req: Request, res: Response) => {
    // Valide la requête
    if (!req.body) {
        res.status(400).send({
            message: "Le contenu ne peut pas être vide !"
        });
        return;
    }

    // Sauvegarde de la carte dans la base de données
    card.create(req.body, (err: MySqlCustomError | null, data: cardData[] | null) => {
        if (err)
            res.status(500).send({
                message: err.message || "Une erreur est survenue lors de la création de la carte."
            });
        else res.send(data);
    });
};

/**
 * Trouve une carte spécifique par son Id.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.findCard = (req: Request, res: Response) => {
    card.findCard(req.params.id, (err: MySqlCustomError | null, data: cardData[] | null) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Carte non trouvée avec l'Id de liste ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Erreur lors de la récupération de la carte avec l'Id de liste " + req.params.id
                });
            }
        } else res.send(data);
    }); 
};

/**
 * Récupère toutes les cartes.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.allCards = (req: Request, res: Response) => {
    card.getAllCards((err: MySqlCustomError | null, data: cardData[] | null) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Aucune carte trouvée.`
                });
            } else {
                res.status(500).send({
                    message: "Erreur lors de la récupération des cartes."
                });
            }
        } else res.send(data);
    }); 
};

/**
 * Trouve la carte avec l'Id maximum.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.findCardMaxId = (req: Request, res: Response) => {
    card.getCardMaxID((err: MySqlCustomError | null, data: cardData[] | null) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Aucune carte trouvée avec l'Id maximum.`
                });
            } else {
                res.status(500).send({
                    message: "Erreur lors de la récupération de la carte avec l'Id maximum."
                });
            }
        } else res.send(data);
    }); 
};

/**
 * Supprime une carte par son Id.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.delete = (req: Request, res: Response) => {
    card.remove(req.params.id, (err: MySqlCustomError | null, data: cardData[] | null) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Carte non trouvée avec l'Id ${req.params.id}.`
                });
            }
        } else res.send({ message: "Carte supprimée avec succès !" });
    });
};

exports.findByUser = (req: Request, res: Response) => {
    card.findByUserId(req.params.id, (err: MySqlCustomError | null, data: cardData[] | null) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Carte(s) avec l'Id d'utilisateur non trouvée`
                });
            }
        } else res.send(data);
    });
};
