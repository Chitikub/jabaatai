const History = require("../models/History");

// --- Controller สำหรับสร้างประวัติการนำทาง ---
exports.createHistory = async (req, res) => {
  try {
    const { userId, locationId, name, type, date, time } = req.body;

    if (!userId || !locationId || !name) {
      return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
    }

    const newHistory = new History({
      userId,
      locationId,
      name,
      type: type || "forest",
      date,
      time,
    });

    await newHistory.save();
    res
      .status(201)
      .json({ message: "บันทึกประวัติเรียบร้อย", data: newHistory });
  } catch (err) {
    console.error("Save History Error:", err);
    res.status(500).json({ error: "บันทึกประวัติล้มเหลว" });
  }
};

// --- Controller สำหรับดึงประวัติการนำทาง ---
exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await History.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json(history);
  } catch (err) {
    console.error("Get History Error:", err);
    res.status(500).json({ error: "ดึงข้อมูลประวัติล้มเหลว" });
  }
};
