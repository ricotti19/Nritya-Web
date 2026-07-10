const mongoose = require('mongoose');

// This defines a persistent structure to track an ongoing dance session over time
const DanceSessionSchema = new mongoose.Schema({
  // 1. UNIQUE SESSION TRACKING
  sessionId: {
    type: String,
    required: [true, 'A unique session ID is required to persist this practice block.'],
    index: true
  },
  userId: {
    type: String, 
    default: 'guest_dancer'
  },

  // 2. CORE DANCE METRICS
  moveName: { 
    type: String, 
    required: [true, 'Please provide the name of the dance step'] 
  },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },

  // 3. PERSISTENT HISTORICAL LOGS FOR THIS SESSION
  accuracyHistory: [{ 
    type: Number, 
    min: 0, 
    max: 100
  }],
  
  feedbackLogs: [{
    type: String,
    trim: true
  }],

  notes: { 
    type: String, 
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
},

  feedback: [{
    type: String,
    trim: true
  }],

  date: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    default: null
  },
});

module.exports = mongoose.model('DanceSession', DanceSessionSchema);