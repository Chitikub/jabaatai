const Favorite = require("../models/Favorite");

// --- Controller สำหรับเพิ่มรายการโปรด ---
exports.addFavorite = async (req, res) => {
  try {
    const { userId, locationId, name, type, description, image } = req.body;

    if (!userId || !locationId || !name || !type) {
      return res
        .status(400)
        .json({ error: "ข้อมูลไม่ครบถ้วน (userId, locationId, name, type ต้องมี)" });
    }

    // ตรวจสอบว่า favorite นี้มีในระบบแล้ว
    const existingFavorite = await Favorite.findOne({ userId, locationId });
    if (existingFavorite) {
      return res
        .status(400)
        .json({ error: "สถานที่นี้อยู่ในรายการโปรดแล้ว" });
    }

    const newFavorite = new Favorite({
      userId,
      locationId,
      name,
      type,
      description: description || "",
      image: image || "",
    });

    await newFavorite.save();
    res.status(201).json({
      message: "เพิ่มลงรายการโปรดสำเร็จ",
      data: newFavorite,
    });
  } catch (err) {
    console.error("Add Favorite Error:", err);
    res.status(500).json({ error: "เพิ่มรายการโปรดล้มเหลว" });
  }
};

// --- Controller สำหรับดึงรายการโปรดทั้งหมด ---
exports.getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(favorites);
  } catch (err) {
    console.error("Get Favorites Error:", err);
    res.status(500).json({ error: "ดึงข้อมูลรายการโปรดล้มเหลว" });
  }
};

// --- Controller สำหรับลบรายการโปรด ---
exports.removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;

    const deletedFavorite = await Favorite.findByIdAndDelete(favoriteId);
    if (!deletedFavorite) {
      return res.status(404).json({ error: "ไม่พบรายการโปรดที่ต้องการลบ" });
    }

    res.status(200).json({
      message: "ลบรายการโปรดสำเร็จ",
      data: deletedFavorite,
    });
  } catch (err) {
    console.error("Remove Favorite Error:", err);
    res.status(500).json({ error: "ลบรายการโปรดล้มเหลว" });
  }
};

// --- Controller สำหรับตรวจสอบว่าสถานที่เป็นรายการโปรดหรือไม่ ---
exports.isFavorite = async (req, res) => {
  try {
    const { userId, locationId } = req.query;

    if (!userId || !locationId) {
      return res
        .status(400)
        .json({ error: "ต้องมี userId และ locationId" });
    }

    const favorite = await Favorite.findOne({ userId, locationId });
    res.status(200).json({ isFavorite: !!favorite });
  } catch (err) {
    console.error("Check Favorite Error:", err);
    res.status(500).json({ error: "ตรวจสอบรายการโปรดล้มเหลว" });
  }
};
