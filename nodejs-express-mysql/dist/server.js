"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sql = require("./app/models/db");
const db_1 = require("./app/models/db");
const multer_1 = __importDefault(require("multer"));
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
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
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: '../client/public/images' });
const corsOptions = {
    origin: "http://localhost:3000"
};
// Importation des routes API
const user_routes_1 = __importDefault(require("./app/routes/user.routes"));
const card_routes_1 = __importDefault(require("./app/routes/card.routes"));
const content_routes_1 = __importDefault(require("./app/routes/content.routes"));
const comment_routes_1 = __importDefault(require("./app/routes/comment.routes"));
const SALT_ROUNDS = 10;
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, db_1.initializeDatabase)((err) => {
    if (err) {
        console.error("❌ Erreur lors de l'initialisation de la base :", err);
        process.exit(1); // Arrêter le serveur si la BD ne peut pas être initialisée
    }
    else {
        console.log("🚀 Serveur prêt !");
    }
});
/**
 * C'est le point d'entrée qui permet de créer un nouvel utilisateur.
*/
app.post("/api/users/create", upload.single('image'), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
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
    bcrypt_1.default.genSalt(SALT_ROUNDS, (err, salt) => {
        if (err) {
            console.log("error:", err);
            res.status(500).send({ error: "Error while generating salt" });
            return;
        }
        bcrypt_1.default.hash(password, salt, (err, hashedPassword) => {
            if (err) {
                console.log("error:", err);
                res.status(500).send({ error: "Error while hashing password" });
                return;
            }
            sql.query("INSERT INTO utilisateur(user_name, user_picture, password) VALUES (?,?,?)", [userName, userPicture, hashedPassword], (err, result) => {
                if (err) {
                    console.log("error:", err);
                    res.status(500).send({ error: "Internal Server Error" });
                    return;
                }
                console.log("✅ Utilisateur crée avec succès !");
                res.send({ userName, hashedPassword });
            });
        });
    });
});
// Routes API
app.use("/users", user_routes_1.default);
app.use("/cards", card_routes_1.default);
app.use("/contents/", content_routes_1.default);
app.use("/comments/", comment_routes_1.default);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
