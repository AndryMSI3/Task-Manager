const express = require("express");
// const router = express.Router();
import { Router } from "express";

const commentController = require("../controllers/comment.controller");
const router = Router();
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


export default router;
