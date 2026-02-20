const express = require("express");
const historyController = require("../controllers/history.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

// POST /api/history
router.post("/", verifyToken, historyController.createHistory);

// GET /api/history/:userId
router.get("/:userId", verifyToken, historyController.getHistory);

module.exports = router;
