const User = require("../models/User");

// --- Controller สำหรับดึงข้อมูลโปรไฟล์ ---
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "ไม่พบผู้ใช้ในระบบ" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลได้" });
  }
};

// --- Controller สำหรับอัปเดตโปรไฟล์ ---
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, gender, profileImage } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, gender, profileImage },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "ไม่พบผู้ใช้" });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "อัปเดตข้อมูลล้มเหลว" });
  }
};
