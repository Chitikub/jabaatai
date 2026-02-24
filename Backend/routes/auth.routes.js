const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", authController.signup);

// POST /api/auth/signup-admin (ต้องใช้ Secret Key)
router.post("/signup-admin", authController.signupAdmin);

// POST /api/auth/login
router.post("/login", authController.login);

module.exports = router;
