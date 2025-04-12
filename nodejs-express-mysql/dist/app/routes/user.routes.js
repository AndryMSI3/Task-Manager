"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController = require("../controllers/user.controller");
const express = require("express");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/findUser/:id", userController.findUser);
/**
 * @function
 * @name loginUser
 * @description Connecte un utilisateur.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.post("/login", userController.login);
/**
 * @function
 * @name getAllPrivilegeUsers
 * @description Récupère tous les utilisateurs ayant un privilège spécifique.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.get("/privilege", userController.findAllPrivilege);
/**
 * @function
 * @name getUserById
 * @description Récupère un utilisateur par son ID.
 * @param {string} id - L'ID de l'utilisateur.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.get("/:id", userController.findOne);
/**
 * @function
 * @name updateUserById
 * @description Met à jour un utilisateur par son ID.
 * @param {string} id - L'ID de l'utilisateur.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.put("/:id", userController.update);
/**
 * @function
 * @name deleteUserById
 * @description Supprime un utilisateur par son ID.
 * @param {string} id - L'ID de l'utilisateur.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.delete("/:id", userController.delete);
/**
 * @function
 * @name getAllUsers
 * @description Récupère tous les utilisateurs.
 * @param {object} req - L'objet requête.
 * @param {object} res - L'objet réponse.
 */
router.get("/", userController.findAll);
router.post("/associate", userController.associate);
exports.default = router;
