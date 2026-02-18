const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true }, 
  profileImage: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// --- แก้ไขจุดนี้: ลบพารามิเตอร์ 'next' ออกให้หมดเมื่อใช้ async ---
userSchema.pre('save', async function () {
  // หากรหัสผ่านไม่มีการเปลี่ยนแปลง ให้หยุดการทำงานของฟังก์ชันนี้ทันที
  if (!this.isModified('password')) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // ไม่ต้องเรียก next() เพราะ Mongoose จะจัดการให้เองเมื่อจบ async function
  } catch (err) {
    // โยน error ออกไปเพื่อให้ catch block ใน server.js รับทราบ
    throw err;
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);