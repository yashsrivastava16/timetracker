import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, ShieldAlert, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { ScheduleItem } from '@/app/dashboard/page';

interface Props {
  schedules: ScheduleItem[];
  isWeekend: boolean;
  onNavigateToDeepWork?: () => void;
  completedBlocks: string[];
  onToggleBlock: (id: string) => void;
}

export const CurrentBlockBanner: React.FC<Props> = ({
  schedules,
  isWeekend,
  onNavigateToDeepWork,
  completedBlocks,
  onToggleBlock,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Format minutes into 12-hour format
  const formatTimeMinutes = (totalMin: number) => {
    const hours24 = Math.floor(totalMin / 60) % 24;
    const mins = totalMin % 60;
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    return `${hours12}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  // Find active weekday block
  let activeBlock: ScheduleItem | null = null;
  let nextBlock: ScheduleItem | null = null;
  let timeRemainingText = '';

  for (let i = 0; i < schedules.length; i++) {
    const b = schedules[i];
    if (activeMinutes >= b.startMinutes && activeMinutes < b.endMinutes) {
      activeBlock = b;
      nextBlock = schedules[i + 1] || null;
      const remainingMin = b.endMinutes - activeMinutes;
      const remHours = Math.floor(remainingMin / 60);
      const remMins = remainingMin % 60;
      timeRemainingText = remHours > 0 ? `${remHours}h ${remMins}m left` : `${remMins}m left`;
      break;
    }
  }

  // If before first block or after last block
  if (!activeBlock && schedules.length > 0) {
    if (activeMinutes < schedules[0].startMinutes) {
      nextBlock = schedules[0];
      const diff = schedules[0].startMinutes - activeMinutes;
      timeRemainingText = `Starts in ${Math.floor(diff / 60)}h ${diff % 60}m`;
    } else {
      // Overnight / sleep block
      const sleepRemaining = 24 * 60 - activeMinutes + schedules[0].startMinutes;
      timeRemainingText = `Rest period · ${Math.floor(sleepRemaining / 60)}h ${sleepRemaining % 60}m until wake`;
    }
  }

  if (!isMounted) {
    return <div className="rounded-[28px] border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-5 md:p-6 shadow-2xl mb-8 animate-pulse h-32"></div>;
  }

  const isCompleted = activeBlock ? completedBlocks.includes(activeBlock._id) : false;

  return (
    <section 
      id="current-status-banner"
      className="relative overflow-hidden rounded-[32px] border border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/60 backdrop-blur-3xl p-6 md:p-8 shadow-2xl mb-8 transition-all text-black dark:text-white group"
    >
      {/* Decorative Gradient Orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-black/10 dark:bg-white/10 text-black dark:text-white shadow-xs">
            <Clock className="w-5 h-5 text-black/80 dark:text-white/80 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
                {isWeekend ? 'Weekend Mode' : 'Weekday Routine'}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80 border border-black/10 dark:border-white/10">
                Live Status
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {formatTimeMinutes(activeMinutes)}
              <span className="text-sm font-medium text-black/50 dark:text-white/50 ml-2">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Active block display */}
      <div className="relative z-10 mt-6">
        {activeBlock ? (
          <div className="p-5 md:p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-white/70 dark:hover:bg-black/60">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-black bg-blue-500 text-white tracking-widest shadow-sm">
                    CURRENT BLOCK
                  </span>
                  <span className="text-xs font-mono font-bold text-black/70 dark:text-white/70 bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded border border-black/10 dark:border-white/10">
                    {activeBlock.timeRange}
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 ml-1">
                    {timeRemainingText}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-black dark:text-white">
                  {activeBlock.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  id={`mark-complete-${activeBlock._id}`}
                  onClick={() => onToggleBlock(activeBlock!._id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold border flex items-center gap-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500/20 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30'
                      : 'bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-white/10 text-black dark:text-white border-black/10 dark:border-white/10 shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isCompleted ? 'Marked Completed' : 'Complete Block'}
                </button>

                {onNavigateToDeepWork && activeBlock.title.toLowerCase().includes('deep work') && (
                  <button
                    type="button"
                    id="open-deep-work-timer-btn"
                    onClick={onNavigateToDeepWork}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-gray-200 shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4" />
                    Focus Timer
                  </button>
                )}
              </div>
            </div>

            <p className="mt-4 text-sm text-black/70 dark:text-white/70 leading-relaxed font-medium max-w-3xl">
              {activeBlock.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-black/5 dark:border-white/10">

              {nextBlock && (
                <div className="ml-auto flex items-center gap-2 text-xs text-black/60 dark:text-white/60 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                  <span className="font-medium">Next up:</span>
                  <span className="font-bold text-black dark:text-white">{nextBlock.title}</span>
                  <span className="font-mono font-medium text-black/60 dark:text-white/60 bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">
                    {nextBlock.timeRange}
                  </span>
                  <ArrowRight className="w-3 h-3 ml-1 text-black/40 dark:text-white/40" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-black/10 dark:bg-white/20 text-black dark:text-white">
                SLEEP & RECHARGE
              </span>
              <h3 className="text-base md:text-lg font-bold text-black dark:text-white mt-1">
                Rest & Recovery Window
              </h3>
              <p className="text-xs md:text-sm text-black/60 dark:text-white/60 mt-0.5">
                Sleep debt damages mental retrieval. Protect your continuous 7–8 hours before the 8:30 AM wake block.
              </p>
            </div>
            {nextBlock && (
              <div className="flex items-center gap-2 text-xs bg-black/5 dark:bg-black/40 px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 shrink-0 text-black dark:text-white">
                <span className="text-black/60 dark:text-white/60">First block:</span>
                <span className="font-bold text-black dark:text-white">{nextBlock.title}</span>
                <span className="text-black/40 dark:text-white/40">({nextBlock.timeRange})</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
