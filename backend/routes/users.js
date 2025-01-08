const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require('../middleware/auth');

// Rotas públicas (sem autenticação)
router.post('/signin', userController.login);
router.post('/signup', userController.createUser);
// Middleware global de autenticação (aplica para todas as rotas abaixo)
router.use(auth);

router.get("/", userController.getAllUsers);
router.get("/me", userController.getUserById);
router.patch("/me", userController.updateUserProfile);
router.patch("/me/avatar", userController.updateUserAvatar);

module.exports = router;
