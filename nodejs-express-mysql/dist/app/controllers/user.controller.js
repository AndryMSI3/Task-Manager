"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/user.model").default;
exports.findUser = (req, res) => {
    // Valide la requête
    if (!req.params.id) {
        return res.status(400).send({
            message: "Veuillez donnez un ID!"
        });
    }
    // Teste si l'utilisateur existe dans la base de données
    User.findById(req.params.id, (err, userData) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: "Aucun utilisateur avec cette ID !"
                });
            }
            else {
                console.error("Erreur lors de la connexion :", err);
                return res.status(500).send({
                    message: "Erreur interne du serveur"
                });
            }
        }
        else {
            return res.send(userData);
        }
    });
};
/**
 * Authentifie un utilisateur en fonction de son nom d'utilisateur et de son mot de passe.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.login = (req, res) => {
    // Valide la requête
    if (!req.body || req.body.password == '' || req.body.user_name == '') {
        return res.status(400).send({
            message: "Le contenu ne peut pas être vide !"
        });
    }
    // Teste si l'utilisateur existe dans la base de données
    User.login(req.body, (err, userData) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: "Nom d'utilisateur ou mot de passe incorrect"
                });
            }
            else {
                console.error("Erreur lors de la connexion :", err);
                return res.status(500).send({
                    message: "Erreur interne du serveur"
                });
            }
        }
        else {
            return res.send(userData);
        }
    });
};
/**
 * Récupère tous les utilisateurs avec une condition (ex : par nom d'utilisateur).
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.findAll = (req, res) => {
    const username = req.query.username;
    User.getAll(username, (err, data) => {
        if (err) {
            return res.status(500).send({
                message: err.message || "Une erreur est survenue lors de la récupération des utilisateurs."
            });
        }
        else {
            return res.send(data);
        }
    });
};
/**
 * Récupère tous les utilisateurs ayant un privilège particulier.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.findAllPrivilege = (req, res) => {
    User.getAllPrivilege((err, data) => {
        if (err) {
            return res.status(500).send({
                message: err.message || "Une erreur est survenue lors de la récupération des utilisateurs avec privilège."
            });
        }
        else {
            return res.send(data);
        }
    });
};
/**
 * Récupère un utilisateur par son ID.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.findOne = (req, res) => {
    User.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `Utilisateur avec l'ID ${req.params.id} non trouvé.`
                });
            }
            else {
                return res.status(500).send({
                    message: "Erreur lors de la récupération de l'utilisateur avec l'ID " + req.params.id
                });
            }
        }
        else {
            return res.send(data);
        }
    });
};
/**
 * Met à jour un utilisateur identifié par son ID dans la base de données.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.update = (req, res) => {
    // Valide la requête
    if (!req.body) {
        return res.status(400).send({
            message: "Le contenu ne peut pas être vide !"
        });
    }
    User.updateById(req.params.id, new User(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `Utilisateur avec l'ID ${req.params.id} non trouvé.`
                });
            }
            else {
                return res.status(500).send({
                    message: "Erreur lors de la mise à jour de l'utilisateur avec l'ID " + req.params.id
                });
            }
        }
        else {
            return res.send(data);
        }
    });
};
/**
 * Supprime un utilisateur par son ID.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
exports.delete = (req, res) => {
    User.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `Utilisateur avec l'ID ${req.params.id} non trouvé.`
                });
            }
            else {
                return res.status(500).send({
                    message: "Erreur lors de la suppression de l'utilisateur avec l'ID " + req.params.id
                });
            }
        }
        else {
            return res.send({ message: "Utilisateur supprimé avec succès !" });
        }
    });
};
exports.associate = (req, res) => {
    // Valide la requête
    if (!req.body) {
        return res.status(400).send({
            message: "Le contenu ne peut pas être vide !"
        });
    }
    User.associate(req.body, (err, data) => {
        if (err) {
            return res.status(500).send({
                message: "Erreur lors de la suppression de l'utilisateur avec l'ID " + req.params.id
            });
        }
        else {
            return res.send({ message: "Utilisateur associé avec succès !" });
        }
    });
};
