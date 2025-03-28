const sql = require("./db");
import mysql, { OkPacket } from 'mysql';
import { Request, Response } from "express";

interface cardContent {
    content: Blob;
    card_id: number;
}

interface MySqlCustomError extends mysql.MysqlError {
    kind: string;
}

type ResultCallback<T> = (err: Error | null, result: T[] | T | null) => void;

const cardContent =  {
    create: (newCardContent: cardContent | null, result: ResultCallback<cardContent>) => {
        sql.query("INSERT INTO contenue_carte SET ?", {
            content: newCardContent?.content,
            card_id: newCardContent?.card_id
        },     
            (err: MySqlCustomError | null, res: OkPacket) => {
            if (err) {
                console.error("Error:", err);
                result(err, null);
                return;
            }
    
            console.log("Created content: ", { newCardContent });
            result(null, newCardContent);
        });
    },
    updateById : (cardId: number, updatedContent: Blob, result: ResultCallback<cardContent>) => {
        sql.query(
            "UPDATE contenue_carte SET content = ? WHERE card_id = ?",
            [updatedContent, cardId],
            (err: MySqlCustomError | null, res: OkPacket) => {
                if (err) {
                    console.error("Error: ", err);
                    result(err, null);
                    return;
                }
    
                if (res.affectedRows === 0) {
                    // Contenu de carte non trouvé avec cet ID
                    result({ kind: "not_found" } as MySqlCustomError, null);
                    return;
                }
    
                console.log("Updated card content: ", { id: cardId, content: updatedContent });
                result(null, { card_id: cardId, content: updatedContent });
            }
        );
    },
    findByCardId : (cardId: number, result: ResultCallback<cardContent>) => {
        sql.query(`SELECT * FROM contenue_carte WHERE card_id = ${cardId}`, 
            (err: MySqlCustomError | null, res: cardContent[] | null) => {
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
            result({ kind: "not_found" } as MySqlCustomError, null);
        });
    },
    remove : (cardId: number, result: ResultCallback<cardContent>) => {
        sql.query("DELETE FROM contenue_carte WHERE card_id = ?", cardId, 
            (err: MySqlCustomError | null, res: OkPacket) => {
            if (err) {
                console.error("Error: ", err);
                result(err, null);
                return;
            }
    
            if (res.affectedRows === 0) {
                // Contenu de carte non trouvé avec cet ID
                result({ kind: "not_found" } as MySqlCustomError, null);
                return;
            }
    
            console.log("Deleted content with id: ", cardId);
            result(err, null);
        });
    }
}

export default cardContent;