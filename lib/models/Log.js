import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: false
  },
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['started', 'ignored', 'completed'],
    required: true
  },
  eventTime: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Log || mongoose.model('Log', logSchema);
