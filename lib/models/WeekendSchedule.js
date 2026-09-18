import mongoose from 'mongoose';

const weekendScheduleSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  timeTitle: {
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
  activities: {
    type: [String],
    default: []
  },
  keyRule: {
    type: String,
    required: true
  },
  iconName: {
    type: String,
    default: 'Sun'
  }
}, {
  timestamps: true
});

export default mongoose.models.WeekendSchedule || mongoose.model('WeekendSchedule', weekendScheduleSchema);
