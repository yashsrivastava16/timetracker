export interface ScheduleBlock {
  id: string;
  timeRange: string;
  title: string;
  description: string;
  bulletPoints?: string[];
  category: 'wake-review' | 'buffer' | 'job' | 'decompress' | 'walk' | 'dinner' | 'deep-work' | 'wind-down';
  startMinutes: number; // minutes from 00:00 (e.g. 8:30 is 8*60+30 = 510)
  endMinutes: number;   // minutes from 00:00 (e.g. 9:15 is 9*60+15 = 555)
  guidance: string;
  keyRule: string;
  tagColor: {
    bg: string;
    text: string;
    border: string;
    accent: string;
  };
}

export interface WeekendBlock {
  id: string;
  timeTitle: string;
  title: string;
  description: string;
  activities: string[];
  keyRule: string;
  iconName: string;
  category: 'walk' | 'deep-block' | 'review-off';
}

export interface Phase {
  id: string;
  number: number;
  title: string;
  startDate: string; // e.g. "Sept 17, 2026"
  endDate: string;   // e.g. "Oct 22, 2026"
  startISO: string;
  endISO: string;
  focusDSA: string[];
  focusDesign: string[];
  focusAI: string[];
  milestoneGoal: string;
}

export interface DailyLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  dsaTopic: string;
  aiTopic: string;
  summary: string;
  confidenceScore: 1 | 2 | 3 | 4 | 5;
  completedBlocks: string[]; // ids of completed schedule blocks
}
