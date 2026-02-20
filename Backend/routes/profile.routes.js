const express = require("express");
const profileController = require("../controllers/profile.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

// GET /api/profile/:id
router.get("/:id", verifyToken, profileController.getProfile);

// PUT /api/profile/:id
router.put("/:id", verifyToken, profileController.updateProfile);

module.exports = router;
