"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sql = require("./db");
const card = {
    create: (newCard, result) => {
        sql.query("INSERT INTO carte SET ?", {
            card_title: newCard.card_title,
            user_id: newCard.user_id
        }, (err, res) => {
            if (err) {
                console.log("❌ Erreur d'insertion de la carte :", err);
                result(err, null);
                return;
            }
            console.log("✔️  Carte créée : ", { id: res.insertId, ...newCard });
            // Séparation des user_ids à partir de newCard.options
            const userIds = newCard?.options?.split(',');
            // Pour chaque user_id, insérer dans la table carte_utilisateur
            userIds.forEach((userId) => {
                sql.query("INSERT INTO carte_utilisateur(user_id, card_id) VALUES (?, ?)", [userId, res.insertId], (err, res) => {
                    if (err) {
                        console.error("❌ Erreur lors de l'association utilisateur avec la carte :", err);
                        return;
                    }
                    console.log(`✔️  Utilisateur ${userId} associé avec la tâche ${res.insertId}`);
                });
            });
            sql.query("INSERT INTO contenue_carte SET ?", {
                content: '', // Insérer la chaîne vide
                card_id: res.insertId
            }, (err, res) => {
                if (err) {
                    console.error("❌ Erreur lors de la création du contenu de la carte :", err);
                    result(err, null);
                    return;
                }
            });
            // Retourner le résultat final (carte créée, associations et contenu)
            result(null, { id: res.insertId, ...newCard });
        });
    },
    getAllCards: (result) => {
        sql.query("SELECT * FROM carte ORDER BY id DESC", (err, res) => {
            if (err) {
                console.log("❌ Erreur lors de la récupération des cartes :", err);
                result(err, null);
                return;
            }
            console.log("📦 Cartes récupérées (Total :", res.length, ") :", res);
            if (res.length) {
                result(null, res);
                return;
            }
            result({ kind: "not_found" }, null);
        });
    },
    findCard: (id, result) => {
        sql.query("SELECT * FROM carte WHERE list_id = ? ORDER BY  card_description ASC", [id], (err, res) => {
            if (err) {
                console.log("Erreur :", err);
                result(err, null);
                return;
            }
            if (res.length) {
                result(null, res);
                return;
            }
            // Aucun résultat trouvé
            result({ kind: "not_found" }, null);
        });
    },
    getCardMaxID: (result) => {
        sql.query("SELECT MAX(card_id) AS max_id FROM carte", (err, res) => {
            if (err) {
                console.log("Erreur :", err);
                result(err, null);
                return;
            }
            if (res.length) {
                result(null, res);
                return;
            }
            // Aucun résultat trouvé
            result({ kind: "not_found" }, null);
        });
    },
    remove: (id, result) => {
        sql.query("DELETE FROM carte WHERE card_id = ?", id, (err, res) => {
            if (err) {
                console.log("Erreur :", err);
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                // Carte non trouvée avec l'ID
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("Carte supprimée avec l'ID : ", id);
            result(null, null);
        });
    },
    findByUserId: (id, result) => {
        sql.query(`SELECT c.card_title, c.card_id, c.user_id FROM carte c 
            INNER JOIN carte_utilisateur cu ON cu.card_id = c.card_id
            INNER JOIN utilisateur u ON cu.user_id = u.user_id 
            WHERE u.user_id = ?`, id, (err, res) => {
            if (err) {
                console.log("❌ Erreur SQL :", err);
                result(err, null);
                return;
            }
            console.log(`📦 Cartes trouvées pour user ${id} : `, res);
            if (res.length == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, res);
        });
    }
};
exports.default = card;
