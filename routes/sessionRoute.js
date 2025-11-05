const express = require("express");
const router = express.Router();
const { protector } = require("../middleware.js/authMiddleware");
const {
  createSession,
  getSession,
  getSessionById,
  deleteSession,
} = require("../controllers/sessionControllers");

router.post("/create", protector, createSession);
router.get("/my-sessions", protector, getSession);
router.delete("/:id", protector, deleteSession);
router.get("/:id", protector, getSessionById);

module.exports = router;
