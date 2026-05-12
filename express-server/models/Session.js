const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  danceStep: String,     // e.g., "Aramandi Squat"
  difficulty: Number,    // 1-10
  accuracyScore: Number, // From your MediaPipe logic
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);