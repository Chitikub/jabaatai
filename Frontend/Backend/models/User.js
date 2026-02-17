const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true }, // รองรับสไลด์เพศชาย/หญิงที่คุณทำไว้
  createdAt: { type: Date, default: Date.now }
});

// --- ส่วนที่ควรเพิ่ม: เข้ารหัสผ่านก่อนบันทึก ---
userSchema.pre('save', async function () {
  // ถ้าไม่มีการแก้ไขรหัสผ่าน (เช่น อัปเดตชื่ออย่างเดียว) ให้ข้ามไป
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10); // สร้าง Salt 10 รอบ
    this.password = await bcrypt.hash(this.password, salt); // เข้ารหัสผ่าน
  
  } catch (err) {
  throw err;
  }
});

// ฟังก์ชันสำหรับเช็ครหัสผ่านตอน Login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);