const User = require("../models/User");

// --- Controller สำหรับ Signup ---
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, role } = req.body;

    if (!firstName || !lastName || !email || !password || !gender) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "อีเมลนี้ถูกใช้งานไปแล้วในระบบ" });
    }

    // ตั้งค่า role - ถ้าส่งมาจาก request ให้ใช้ค่านั้น ไม่งั้นใช้ 'user' เป็น default
    // (สำหรับ testing ใน Postman ได้)
    const userRole = (role === 'admin' || role === 'user') ? role : 'user';

    // สร้าง User ใหม่
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      gender,
      role: userRole,
    });
    await newUser.save();

    // สร้าง Token สำหรับ User ใหม่
    const token = newUser.generateToken();

    res.status(201).json({
      message: "ลงทะเบียนสำเร็จ! 🎉",
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup Error Details:", err);
    res
      .status(400)
      .json({
        error: err.message || "เกิดข้อผิดพลาดในการลงทะเบียน",
      });
  }
};

// --- Controller สำหรับ Login ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // หา User จาก Email
    const user = await User.findOne({ email });

    // ตรวจสอบรหัสผ่าน
    if (user && (await user.comparePassword(password))) {
      console.log(`🚀 Login Success: ${email}`);

      // สร้าง Token สำหรับ User
      const token = user.generateToken();

      res.status(200).json({
        message: "เข้าสู่ระบบสำเร็จ! 🔑",
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          gender: user.gender,
          profileImage: user.profileImage || "",
          role: user.role,
        },
      });
    } else {
      // กรณี Email ไม่พบ หรือ Password ไม่ตรง
      res.status(401).json({
        error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
    }
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};
