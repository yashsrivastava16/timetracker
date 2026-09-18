import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  primaryTask: {
    type: String,
    required: true
  },
  secondaryTask: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  confidenceScore: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  completedBlocks: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

export default mongoose.models.DailyLog || mongoose.model('DailyLog', dailyLogSchema);
