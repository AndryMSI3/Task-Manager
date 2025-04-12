"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user = {
    login: (user, result) => {
        db_1.default.query("SELECT * FROM utilisateur WHERE user_name = ?", [user.user_name], (err, res) => {
            if (err) {
                console.error("Erreur:", err);
                result(err, null);
                return;
            }
            if (res.length) {
                bcrypt_1.default.compare(user.password, res[0].password, (err, isMatch) => {
                    if (err) {
                        console.error("Erreur:", err);
                        result(err, null);
                        return;
                    }
                    if (isMatch) {
                        console.log("Utilisateur trouvé");
                        result(null, res[0]);
                    }
                    else {
                        console.log("Utilisateur non trouvé");
                        result({ name: "not_found", message: "Utilisateur non trouvé" }, null);
                    }
                });
            }
            else {
                result({ name: "not_found", message: "Utilisateur non trouvé" }, null);
            }
        });
    },
    findById: (id, result) => {
        db_1.default.query("SELECT * FROM utilisateur WHERE user_id = ?", [id], (err, res) => {
            if (err) {
                console.error("Erreur:", err);
                result(err, null);
                return;
            }
            if (res.length) {
                console.log("Utilisateur trouvé: ", res[0]);
                result(null, res[0]);
            }
            else {
                result({ name: "not_found", message: "Utilisateur non trouvé" }, null);
            }
        });
    },
    getAll: (username, result) => {
        let query = "SELECT * FROM utilisateur";
        if (username) {
            query += ` WHERE user_name LIKE '%${username}%'`;
        }
        db_1.default.query(query, (err, res) => {
            if (err) {
                console.error("Erreur:", err);
                result(err, null);
                return;
            }
            console.log("Utilisateurs: ", res);
            result(null, res);
        });
    },
    getAllPrivilege: (result) => {
        db_1.default.query("SELECT * FROM utilisateur WHERE privilege IS NOT NULL", (err, res) => {
            if (err) {
                console.error("Erreur:", err);
                result(err, null);
                return;
            }
            console.log("Utilisateurs: ", res);
            result(null, res);
        });
    },
    updateById: (id, user, result) => {
        db_1.default.query("UPDATE utilisateur SET user_name = ?, password = ?, privilege = ?, user_picture = ? WHERE user_id = ?", [user.user_name, user.password, user.privilege, user.user_picture, id], (err, res) => {
            if (err) {
                console.error("Erreur:", err);
                result(err, null);
                return;
            }
            if (res.affectedRows === 0) {
                result({ name: "not_found", message: "Utilisateur non trouvé" }, null);
                return;
            }
            console.log("Utilisateur mis à jour: ", { id, ...user });
            result(null, { ...user, user_id: id });
        });
    },
    remove: (id, result) => {
        db_1.default.query("DELETE FROM utilisateur WHERE user_id = ?", [id], (err, res) => {
            if (err) {
                console.error("Erreur:", err);
                result(err, null);
                return;
            }
            if (res.affectedRows === 0) {
                result({ name: "not_found", message: "Utilisateur non trouvé" }, null);
                return;
            }
            console.log("Utilisateur supprimé avec l'ID: ", id);
            result(null, res);
        });
    }
};
exports.default = user;
