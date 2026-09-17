import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, ShieldAlert, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { ScheduleBlock } from '../types';
import { WEEKDAY_BLOCKS } from '../data/scheduleData';

interface Props {
  isWeekend: boolean;
  onNavigateToDeepWork?: () => void;
  completedBlocks: string[];
  onToggleBlock: (id: string) => void;
}

export const CurrentBlockBanner: React.FC<Props> = ({
  isWeekend,
  onNavigateToDeepWork,
  completedBlocks,
  onToggleBlock,
}) => {
  // Real or simulated time
  const [useSimulatedTime, setUseSimulatedTime] = useState<boolean>(false);
  const [simulatedMinutes, setSimulatedMinutes] = useState<number>(20 * 60 + 55); // Default to 8:55 PM (Deep work)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const realMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const activeMinutes = useSimulatedTime ? simulatedMinutes : realMinutes;

  // Format minutes into 12-hour format
  const formatTimeMinutes = (totalMin: number) => {
    const hours24 = Math.floor(totalMin / 60) % 24;
    const mins = totalMin % 60;
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    return `${hours12}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  // Find active weekday block
  let activeBlock: ScheduleBlock | null = null;
  let nextBlock: ScheduleBlock | null = null;
  let timeRemainingText = '';

  for (let i = 0; i < WEEKDAY_BLOCKS.length; i++) {
    const b = WEEKDAY_BLOCKS[i];
    if (activeMinutes >= b.startMinutes && activeMinutes < b.endMinutes) {
      activeBlock = b;
      nextBlock = WEEKDAY_BLOCKS[i + 1] || null;
      const remainingMin = b.endMinutes - activeMinutes;
      const remHours = Math.floor(remainingMin / 60);
      const remMins = remainingMin % 60;
      timeRemainingText = remHours > 0 ? `${remHours}h ${remMins}m left` : `${remMins}m left`;
      break;
    }
  }

  // If before first block or after last block
  if (!activeBlock) {
    if (activeMinutes < WEEKDAY_BLOCKS[0].startMinutes) {
      nextBlock = WEEKDAY_BLOCKS[0];
      const diff = WEEKDAY_BLOCKS[0].startMinutes - activeMinutes;
      timeRemainingText = `Starts in ${Math.floor(diff / 60)}h ${diff % 60}m`;
    } else {
      // Overnight / sleep block
      const sleepRemaining = 24 * 60 - activeMinutes + WEEKDAY_BLOCKS[0].startMinutes;
      timeRemainingText = `Rest period · ${Math.floor(sleepRemaining / 60)}h ${sleepRemaining % 60}m until wake`;
    }
  }

  const isCompleted = activeBlock ? completedBlocks.includes(activeBlock.id) : false;

  return (
    <section 
      id="current-status-banner"
      className="rounded-2xl border border-stone-200 bg-white p-5 md:p-6 shadow-sm mb-8 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-stone-900 text-white shadow-xs">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {isWeekend ? 'Weekend Mode' : 'Weekday Routine'}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Clock
              </span>
            </div>
            <p className="text-lg md:text-xl font-bold text-stone-900 tracking-tight">
              {formatTimeMinutes(activeMinutes)}
              {!useSimulatedTime && (
                <span className="text-xs font-normal text-stone-400 ml-2">
                  ({currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Time Simulator Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            id="toggle-simulate-time"
            onClick={() => setUseSimulatedTime(!useSimulatedTime)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
              useSimulatedTime
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {useSimulatedTime ? 'Testing Custom Time' : 'Test Time Scrubber'}
          </button>
        </div>
      </div>

      {useSimulatedTime && (
        <div className="mt-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs flex flex-col md:flex-row items-center gap-3">
          <span className="font-semibold text-amber-900 shrink-0">Simulate time of day:</span>
          <input
            type="range"
            min="0"
            max="1439"
            step="15"
            value={simulatedMinutes}
            onChange={(e) => setSimulatedMinutes(parseInt(e.target.value, 10))}
            className="w-full accent-amber-600 cursor-pointer"
          />
          <div className="flex gap-1.5 shrink-0">
            {[
              { label: '8:45 AM Review', val: 8 * 60 + 45 },
              { label: '1:00 PM Job', val: 13 * 60 },
              { label: '7:40 PM Walk', val: 19 * 60 + 40 },
              { label: '8:25 PM Dinner', val: 20 * 60 + 25 },
              { label: '9:00 PM Deep Work', val: 21 * 60 },
              { label: '11:10 PM Wind Down', val: 23 * 60 + 10 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setSimulatedMinutes(preset.val)}
                className="px-2 py-0.5 rounded bg-white hover:bg-amber-100 text-stone-700 border border-stone-200 text-[11px]"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active block display */}
      <div className="mt-4">
        {activeBlock ? (
          <div className="p-4 md:p-5 rounded-xl border border-stone-200/80 bg-stone-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-stone-900 text-white tracking-wide">
                    NOW
                  </span>
                  <span className="text-xs font-mono font-medium text-stone-500">
                    {activeBlock.timeRange}
                  </span>
                  <span className="text-xs font-semibold text-stone-700 ml-1">
                    • {timeRemainingText}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-stone-900">
                  {activeBlock.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id={`mark-complete-${activeBlock.id}`}
                  onClick={() => onToggleBlock(activeBlock.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isCompleted ? 'Marked Completed' : 'Mark Block Complete'}
                </button>

                {activeBlock.id === 'deep-work' && onNavigateToDeepWork && (
                  <button
                    type="button"
                    id="open-deep-work-timer-btn"
                    onClick={onNavigateToDeepWork}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Open Focus Timer
                  </button>
                )}
              </div>
            </div>

            <p className="mt-2 text-sm text-stone-700 leading-relaxed font-normal">
              {activeBlock.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-stone-200/60">
              <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/70 font-medium">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Rule: {activeBlock.keyRule}</span>
              </div>

              {nextBlock && (
                <div className="ml-auto flex items-center gap-1 text-xs text-stone-500">
                  <span>Next up:</span>
                  <span className="font-semibold text-stone-800">{nextBlock.title}</span>
                  <span className="font-mono">({nextBlock.timeRange})</span>
                  <ArrowRight className="w-3 h-3 text-stone-400" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-stone-700 text-white">
                SLEEP & RECHARGE
              </span>
              <h3 className="text-base md:text-lg font-bold text-stone-900 mt-1">
                Rest & Recovery Window
              </h3>
              <p className="text-xs md:text-sm text-stone-600 mt-0.5">
                Sleep debt damages mental retrieval. Protect your continuous 7–8 hours before the 8:30 AM wake block.
              </p>
            </div>
            {nextBlock && (
              <div className="flex items-center gap-2 text-xs bg-white px-3 py-2 rounded-lg border border-stone-200 shrink-0">
                <span className="text-stone-500">First block:</span>
                <span className="font-bold text-stone-900">{nextBlock.title}</span>
                <span className="text-stone-400">({nextBlock.timeRange})</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
