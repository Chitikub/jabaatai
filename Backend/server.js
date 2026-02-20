require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const historyRoutes = require('./routes/history.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- ใช้ Routes ---
// Auth routes (signup, login)
app.use('/api', authRoutes);
// Profile routes
app.use('/api/profile', profileRoutes);
// History routes
app.use('/api/history', historyRoutes);
// User routes (promote)
app.use('/api', userRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Hello World! Server Mood Location Finder</h1>");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));