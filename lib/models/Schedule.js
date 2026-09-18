import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  timeRange: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startMinutes: {
    type: Number,
    required: true
  },
  endMinutes: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);
