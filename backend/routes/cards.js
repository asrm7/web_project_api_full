const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardController");
const auth = require('../middleware/auth');

// GET /cards
router.get("/", auth, cardController.getAllCards);

// POST /cards
router.post("/", auth, cardController.createCard);

// DELETE /cards/:cardId
router.delete("/:cardId", auth, cardController.deleteCard);

// PUT /cards/:cardId/likes
router.put("/:cardId/likes", auth, cardController.likeCard);

// DELETE /cards/:cardId/likes
router.delete("/:cardId/likes", auth, cardController.dislikeCard);

module.exports = router;
