require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();
connectDB(); 

app.use(cors());

// --- แก้ไข: เพิ่ม limit เพื่อให้รองรับไฟล์ภาพ Base64 จากหน้า Profile ---
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- API สำหรับสมัครสมาชิก (Sign Up) ---
app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender } = req.body;
    if (!firstName || !lastName || !email || !password || !gender) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
    }
    const newUser = new User({ firstName, lastName, email, password, gender });
    await newUser.save();
    res.status(201).json({ message: 'ลงทะเบียนสำเร็จ! 🎉' });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานไปแล้ว' });
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
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          gender: user.gender,
          profileImage: user.profileImage || ''
        } 
      });
    } else {
      res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
});

// --- API สำหรับดึงข้อมูลโปรไฟล์ ---
app.get('/api/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); 
    if (!user) return res.status(404).json({ error: 'ไม่พบผู้ใช้ในระบบ' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลได้' });
  }
});

// --- API สำหรับอัปเดตโปรไฟล์ (รองรับการอัปโหลดรูปภาพ) ---
app.put('/api/profile/:id', async (req, res) => {
  try {
    const { firstName, lastName, gender, profileImage } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, gender, profileImage },
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'อัปเดตข้อมูลล้มเหลว' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));