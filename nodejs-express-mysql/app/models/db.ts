import mysql from "mysql2";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import dbConfig from "../config/db.config";

// Crée une connexion à la base de données
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    charset: "utf8mb4",
});

function databaseExists(callback: (exists: boolean) => void) {
    connection.query(`SHOW DATABASES LIKE ?;`, [dbConfig.DATABASE], (err, results) => {
        if (err) {
            console.error("❌ Erreur lors de la vérification de la base :", err);
            callback(false);
            return;
        }

        if (Array.isArray(results) && results.length > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

// Créer la base et importer le backup si nécessaire
function createAndImportDatabase(callback: (err: Error | null) => void) {
    connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${dbConfig.DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
        (err) => {
            if (err) {
                callback(err);
                return;
            }
            console.log(`✅ Base de données "${dbConfig.DATABASE}" créée.`);

            // Importer le backup
            importBackup((err) => {
                if (err) {
                    callback(err);
                    return;
                }

                // Sélectionner la base après l'importation
                useDatabase(callback);
            });
        }
    );
}

// Sélectionner la base de données
function useDatabase(callback: (err: Error | null) => void) {
    connection.query(`USE \`${dbConfig.DATABASE}\`;`, (err) => {
        if (err) {
            callback(err);
            return;
        }
        console.log(`✅ Base de données "${dbConfig.DATABASE}" sélectionnée.`);
        callback(null);
    });
}

function importBackup(callback: (err: Error | null) => void) {
    console.log("__dirname:", __dirname);

    const backupPath = path.join(__dirname, "../../backup.sql");

    if (!fs.existsSync(backupPath)) {
        console.warn("⚠️ Aucun fichier backup.sql trouvé. Ignoré.");
        callback(null);
        return;
    }

    // Commande pour importer le fichier SQL avec la ligne de commande MySQL
    const command = `mysql --defaults-file="${path.join(__dirname, "../../.my.cnf")}" cardManager < "${backupPath}"`;

    // Exécuter la commande via exec()
    exec(command, (err, stdout, stderr) => {
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
export function query(sql: string, params: any[], callback: (err: Error | null, result: any) => void) {
    connection.query(sql, params, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

// Initialisation complète
export function initializeDatabase(callback: (err: Error | null) => void) {
    databaseExists((exists) => {
        if (exists) {
            console.log("✅ La base de données existe déjà.");
            useDatabase(callback);
        } else {
            console.log("⚠️ La base de données n'existe pas. Création en cours...");
            createAndImportDatabase(callback);
        }
    });
}

export default connection;
