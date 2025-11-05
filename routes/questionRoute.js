const express = require("express");
const {
  togglePinQuestion,
  updateQuestionNote,
  addQuestionsToSession,
} = require("../controllers/questionControllers");
const { protector } = require("../middleware.js/authMiddleware");

const router = express.Router();

router.post("/add", protector, addQuestionsToSession);
router.post("/:id/pin", protector, togglePinQuestion);
router.post("/:id/note", protector, updateQuestionNote);

module.exports = router;
