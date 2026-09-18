import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  subscription: {
    endpoint: { type: String, required: true },
    expirationTime: { type: Date, default: null },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true }
    }
  }
}, {
  timestamps: true
});

export default mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
