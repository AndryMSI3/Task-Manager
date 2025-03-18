import mysql, { Connection } from "mysql2";
import dbConfig from "../config/db.config";

// Crée une connexion à MySQL sans spécifier de base de données
const connection: Connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    charset: 'utf8mb4',
});

// Ouvre la connexion MySQL
connection.connect((error: Error | null) => {
    if (error) throw error;
    console.log("Successfully connected to the MySQL server.");
});

// Fonction pour sélectionner une base de données
export function useDatabase(database: string, callback: (err: Error | null) => void) {
    connection.query(`USE ??`, [database], (err) => {
        if (err) {
            callback(err);
            return;
        }
        console.log(`Database changed to ${database}`);
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

export default connection;
