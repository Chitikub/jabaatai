const User = require("../models/User");

// --- Controller สำหรับยกระดับเป็น Admin ---
exports.promoteToAdmin = async (req, res) => {
  try {
    const { requesterEmail, requesterPassword, targetUserId } = req.body;
    if (!requesterEmail || !requesterPassword || !targetUserId) {
      return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
    }

    const requester = await User.findOne({ email: requesterEmail });
    if (!requester) return res.status(401).json({ error: "ไม่พบผู้เรียก" });

    const valid = await requester.comparePassword(requesterPassword);
    if (!valid)
      return res.status(401).json({ error: "ข้อมูลรับรองไม่ถูกต้อง" });

    if (requester.role !== "admin")
      return res.status(403).json({ error: "ต้องเป็น admin เท่านั้น" });

    const target = await User.findById(targetUserId);
    if (!target) return res.status(404).json({ error: "ไม่พบผู้ใช้เป้าหมาย" });

    target.role = "admin";
    await target.save();

    res.status(200).json({
      message: "ยกระดับเป็น admin สำเร็จ",
      user: { id: target._id, email: target.email, role: target.role },
    });
  } catch (err) {
    console.error("Promote Error:", err);
    res.status(500).json({ error: "ไม่สามารถยกระดับผู้ใช้ได้" });
  }
};
