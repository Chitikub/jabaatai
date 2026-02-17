require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();
connectDB(); 

app.use(cors());
app.use(express.json());

// --- API สำหรับสมัครสมาชิก (Sign Up) ---
app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender } = req.body;
    
    // ตรวจสอบว่ามีข้อมูลส่งมาครบถ้วนหรือไม่ก่อนบันทึก
    if (!firstName || !lastName || !email || !password || !gender) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
    }

    const newUser = new User({ firstName, lastName, email, password, gender });
    await newUser.save();
    
    res.status(201).json({ message: 'ลงทะเบียนสำเร็จ! 🎉' });
  } catch (err) {
    console.error("Signup Error:", err); // ดูรายละเอียดใน Terminal ของ Backend

    // จัดการกรณีอีเมลซ้ำ (MongoDB Error Code 11000)
    if (err.code === 11000) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานไปแล้ว' });
    }

    // ส่งข้อความ Error จริงจากระบบกลับไปเพื่อให้หน้าบ้านแสดงผลได้ถูกต้อง
    res.status(400).json({ error: err.message });
  }
});

// --- API สำหรับเข้าสู่ระบบ (Login) ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await user.comparePassword(password)) {
      res.status(200).json({ 
        message: 'เข้าสู่ระบบสำเร็จ! 🔑', 
        user: { 
          firstName: user.firstName,
          email: user.email 
        } 
      });
    } else {
      res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));