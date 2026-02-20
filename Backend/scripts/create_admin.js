require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moodlocation';

async function run() {
  try {
    await mongoose.connect(MONGO);
    console.log('Connected to MongoDB');

    const email = 'admin@example.com';
    const password = 'adminpassword';

    let user = await User.findOne({ email });
    if (user) {
      user.role = 'admin';
      user.password = password; // will be hashed by pre-save
      await user.save();
      console.log('Updated existing user to admin:', email);
    } else {
      user = new User({
        firstName: 'Admin',
        lastName: 'User',
        email,
        password,
        gender: 'not-specified',
        role: 'admin'
      });
      await user.save();
      console.log('Created admin user:', email);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

run();
