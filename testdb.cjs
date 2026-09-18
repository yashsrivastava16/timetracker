const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Yash:Yashsri16@cluster0.w1guti2.mongodb.net/time_logs?retryWrites=true&w=majority&appName=Cluster0').then(async () => {
  const subs = await mongoose.connection.collection('subscriptions').find().toArray();
  console.log('Subscriptions count:', subs.length);
  const schedules = await mongoose.connection.collection('schedules').find().toArray();
  console.log('Schedules count:', schedules.length);
  if (schedules.length > 0) {
     console.log('Schedule 0 startMinutes:', schedules[0].startMinutes);
  }
  process.exit(0);
}).catch(console.error);
