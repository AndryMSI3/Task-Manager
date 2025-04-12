
const express = require("express");
import { Router } from "express";

const cardController = require("../controllers/carte.controller");

const router = Router();


/**
 * @function
 * @name getCardMaxId
 * @description Récupère l'ID maximum parmi toutes les cartes.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */

router.get("/card/maxId", cardController.findCardMaxId);

/**
 * @function
 * @name getAllCards
 * @description Récupère toutes les cartes.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.get("/cards", cardController.allCards);

/**
 * @function
 * @name createCard
 * @description Crée une nouvelle carte.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.post("/create", cardController.createCard);

/**
 * @function
 * @name deleteCardById
 * @description Supprime une carte en fonction de son ID.
 * @param {string} id - L'ID de la carte.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.delete("/:id", cardController.delete);

/**
 * @function
 * @name getCardById
 * @description Récupère les informations d'une carte en fonction de son ID.
 * @param {string} id - L'ID de la carte.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.get("/card/:id", cardController.findCard);

router.get("/user/:id", cardController.findByUser);

export default router;
