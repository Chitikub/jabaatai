const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

// POST /api/promote
router.post("/promote", userController.promoteToAdmin);

module.exports = router;
