const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  quizId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  score: { 
    type: Number, 
    required: true 
  },
  passed: { 
    type: Boolean, 
    required: true 
  },
  answers: [
    {
      questionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question', 
        required: true 
      },
      selectedOption: { 
        type: String, 
        required: true 
      }
    }
  ],
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Result', ResultSchema);
