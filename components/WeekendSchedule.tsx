import React, { useState } from 'react';
import { 
  Sun, 
  BrainCircuit, 
  CalendarCheck, 
  HeartHandshake, 
  CheckCircle2, 
  Coffee,
} from 'lucide-react';
import { WeekendBlock } from '../types';

interface Props {
  schedules: WeekendBlock[];
  loading: boolean;
}

export const WeekendSchedule: React.FC<Props> = ({ schedules, loading }) => {
  const [completedWeekendTasks, setCompletedWeekendTasks] = useState<string[]>([]);

  const toggleWeekendTask = (taskId: string) => {
    setCompletedWeekendTasks(prev => 
      prev.includes(taskId) ? prev.filter(t => t !== taskId) : [...prev, taskId]
    );
  };

  return (
    <div id="weekend-schedule-view" className="space-y-6">
      {/* Top Weekend Hero banner */}
      <div className="p-6 rounded-[28px] bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 text-black dark:text-white shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/10 dark:bg-white/20 text-black dark:text-white uppercase tracking-wider">
                Saturday & Sunday
              </span>
              <span className="text-xs text-black/70 dark:text-white/70">High-leverage deep blocks & vital recharge</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white">
              Weekend Master Schedule
            </h2>
            <p className="text-xs md:text-sm text-black/80 dark:text-white/80 mt-1 max-w-xl font-normal leading-relaxed">
              No alarms in the morning. A single intensive 3–4 hour deep simulation block, followed by strategic planning and a non-negotiable evening off.
            </p>
          </div>

          <div className="bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 p-3.5 rounded-2xl flex items-center gap-3">
            <Coffee className="w-8 h-8 text-black/50 dark:text-white/50 shrink-0" />
            <div>
              <div className="text-xs text-black/60 dark:text-white/60">Weekend Philosophy</div>
              <div className="text-xs font-semibold text-black/90 dark:text-white/90">
                Alarm-free mornings + Protected evening off
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Weekend Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="p-6 text-gray-500">Loading weekend schedules...</div>
        ) : schedules.length === 0 ? (
          <div className="p-6 text-gray-500 col-span-full">No weekend blocks configured. Add them in settings.</div>
        ) : (
          schedules.map((block: any) => (
            <div 
              key={block._id}
              className="rounded-[24px] border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md p-5 flex flex-col justify-between shadow-xl hover:bg-white/60 dark:hover:bg-black/60 transition-all text-black dark:text-white"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/10 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10">
                    <Sun className="w-3.5 h-3.5 text-black/80 dark:text-white/80" />
                    {block.timeTitle}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleWeekendTask(block._id)}
                    className="text-xs font-medium flex items-center gap-1 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {completedWeekendTasks.includes(block._id) ? (
                      <CheckCircle2 className="w-4 h-4 text-black dark:text-white" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-black/30 dark:border-white/30" />
                    )}
                    <span>Done</span>
                  </button>
                </div>

                <h3 className="text-lg font-bold text-black dark:text-white">
                  {block.title}
                </h3>
                
                <div className="mt-4 p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-xs text-black/80 dark:text-white/80 leading-relaxed border border-black/10 dark:border-white/10">
                  {block.description}
                </div>

                {block.activities && block.activities.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-semibold text-black/70 dark:text-white/70">Activities:</div>
                    <ul className="text-xs text-black/60 dark:text-white/60 space-y-1.5">
                      {block.activities.map((act: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-black/40 dark:text-white/40 font-bold">•</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-black/10 dark:border-white/10 text-xs text-black/50 dark:text-white/50 font-medium">
                Rule: <span className="text-black/80 dark:text-white/80 font-semibold">{block.keyRule}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
