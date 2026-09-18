import mongoose from 'mongoose';

const dailyTaskSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  reminderMinutes: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.DailyTask || mongoose.model('DailyTask', dailyTaskSchema);
