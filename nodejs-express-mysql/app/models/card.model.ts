const sql = require("./db");
import mysql, { OkPacket } from 'mysql';

interface Card {
    card_id: number;
    card_title: string;
    options?: string;
}

type MaxIdResult = { max_id: number | null };

interface MySqlCustomError extends mysql.MysqlError {
    kind: string;
}

type ResultCallback<T> = (err: Error | null, result: T | T[] | null) => void;

const card = {
    create: (newCard: Card, result: ResultCallback<Card>) => {
        sql.query("INSERT INTO carte SET ?", {
                card_title: newCard.card_title
            }, (err: MySqlCustomError | null, res: OkPacket) => {
                if (err) {
                    console.log("❌ Erreur d'insertion de la carte :", err);
                    result(err, null);
                    return;
                }
                console.log("✔️ Carte créée : ", { id: res.insertId, ...newCard });
    
                // Séparation des user_ids à partir de newCard.options
                const userIds: string[] = newCard?.options?.split(',') as string[];
    
                // Pour chaque user_id, insérer dans la table carte_utilisateur
                userIds.forEach((userId) => {
                    sql.query("INSERT INTO carte_utilisateur(user_id, card_id) VALUES (?, ?)", 
                        [userId, res.insertId], (err: mysql.MysqlError | null, res: OkPacket) => {
                        if (err) {
                            console.error("❌ Erreur lors de l'association utilisateur avec la carte :", err);
                            return;
                        }
                        console.log(`✔️ Utilisateur ${userId} associé avec la tâche ${res.insertId}`);
                    });
                });
    
    
                sql.query("INSERT INTO contenue_carte SET ?", {
                    content: '',  // Insérer la chaîne vide
                    card_id: res.insertId
                }, (err: MySqlCustomError | null, res: OkPacket) => {
                    if (err) {
                        console.error("❌ Erreur lors de la création du contenu de la carte :", err);
                        result(err, null);
                        return;
                    }
                });
    
                // Retourner le résultat final (carte créée, associations et contenu)
                result(null, { id: res.insertId, ...newCard } as Card);
            });
    },
       
    getAllCards: (result: ResultCallback<Card[]>) => {
        sql.query("SELECT * FROM carte ORDER BY id DESC", (err: MySqlCustomError | null, res: Card[]) => {
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
    
            result({ kind: "not_found" } as MySqlCustomError, null);
        });
    }
    ,
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
        sql.query(`SELECT c.card_title, c.card_id FROM carte c 
            INNER JOIN carte_utilisateur cu ON cu.card_id = c.card_id
            INNER JOIN utilisateur u ON cu.user_id = u.user_id 
            WHERE u.user_id = ?`, id, 
            (err: MySqlCustomError | null, res: Card[]) => {
            if (err) {
                console.log("❌ Erreur SQL :", err);
                result(err, null);
                return;
            }
            console.log(`📦 Cartes trouvées pour user ${id} : `, res);
    
            if (res.length == 0) {
                result({ kind: "not_found" } as MySqlCustomError, null);
                return;
            } 
            result(null, res);
        });
    }
    
}

export default card;