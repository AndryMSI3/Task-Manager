"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sql = require("./db");
const cardContent = {
    create: (newCardContent, result) => {
        sql.query("INSERT INTO contenue_carte SET ?", {
            content: newCardContent?.content,
            card_id: newCardContent?.card_id
        }, (err, res) => {
            if (err) {
                console.error("Error:", err);
                result(err, null);
                return;
            }
            console.log("Created content: ", { newCardContent });
            result(null, newCardContent);
        });
    },
    updateById: (cardId, updatedContent, result) => {
        sql.query("UPDATE contenue_carte SET content = ? WHERE card_id = ?", [updatedContent, cardId], (err, res) => {
            if (err) {
                console.error("Error: ", err);
                result(err, null);
                return;
            }
            if (res.affectedRows === 0) {
                // Contenu de carte non trouvé avec cet ID
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("Updated card content: ", { id: cardId, content: updatedContent });
            result(null, { card_id: cardId, content: updatedContent });
        });
    },
    findByCardId: (cardId, result) => {
        sql.query(`SELECT * FROM contenue_carte WHERE card_id = ${cardId}`, (err, res) => {
            if (err) {
                console.error("Error", err);
                result(err, null);
                return;
            }
            if (res?.length) {
                console.log("Found card content: ", res[0]);
                result(null, res[0]);
                return;
            }
            // Contenu de carte non trouvé avec cet ID
            result({ kind: "not_found" }, null);
        });
    },
    remove: (cardId, result) => {
        sql.query("DELETE FROM contenue_carte WHERE card_id = ?", cardId, (err, res) => {
            if (err) {
                console.error("Error: ", err);
                result(err, null);
                return;
            }
            if (res.affectedRows === 0) {
                // Contenu de carte non trouvé avec cet ID
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("Deleted content with id: ", cardId);
            result(err, null);
        });
    }
};
exports.default = cardContent;
