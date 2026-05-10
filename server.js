const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const DanceSession = require('./models/DanceSession'); // Imports schema

// 1. Setup Environment Variables
dotenv.config();

const app = express();

// 2. Middleware (The "Security Guard")
app.use(express.json()); // Allows the server to read JSON data sent from app

// 3. Connect to MongoDB
// This uses the string put in .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Compass"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 4. Routes 
app.get('/', (req, res) => {
  res.send("NrityaWeb Backend is officially LIVE and ready for your dance data!");
});

// POST: The door where dance scores enter the database
app.post('/api/sessions', async (req, res) => {
  try {
    const sessionData = new DanceSession(req.body);
    const savedSession = await sessionData.save();
    console.log("💾 Session Saved Successfully!");
    res.status(201).json(savedSession); 
  } catch (err) {
    console.error("❌ Error saving session:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// 5. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
