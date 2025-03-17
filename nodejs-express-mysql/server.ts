import express from "express";
import cors from "cors";
import sql = require("./app/models/db");
import multer from "multer";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

const app = express();
const upload = multer({ dest: '../client/public/images' });

const corsOptions = {
    origin: "http://localhost:3000"
};

// Importation des routes API

import cardRoutes from "./app/routes/card.routes";
import contentRoutes from "./app/routes/content.routes";
import commentRoutes from "./app/routes/comment.routes";
import userRoutes from "./app/routes/user.routes";

const SALT_ROUNDS = 10;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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

/*     if (!req.file) {
        res.status(400).json({ error: "Image is required" });
        return;
    } */
    // const userPicture = req.file.filename;
    const userName = req.body.userName;
    const password = req.body.passWord;
    // const privilege = req.body.privilege;
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
            // sql.query("INSERT INTO utilisateur(user_name, password, privilege, user_picture) VALUES (?, ?, ?, ?)",
            sql.query("INSERT INTO utilisateur(user_name, password) VALUES (?, ?)",
                [userName, hashedPassword], (err: Error | null, result: any) => {
                    if (err) {
                        console.log("error:", err); 
                        res.status(500).send({ error: "Internal Server Error" });
                        return;
                    }
                    res.send({ userName, hashedPassword });
                });
        });
    });
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Andry's application" });
});

// Routes API
app.use("/users", userRoutes);
app.use("/cards", cardRoutes);
app.use("/contents", contentRoutes);
app.use("/comments", commentRoutes);


/** 
 * @constant 
 * @type {number} 
 * @description Le port sur lequel le serveur écoute. 
 */
const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
