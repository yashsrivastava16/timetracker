import mongoose from 'mongoose';

const phaseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  number: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  primaryFocus: {
    type: [String],
    default: []
  },
  secondaryFocus: {
    type: [String],
    default: []
  },
  otherFocus: {
    type: [String],
    default: []
  },
  milestoneGoal: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Phase || mongoose.model('Phase', phaseSchema);
