import mysql, { Pool } from "mysql2";
import fs from "fs";
import path from "path";
import dbConfig from "../config/db.config";

// Crée un pool de connexions sans base de données au départ
const pool: Pool = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE, // 🔥 Assurez-vous que cette ligne est présente
    charset: "utf8mb4",
    waitForConnections: true
});

function databaseExists(callback: (exists: boolean) => void) {
    pool.query(`SHOW DATABASES LIKE ?;`, [dbConfig.DATABASE], (err, results) => {
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



// Sélectionner la base de données
function useDatabase(callback: (err: Error | null) => void) {
    pool.query(`USE \`${dbConfig.DATABASE}\`;`, (err) => {
        if (err) {
            callback(err);
            return;
        }
        console.log(`✅ Base de données "${dbConfig.DATABASE}" sélectionnée.`);
        callback(null);
    });
}

// Créer la base et importer le backup si nécessaire
function createAndImportDatabase(callback: (err: Error | null) => void) {
    
    pool.query(
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

// Importer le backup SQL
function importBackup(callback: (err: Error | null) => void) {
    const backupPath = path.join(__dirname, "../backup.sql");

    if (!fs.existsSync(backupPath)) {
        console.warn("⚠️ Aucun fichier backup.sql trouvé. Ignoré.");
        callback(null);
        return;
    }

    const sql = fs.readFileSync(backupPath, "utf8");

    pool.query(sql, [], (err) => {
        if (err) {
            callback(err);
            return;
        }
        console.log("✅ Backup SQL importé avec succès !");
        callback(null);
    });
}

// Fonction pour exécuter une requête SQL
export function query(sql: string, params: any[], callback: (err: Error | null, result: any) => void) {

    pool.query(sql, params, (err, results) => {
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

export default pool;
