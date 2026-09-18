import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Adjust path if .env.local is located elsewhere
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Define Models (redefining them here for the script to run independently)
const scheduleSchema = new mongoose.Schema({
  userId: String,
  timeRange: String,
  title: String,
  description: String,
  startMinutes: Number,
  endMinutes: Number
});

const weekendScheduleSchema = new mongoose.Schema({
  userId: String,
  timeTitle: String,
  title: String,
  description: String,
  activities: [String],
  keyRule: String,
  iconName: String
});

const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);
const WeekendSchedule = mongoose.models.WeekendSchedule || mongoose.model('WeekendSchedule', weekendScheduleSchema);

const TARGET_USER_ID = "user_3JSqdASSX6LZJCNxRuL67PkTVuw";

const weekdayData = [
  {
    userId: TARGET_USER_ID,
    timeRange: "8:30 – 9:15 AM",
    title: "Wake · Light review",
    description: "No deep problem-solving — your brain isn't warmed up. 30–40 min of passive review: flip through yesterday's DSA notes, re-read one LLD/HLD concept, or watch a short system-design breakdown over breakfast.",
    startMinutes: 510,
    endMinutes: 555
  },
  {
    userId: TARGET_USER_ID,
    timeRange: "9:15 – 10:45 AM",
    title: "Buffer / commute / get ready",
    description: "Slack time before work. If you have extra runway, this is a second passive-review slot — never a heavy-lifting one.",
    startMinutes: 555,
    endMinutes: 645
  },
  {
    userId: TARGET_USER_ID,
    timeRange: "11:00 AM – 7:00 PM",
    title: "Job",
    description: "Untouched. Interview prep does not compete with work hours.",
    startMinutes: 660,
    endMinutes: 1140
  },
  {
    userId: TARGET_USER_ID,
    timeRange: "7:00 – 7:30 PM",
    title: "Decompress",
    description: "Commute / change / short walk. Don't go straight from laptop to desk again — you'll burn out by week 3.",
    startMinutes: 1140,
    endMinutes: 1170
  },
  {
    userId: TARGET_USER_ID,
    timeRange: "7:30 – 8:10 PM",
    title: "Terrace walk",
    description: "30–40 min brisk walk. Right after work, before dinner — easiest habit to keep since it needs zero setup.",
    startMinutes: 1170,
    endMinutes: 1210
  },
  {
    userId: TARGET_USER_ID,
    timeRange: "8:10 – 8:50 PM",
    title: "Dinner",
    description: "This is your main fat-loss lever now — a modest calorie deficit, protein-forward, lighter/no carbs late. Nothing heavy right before your study block.",
    startMinutes: 1210,
    endMinutes: 1250
  },
  {
    userId: TARGET_USER_ID,
    timeRange: "8:50 – 10:50 PM",
    title: "Deep work — main study block",
    description: "Your real prep happens here, when you're actually switched on. 2 hrs, split as 70 min DSA/LLD/HLD (rotating) + 40 min AI/agentic-systems interview prep + 10 min log what you covered.",
    startMinutes: 1250,
    endMinutes: 1370
  },
  {
    userId: TARGET_USER_ID,
    timeRange: "11:00 – 11:30 PM",
    title: "Wind down",
    description: "No screens with hard problems this late — light reading or nothing. Protect sleep; groggy mornings get worse if you cut this.",
    startMinutes: 1380,
    endMinutes: 1410
  }
];

const weekendData = [
  {
    userId: TARGET_USER_ID,
    timeTitle: "Morning (whenever you actually wake, no alarm pressure)",
    title: "Morning Routine",
    description: "Longer walk — 45–60 min on the terrace or outside",
    activities: ["Long walk"],
    keyRule: "No alarm pressure",
    iconName: "Sun"
  },
  {
    userId: TARGET_USER_ID,
    timeTitle: "Late morning / early afternoon",
    title: "Deep block",
    description: "3–4 hr deep block — mock interviews, timed LeetCode sets, full LLD/HLD design exercises, or a full AI-system-design case",
    activities: ["Mock interviews", "Timed LeetCode sets", "Full LLD/HLD design exercises", "AI-system-design case"],
    keyRule: "Focus on high leverage tasks",
    iconName: "BrainCircuit"
  },
  {
    userId: TARGET_USER_ID,
    timeTitle: "Evening",
    title: "Review & Planning",
    description: "Light review + planning next week's focus. One full evening off per weekend — non-negotiable.",
    activities: ["Light review", "Planning next week"],
    keyRule: "One full evening off is non-negotiable",
    iconName: "Compass"
  }
];

async function seed() {
  console.log("Connecting to MongoDB...");
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI in .env.local");
    process.exit(1);
  }

  const opts: any = {};
  if (process.env.MONGODB_DB) {
    opts.dbName = process.env.MONGODB_DB;
  }

  await mongoose.connect(uri, opts);
  console.log("Connected successfully!");

  // Optional: clear existing data for this user
  console.log(`Clearing existing schedules for user ${TARGET_USER_ID}...`);
  await Schedule.deleteMany({ userId: TARGET_USER_ID });
  await WeekendSchedule.deleteMany({ userId: TARGET_USER_ID });

  console.log("Inserting weekday data...");
  await Schedule.insertMany(weekdayData);
  
  console.log("Inserting weekend data...");
  await WeekendSchedule.insertMany(weekendData);

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(console.error);
