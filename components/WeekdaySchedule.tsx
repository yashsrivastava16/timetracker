import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Briefcase, 
  Footprints, 
  Utensils, 
  BrainCircuit, 
  Moon, 
  BookOpen, 
  Coffee,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ScheduleItem } from '@/app/dashboard/page';

interface Props {
  schedules: ScheduleItem[];
  loading?: boolean;
  completedBlocks: string[];
  onToggleBlock: (id: string) => void;
  onLaunchDeepWork: () => void;
}

export const WeekdaySchedule: React.FC<Props> = ({
  schedules,
  loading = false,
  completedBlocks,
  onToggleBlock,
  onLaunchDeepWork,
}) => {
  const [expandedBlock, setExpandedBlock] = useState<string | null>('deep-work');

  const getBlockIcon = (id: string) => {
    switch (id) {
      case 'wake-review':
        return <BookOpen className="w-4 h-4 text-gray-600" />;
      case 'buffer-commute':
        return <Coffee className="w-4 h-4 text-gray-600" />;
      case 'job-hours':
        return <Briefcase className="w-4 h-4 text-slate-600" />;
      case 'decompress':
        return <Clock className="w-4 h-4 text-teal-600" />;
      case 'terrace-walk':
        return <Footprints className="w-4 h-4 text-gray-600" />;
      case 'dinner':
        return <Utensils className="w-4 h-4 text-orange-600" />;
      case 'deep-work':
        return <BrainCircuit className="w-4 h-4 text-gray-600" />;
      case 'wind-down':
        return <Moon className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const validCompletedCount = schedules.filter(block => completedBlocks.includes(block._id)).length;
  const progressPercent = schedules.length > 0 ? Math.round((validCompletedCount / schedules.length) * 100) : 0;

  return (
    <div id="weekday-schedule-view" className="space-y-6">
      {/* Header bar with day progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[28px] bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 text-black dark:text-white shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
              The Shape of the Day
            </span>
            <span className="text-xs text-black/50 dark:text-white/50">• Monday to Friday</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1 text-black dark:text-white">
            Weekday Precision Schedule
          </h2>
          <p className="text-xs md:text-sm text-black/70 dark:text-white/70 mt-1 max-w-2xl font-normal leading-relaxed">
            Zero friction rhythm: untangled work hours, active walking recovery, calorie deficit dinner, and a non-negotiable 2-hour switched-on study block.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-black/10 dark:bg-white/10 p-3.5 rounded-2xl border border-black/10 dark:border-white/10 shrink-0">
          <div className="text-right">
            <div className="text-xs text-black/60 dark:text-white/60 font-medium">Daily Progress</div>
            <div className="text-lg font-bold text-black dark:text-white">
              {validCompletedCount} / {schedules.length} <span className="text-xs font-normal text-black/50 dark:text-white/50">blocks</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-black/20 dark:border-white/20 flex items-center justify-center relative">
            <span className="text-xs font-bold text-black/80 dark:text-white/80">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Schedule Table / Blocks List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading your schedule...</div>
        ) : schedules.length === 0 ? (
          <div className="p-8 text-center rounded-[28px] border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl">
            <Clock className="w-10 h-10 mx-auto mb-3 text-black/50 dark:text-white/50" />
            <h3 className="text-lg font-semibold text-black dark:text-white">Your schedule is empty</h3>
            <p className="text-sm text-black/70 dark:text-white/70 mt-1">Go to the Settings tab to start adding your daily blocks.</p>
          </div>
        ) : (
          schedules.map((block) => {
            const isDone = completedBlocks.includes(block._id);
            const isExpanded = expandedBlock === block._id;

            return (
              <div
                key={block._id}
                id={`block-card-${block._id}`}
                className={`rounded-[24px] border transition-all duration-200 overflow-hidden ${
                  isDone 
                    ? 'border-transparent bg-black/5 dark:bg-white/5 backdrop-blur-md opacity-60' 
                    : 'border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-black/60 shadow-xl'
                }`}
              >
                <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left side: Time badge + Title + Icon */}
                  <div className="flex items-start md:items-center gap-3.5 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => onToggleBlock(block._id)}
                      aria-label={`Toggle completion for ${block.title}`}
                      className="mt-0.5 md:mt-0 p-1 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-black dark:text-white" />
                      ) : (
                        <Circle className="w-6 h-6 text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60" />
                      )}
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-black/10 dark:bg-white/10 border border-black/5 dark:border-white/5 text-black/80 dark:text-white/80">
                          {getBlockIcon('default')}
                        </span>
                        <span className="font-mono text-xs md:text-sm font-bold text-black dark:text-white bg-black/10 dark:bg-white/10 px-2.5 py-1 rounded-md border border-black/5 dark:border-white/5">
                          {block.timeRange}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h3 className={`text-base font-bold text-black dark:text-white truncate ${isDone ? 'line-through text-black/50 dark:text-white/50' : ''}`}>
                          {block.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Action buttons + Expand details */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => setExpandedBlock(isExpanded ? null : block._id)}
                      className="p-1.5 rounded-lg text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-black/10 dark:border-white/10 text-black/80 dark:text-white/80 text-sm">
                    <div className="mt-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-2xs">
                      <div className="text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/50 mb-1">
                        What happens
                      </div>
                      <p className="text-black dark:text-white font-medium leading-relaxed text-sm">
                        {block.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
