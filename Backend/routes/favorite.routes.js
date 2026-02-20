const express = require("express");
const favoriteController = require("../controllers/favorite.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

// GET /api/favorite/check - ตรวจสอบว่าเป็นรายการโปรด (query params: userId, locationId)
// ต้องไว้ก่อน GET /:userId เพื่อไม่ให้ conflict
router.get("/check", verifyToken, favoriteController.isFavorite);

// POST /api/favorite - เพิ่มรายการโปรด
router.post("/", verifyToken, favoriteController.addFavorite);

// GET /api/favorite/:userId - ดึงรายการโปรดทั้งหมด
router.get("/:userId", verifyToken, favoriteController.getFavorites);

// DELETE /api/favorite/:favoriteId - ลบรายการโปรด
router.delete("/:favoriteId", verifyToken, favoriteController.removeFavorite);

module.exports = router;
