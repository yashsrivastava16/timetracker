import mongoose from 'mongoose';

const dailyProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: String,
    required: true
  },
  completedBlocks: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

dailyProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.DailyProgress || mongoose.model('DailyProgress', dailyProgressSchema);
