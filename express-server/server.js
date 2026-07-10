const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer'); // Handles multipart/form-data image streams
const FormData = require('form-data');
const DanceSession = require('./models/DanceSession');

// 1. Load Configurations
dotenv.config({ path: '../.env' });
const app = express();

// Configure basic memory storage for incoming image file buffers before forwarding to Flask
// Transient RAM --- file goes through Node and is proxied to Flask
const upload = multer({ storage: multer.memoryStorage() });

// 2. Global Middleware
app.use(cors());         // Allows React frontend to bypass CORS blocks
app.use(express.json()); // Allows Express to read incoming JSON payloads

// 3. MongoDB Connection via Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/nrityaweb')
  .then(() => console.log("MERN Stack: Connected to MongoDB Cluster"))
  .catch(err => console.error("MongoDB connection error:", err));

// 4. API Endpoints

// Status Route
app.get('/', (req, res) => {
  res.send(" NrityaWeb Express Master Gatekeeper is officially LIVE.");
});

/**
 * 1. CORE PIPELINE: POST /analyze
 * Forward image to Flask AI Pipeline with extended processing timeouts
 */
app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No posture file uploaded." });
    }

    // Build the multipart payload stream manually to feed into Flask
    const form = new FormData();
    form.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    
    // Explicitly forward expected target metric parameters to match Flask request parameters
    form.append('target_left_arm', req.body.target_left_arm || '90');
    form.append('target_right_arm', req.body.target_right_arm || '90');
    form.append('target_posture', req.body.target_posture || '145');
    form.append('allowed_variance', req.body.allowed_variance || '20');

    // Proxy request to Flask Microservice with explicit 10 second timeout for heavy AI processing
    const flaskResponse = await axios.post('http://127.0.0.1:5000/analyze', form, {
      headers: { ...form.getHeaders() },
      timeout: 10000 
    });

    console.log("Flask AI Pipeline Analysis Complete. Extraction Score:", flaskResponse.data.score);
    res.status(200).json(flaskResponse.data);

  } catch (err) {
    console.error("Critical breakdown in AI Bridge Pipeline:", err.message);
    res.status(500).json({ 
      message: "The Flask AI Engine failed to respond downstream.",
      feedback: ["The AI Guru is resting. Check your Flask server configuration!"],
      score: 0,
      status: "Rejected"
    });
  }
});

// RESTful practices

/**
 * 2. COMMIT STATE: POST /api/sessions/save
 */
app.post('/api/sessions/save', async (req, res) => {
  try {
    const { sessionId, moveName, difficulty, score, feedback, imageUrl } = req.body;
    console.log(`Committing session data to MongoDB for Session: ${sessionId}...`);

    // Sanitize the 'score' variable to safely handle numeric outputs vs Flask's "N/A" validation strings
    let sanitizedScore = 0;
    if (score !== null && score !== undefined && score !== "N/A") {
      sanitizedScore = Number(score);
    }

    const sessionDoc = new DanceSession({
      sessionId,
      moveName: moveName || 'Aramandi',
      difficulty: difficulty || 'Intermediate',

      score: sanitizedScore,
      feedback: Array.isArray(feedback) ? feedback : [feedback],

      accuracyHistory: [sanitizedScore],
      feedbackLogs: Array.isArray(feedback) ? feedback : [feedback],

      imageUrl,

      createdAt: new Date(),
      date: new Date()
    });

    const savedDoc = await sessionDoc.save();
    res.status(201).json(savedDoc);
  } 
  catch (err) {
    console.error("Error running explicit database log commit:", err.message);
    res.status(500).json({ message: "Failed to persist practice data records.", error: err.message });
  }
});

/**
 * 3. PERSISTENT TIMELINE TIMESTAMPS: GET /api/sessions
 */
app.get('/api/sessions', async (req, res) => {
  try {
    const historicalLogs = await DanceSession.find().sort({ date: -1 });
    res.status(200).json(historicalLogs);
  } catch (err) {
    console.error("Failed to query database collection history logs:", err.message);
    res.status(500).json({ message: "Could not fetch history tracking collection." });
  }
});

/**
 * 4. PURGE SYSTEM DATABASE: DELETE /api/sessions/clear
 */
app.delete('/api/sessions/clear', async (req, res) => {
  try {
    await DanceSession.deleteMany({});
    console.log("🧹 Practice history logs dropped cleanly from MongoDB collection.");
    res.status(200).json({ success: true, message: "History logs cleared successfully" });
  } catch (err) {
    console.error("Error purging database space logs:", err.message);
    res.status(500).json({ message: "Could not purge document collection logs." });
  }
});

// delete one

app.delete('/api/sessions/:id', async (req, res) => {
  try {
    await DanceSession.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. App Runtime Initialization
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Gateway routing engine processing on http://localhost:${PORT}`);
  console.log(`Network Configuration: React must communicate directly with port ${PORT}`);
});