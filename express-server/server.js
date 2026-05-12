const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const DanceSession = require('./models/DanceSession');

// 1. Load Config
dotenv.config();
const app = express();

// 2. Middleware
app.use(cors()); // Allows React to talk to Express
app.use(express.json()); // Allows Express to read JSON data

// 3. MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MERN Stack: Connected to MongoDB Compass"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 4. Routes

// Heartbeat Route
app.get('/', (req, res) => {
  res.send("NrityaWeb Express Manager is LIVE.");
});

/**
 * THE BRIDGE ROUTE: 
 * This takes data from React, asks Python to analyze it, 
 * then saves the result to MongoDB.
 */
app.post('/api/analyze-and-save', async (req, res) => {
  try {
    console.log("🚀 Received request from React...");

    // 1. Talk to the Python AI (Flask) 
    // We pass the data we got from React straight to Python
    const pythonResponse = await axios.post('http://127.0.0.1:5000/analyze', req.body);
    
    const aiData = pythonResponse.data;
    console.log("🤖 AI Analysis complete:", aiData.score);

    // 2. Save the AI's feedback to MongoDB
    const sessionData = new DanceSession({
      score: aiData.score,
      feedback: aiData.feedback, // This is the list of corrections from MediaPipe
      date: new Date()
    });

    const savedSession = await sessionData.save();
    console.log("💾 Results saved to MongoDB!");

    // 3. Send EVERYTHING back to React
    res.status(201).json(savedSession);

  } catch (err) {
    console.error("❌ Error in Bridge Route:", err.message);
    res.status(500).json({ 
      message: "The AI Engine (Python) or Database is not responding.",
      error: err.message 
    });
  }
});

// 5. Start the Server on Port 3001 (to avoid conflict with Flask on 5000)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Express Manager running on http://localhost:${PORT}`);
  console.log(`💡 Make sure Python is running on http://127.0.0.1:5000`);
});