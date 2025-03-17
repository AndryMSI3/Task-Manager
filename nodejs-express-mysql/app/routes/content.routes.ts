const express = require("express");
import { Router } from "express";


const contentController = require("../controllers/content.controller");
const router = Router();

/**
 * @function
 * @name createContent
 * @description Crée un nouveau contenu pour une carte.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.post("/create", contentController.createCardContent);

/**
 * @function
 * @name updateContentById
 * @description Met à jour le contenu d'une carte en fonction de son ID.
 * @param {string} id - L'ID du contenu.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.put("/:id", contentController.updateCardContent);

/**
 * @function
 * @name getContentByCardId
 * @description Récupère le contenu d'une carte en fonction de l'ID de la carte.
 * @param {string} id - L'ID de la carte.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.get("/card/:id", contentController.findCardContent);

/**
 * @function
 * @name deleteContentByCardId
 * @description Supprime le contenu d'une carte en fonction de l'ID de la carte.
 * @param {string} id - L'ID de la carte.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.delete("/content/:id", contentController.deleteCardContent);

export default router;
