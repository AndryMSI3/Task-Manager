"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = query;
exports.initializeDatabase = initializeDatabase;
const mysql2_1 = __importDefault(require("mysql2"));
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_config_1 = __importDefault(require("../config/db.config"));
// Crée une connexion à la base de données
const connection = mysql2_1.default.createConnection({
    host: db_config_1.default.HOST,
    user: db_config_1.default.USER,
    password: db_config_1.default.PASSWORD,
    charset: "utf8mb4",
});
function databaseExists(callback) {
    connection.query(`SHOW DATABASES LIKE ?;`, [db_config_1.default.DATABASE], (err, results) => {
        if (err) {
            console.error("❌ Erreur lors de la vérification de la base :", err);
            callback(false);
            return;
        }
        if (Array.isArray(results) && results.length > 0) {
            callback(true);
        }
        else {
            callback(false);
        }
    });
}
// Créer la base et importer le backup si nécessaire
function createAndImportDatabase(callback) {
    connection.query(`CREATE DATABASE IF NOT EXISTS \`${db_config_1.default.DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`, (err) => {
        if (err) {
            callback(err);
            return;
        }
        console.log(`✅ Base de données "${db_config_1.default.DATABASE}" créée.`);
        // Importer le backup
        importBackup((err) => {
            if (err) {
                callback(err);
                return;
            }
            // Sélectionner la base après l'importation
            useDatabase(callback);
        });
    });
}
// Sélectionner la base de données
function useDatabase(callback) {
    connection.query(`USE \`${db_config_1.default.DATABASE}\`;`, (err) => {
        if (err) {
            callback(err);
            return;
        }
        console.log(`✅ Base de données "${db_config_1.default.DATABASE}" sélectionnée.`);
        callback(null);
    });
}
function importBackup(callback) {
    console.log("__dirname:", __dirname);
    const backupPath = path_1.default.join(__dirname, "../../backup.sql");
    if (!fs_1.default.existsSync(backupPath)) {
        console.warn("⚠️ Aucun fichier backup.sql trouvé. Ignoré.");
        callback(null);
        return;
    }
    // Commande pour importer le fichier SQL avec la ligne de commande MySQL
    const command = `mysql --defaults-file="${path_1.default.join(__dirname, "../../.my.cnf")}" cardManager < "${backupPath}"`;
    // Exécuter la commande via exec()
    (0, child_process_1.exec)(command, (err, stdout, stderr) => {
        if (err) {
            console.error("❌ Erreur lors de l'importation du backup SQL:", stderr);
            callback(err);
            return;
        }
        console.log("✅ Backup SQL importé avec succès !");
        callback(null);
    });
}
// Fonction pour exécuter une requête SQL
function query(sql, params, callback) {
    connection.query(sql, params, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}
// Initialisation complète
function initializeDatabase(callback) {
    databaseExists((exists) => {
        if (exists) {
            console.log("✅ La base de données existe déjà.");
            useDatabase(callback);
        }
        else {
            console.log("⚠️ La base de données n'existe pas. Création en cours...");
            createAndImportDatabase(callback);
        }
    });
}
exports.default = connection;
