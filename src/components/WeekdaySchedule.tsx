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
import { WEEKDAY_BLOCKS } from '../data/scheduleData';
import { ScheduleBlock } from '../types';

interface Props {
  completedBlocks: string[];
  onToggleBlock: (id: string) => void;
  onLaunchDeepWork: () => void;
}

export const WeekdaySchedule: React.FC<Props> = ({
  completedBlocks,
  onToggleBlock,
  onLaunchDeepWork,
}) => {
  const [expandedBlock, setExpandedBlock] = useState<string | null>('deep-work');

  const getBlockIcon = (id: string) => {
    switch (id) {
      case 'wake-review':
        return <BookOpen className="w-4 h-4 text-amber-600" />;
      case 'buffer-commute':
        return <Coffee className="w-4 h-4 text-stone-600" />;
      case 'job-hours':
        return <Briefcase className="w-4 h-4 text-slate-600" />;
      case 'decompress':
        return <Clock className="w-4 h-4 text-teal-600" />;
      case 'terrace-walk':
        return <Footprints className="w-4 h-4 text-emerald-600" />;
      case 'dinner':
        return <Utensils className="w-4 h-4 text-orange-600" />;
      case 'deep-work':
        return <BrainCircuit className="w-4 h-4 text-indigo-600" />;
      case 'wind-down':
        return <Moon className="w-4 h-4 text-violet-600" />;
      default:
        return <Clock className="w-4 h-4 text-stone-600" />;
    }
  };

  const completedCount = completedBlocks.length;
  const progressPercent = Math.round((completedCount / WEEKDAY_BLOCKS.length) * 100);

  return (
    <div id="weekday-schedule-view" className="space-y-6">
      {/* Header bar with day progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-stone-900 text-white shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              The Shape of the Day
            </span>
            <span className="text-xs text-stone-400">• Monday to Friday</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1 text-white">
            Weekday Precision Schedule
          </h2>
          <p className="text-xs md:text-sm text-stone-300 mt-1 max-w-2xl font-normal leading-relaxed">
            Zero friction rhythm: untangled work hours, active walking recovery, calorie deficit dinner, and a non-negotiable 2-hour switched-on study block.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/60 shrink-0">
          <div className="text-right">
            <div className="text-xs text-stone-400 font-medium">Daily Progress</div>
            <div className="text-lg font-bold text-white">
              {completedCount} / {WEEKDAY_BLOCKS.length} <span className="text-xs font-normal text-stone-400">blocks</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-stone-700 flex items-center justify-center relative">
            <span className="text-xs font-bold text-amber-400">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Schedule Table / Blocks List */}
      <div className="space-y-3">
        {WEEKDAY_BLOCKS.map((block, idx) => {
          const isDone = completedBlocks.includes(block.id);
          const isExpanded = expandedBlock === block.id;

          return (
            <div
              key={block.id}
              id={`block-card-${block.id}`}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isDone 
                  ? 'border-emerald-200/80 bg-emerald-50/20' 
                  : 'border-stone-200 bg-white hover:border-stone-300 shadow-2xs'
              }`}
            >
              <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left side: Time badge + Title + Icon */}
                <div className="flex items-start md:items-center gap-3.5 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => onToggleBlock(block.id)}
                    aria-label={`Toggle completion for ${block.title}`}
                    className="mt-0.5 md:mt-0 p-1 text-stone-400 hover:text-stone-700 transition-colors focus:outline-none shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-6 h-6 text-stone-300 hover:text-stone-400" />
                    )}
                  </button>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-stone-100 border border-stone-200/70">
                        {getBlockIcon(block.id)}
                      </span>
                      <span className="font-mono text-xs md:text-sm font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                        {block.timeRange}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h3 className={`text-base font-bold text-stone-900 truncate ${isDone ? 'line-through text-stone-500' : ''}`}>
                        {block.title}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-1">
                        {block.keyRule}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side: Action buttons + Expand details */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {block.id === 'deep-work' && (
                    <button
                      type="button"
                      id="launch-study-focus-btn"
                      onClick={onLaunchDeepWork}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Launch Focus Timer (2h)
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setExpandedBlock(isExpanded ? null : block.id)}
                    aria-expanded={isExpanded}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-stone-100 bg-stone-50/40 text-stone-700 text-sm">
                  <div className="mt-3 p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
                    <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      What happens
                    </div>
                    <p className="text-stone-800 font-medium leading-relaxed text-sm">
                      {block.description}
                    </p>
                  </div>

                  {block.bulletPoints && (
                    <div className="mt-3 space-y-1.5">
                      <div className="text-xs font-semibold text-stone-600">Action Items:</div>
                      <ul className="space-y-1 text-xs text-stone-600">
                        {block.bulletPoints.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold">Guardrail rule: </strong>
                      {block.guidance}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
