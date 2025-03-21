import dotenv from 'dotenv'
dotenv.config();

import express from "express";
import cors from "cors";
import sql = require("./app/models/db");
import { initializeDatabase } from './app/models/db';
import multer from "multer";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

/**
 *  Ce fichier est le point d'entrée de l'API
 *  c'est içi que le frontend communique avec le backend.
 *  
 *  Le projet est divisé en 3 parties:
 *  - Les routes définissent les chemins permettant d’accéder aux contrôleurs ainsi que
 *  la méthode utilisée pour y accéder. 
 *  - Les contrôleurs filtrent les données envoyées par la requête. Si les données 
 *  envoyées dans la requête sont valides, le contrôleur fait appel au modèle avec les 
 *  données passées dans la requête. Si les données sont invalides ou si le modèle 
 *  renvoie une erreur, le contrôleur renverra une erreur.
 *  - Les modèles se chargent de l'interaction avec la base de données. Un modèle
 *   effectue les requêtes SQL sur la base de données.
 * 
 *   Cependant, en dehors de ce schéma, il y a la fonction "createDefaultAdmin" qui 
 *   créer un utilisateur par défaut au cas où il n'y a pas d'utilisateur.
 *   Il doit être enclenché lors du démarrage du serveur.
 * 
 *   Même chose pour "restoreDB" çelà permet de créer une base de données si la base
 *   de données n'existe pas encore.
 * 
 *   Aussi, le chemin qui permet de créer les utilisateur est très compliqué à mettre
 *   en place dans le schéma présenté çi-dessus à cause de la bibliothèque multer
 *   qui permet d'uploader les images.
 */

const app = express();
const upload = multer({ dest: '../client/public/images' });

const corsOptions = {
    origin: "http://localhost:3000"
};

// Importation des routes API

import userRoutes from "./app/routes/user.routes";
import cardRoutes from "./app/routes/card.routes";
import contentRoutes from './app/routes/content.routes';
import commentRoutes from './app/routes/comment.routes';

const SALT_ROUNDS = 10;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
  

initializeDatabase((err) => {
    if (err) {
        console.error("❌ Erreur lors de l'initialisation de la base :", err);
        process.exit(1); // Arrêter le serveur si la BD ne peut pas être initialisée
    } else {
        console.log("🚀 Serveur prêt !");
    }
});

/**
 * C'est le point d'entrée qui permet de créer un nouvel utilisateur.
*/

app.post(
    "/api/users/create", 
    upload.single('image'), 
    async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("errors: ", errors);
        res.status(400).json({ errors: errors.array() });
        return;
    }

    if (!req.file) {
        res.status(400).json({ error: "Image is required" });
        return;
    }
    const userPicture = req.file.filename;
    const userName = req.body.userName;
    const password = req.body.passWord;
    const privilege = req.body.privilege;

    /**
     * bcrypt est utilisé pour pouvoir hashé les mots de passe
     */
    bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
        if (err) {
            console.log("error:", err);
            res.status(500).send({ error: "Error while generating salt" });
            return;
        }
        bcrypt.hash(password, salt, (err, hashedPassword) => {
            if (err) {
                console.log("error:", err);
                res.status(500).send({ error: "Error while hashing password" });
                return;
            }
            sql.query("INSERT INTO utilisateur(user_name, password) VALUES (?, ?)",
                [userName, hashedPassword], (err: Error | null, result: any) => {
                    if (err) {
                        console.log("error:", err); 
                        res.status(500).send({ error: "Internal Server Error" });
                        return;
                    }
                    console.log("✅ Utilisateur crée avec succès !")
                    res.send({userName, hashedPassword });
                });
        });
    });
});

// Routes API
app.use("/users", userRoutes);
app.use("/cards",cardRoutes);
app.use("/contents/",contentRoutes);
app.use("/comments/",commentRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
}); 