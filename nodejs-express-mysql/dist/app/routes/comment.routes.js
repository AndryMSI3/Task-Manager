"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
// const router = express.Router();
const express_1 = require("express");
const commentController = require("../controllers/comment.controller");
const router = (0, express_1.Router)();
/**
 * @function
 * @name createComment
 * @description Crée un nouveau commentaire.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.post("/create", commentController.createComment);
/**
 * @function
 * @name getCommentsByCardId
 * @description Récupère tous les commentaires associés à une carte spécifique.
 * @param {string} cardID - L'ID de la carte.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.get("/card/:id", commentController.findAllComments);
/**
 * @function
 * @name deleteCommentById
 * @description Supprime un commentaire en fonction de son ID.
 * @param {string} id - L'ID du commentaire.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.delete("/:id", commentController.deleteComment);
exports.default = router;
