const mongoose = require('mongoose');

// This defines the structure of every "Dance Session" saved in your database
const DanceSessionSchema = new mongoose.Schema({
  moveName: { 
    type: String, 
    required: [true, 'Please provide the name of the dance step'] 
  },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  accuracy: { 
    type: Number, 
    min: 0, 
    max: 100,
    default: 0 
  },
  notes: { 
    type: String, 
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// This exports the model so server.js can use it to "Create" and "Read" data
module.exports = mongoose.model('DanceSession', DanceSessionSchema);