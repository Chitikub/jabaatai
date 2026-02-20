const jwt = require("jsonwebtoken");

// --- Middleware สำหรับตรวจสอบ Token ---
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ error: "ต้องมี token ในการขอใช้ API นี้" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
};

module.exports = { verifyToken };
