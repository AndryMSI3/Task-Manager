const sql = require("./db");
import mysql, { OkPacket } from 'mysql';

interface Card {
    card_id: number;
    card_title: string;
}

type MaxIdResult = { max_id: number | null };

interface MySqlCustomError extends mysql.MysqlError {
    kind: string;
}

type ResultCallback<T> = (err: Error | null, result: T | T[] | null) => void;

const card = {
    create: (newCard: any, result: ResultCallback<Card>) => {
        sql.query("INSERT INTO carte SET ?", newCard, (err: MySqlCustomError | null, res: OkPacket) => {
            if (err) {
                console.log("Erreur :", err);
                result(err, null);
                return;
            }
            console.log("Carte créée : ", { id: res.insertId, ...newCard });
            result(null, { id: res.insertId, ...newCard } as Card);
        });
    },
    getAllCards: (result: ResultCallback<Card[]>) => {
        sql.query("SELECT * FROM carte ORDER BY id DESC", 
            (err: MySqlCustomError | null, res: Card[]) => {
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
            result({ kind: "not_found" } as MySqlCustomError, null);
        });
    },
    findCard: (id: number, result:ResultCallback<Card[]>) => {
        sql.query("SELECT * FROM carte WHERE list_id = ? ORDER BY  card_description ASC", [id], 
            (err: MySqlCustomError | null, res: Card[]) => {
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
            result({ kind: "not_found" } as MySqlCustomError, null);
        });
    },
    getCardMaxID: (result: ResultCallback<MaxIdResult[]>) => {
        sql.query("SELECT MAX(card_id) AS max_id FROM carte", 
            (err: MySqlCustomError | null, res:MaxIdResult[]) => {
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
            result({ kind: "not_found" } as MySqlCustomError, null);
        });
    },

    remove: (id: number, result: ResultCallback<Card>)  => {
        sql.query("DELETE FROM carte WHERE card_id = ?", id, 
            (err: MySqlCustomError | null, res: OkPacket) => {
            if (err) {
                console.log("Erreur :", err);
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                // Carte non trouvée avec l'ID
                result({ kind: "not_found" } as MySqlCustomError, null);
                return;
            }
            console.log("Carte supprimée avec l'ID : ", id);
            result(null, null);
        });
    },

    findByUserId: (id: number, result: ResultCallback<Card>)  => {
        sql.query("SELECT * FROM carte WHERE user_id = ?", id, 
            (err: MySqlCustomError | null, res: Card[]) => {
            if (err) {
                console.log("Erreur :", err);
                result(err, null);
                return;
            }
            if (res.length == 0) {
                // Carte non trouvée avec l'ID
                result({ kind: "not_found" } as MySqlCustomError, null);
                return;
            } 
            // console.log("Carte(s) avec l'ID d'utilisateur trouvé ");
            result(null,res);
        });
    }
}

export default card;