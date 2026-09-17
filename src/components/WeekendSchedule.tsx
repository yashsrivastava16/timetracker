import React, { useState } from 'react';
import { 
  Sun, 
  BrainCircuit, 
  CalendarCheck, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Flame,
  Coffee,
  Smile
} from 'lucide-react';
import { WEEKEND_BLOCKS } from '../data/scheduleData';

export const WeekendSchedule: React.FC = () => {
  const [weekendDeepSelection, setWeekendDeepSelection] = useState<string>('timed-leetcode');
  const [eveningOffPledged, setEveningOffPledged] = useState<boolean>(true);
  const [completedWeekendTasks, setCompletedWeekendTasks] = useState<string[]>([]);

  const toggleWeekendTask = (taskId: string) => {
    setCompletedWeekendTasks(prev => 
      prev.includes(taskId) ? prev.filter(t => t !== taskId) : [...prev, taskId]
    );
  };

  return (
    <div id="weekend-schedule-view" className="space-y-6">
      {/* Top Weekend Hero banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-stone-950 uppercase tracking-wider">
                Saturday & Sunday
              </span>
              <span className="text-xs text-stone-300">High-leverage deep blocks & vital recharge</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Weekend Master Schedule
            </h2>
            <p className="text-xs md:text-sm text-stone-300 mt-1 max-w-xl font-normal leading-relaxed">
              No alarms in the morning. A single intensive 3–4 hour deep simulation block, followed by strategic planning and a non-negotiable evening off.
            </p>
          </div>

          <div className="bg-stone-800/90 border border-stone-700/80 p-3.5 rounded-xl flex items-center gap-3">
            <Coffee className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs text-stone-400">Weekend Philosophy</div>
              <div className="text-xs font-semibold text-stone-200">
                Alarm-free mornings + Protected evening off
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Main Weekend Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Block 1: Morning */}
        <div 
          id="weekend-card-morning"
          className="rounded-2xl border border-stone-200 bg-white p-5 flex flex-col justify-between shadow-2xs hover:border-stone-300 transition-all"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                Morning
              </span>
              <button
                type="button"
                onClick={() => toggleWeekendTask('morning-walk')}
                className="text-xs font-medium flex items-center gap-1 text-stone-500 hover:text-emerald-700 transition-colors"
              >
                {completedWeekendTasks.includes('morning-walk') ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-stone-300" />
                )}
                <span>Done</span>
              </button>
            </div>

            <h3 className="text-lg font-bold text-stone-900">
              Longer walk — 45–60 min
            </h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Whenever you actually wake, no alarm pressure
            </p>

            <div className="mt-4 p-3 rounded-xl bg-stone-50 text-xs text-stone-700 leading-relaxed border border-stone-100">
              {WEEKEND_BLOCKS[0].description}
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold text-stone-700">Recommended Routine:</div>
              <ul className="text-xs text-stone-600 space-y-1.5">
                {WEEKEND_BLOCKS[0].activities.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 text-xs text-stone-500 font-medium">
            Rule: <span className="text-stone-800 font-semibold">{WEEKEND_BLOCKS[0].keyRule}</span>
          </div>
        </div>

        {/* Block 2: Late morning / early afternoon */}
        <div 
          id="weekend-card-deep"
          className="rounded-2xl border-2 border-indigo-200 bg-white p-5 flex flex-col justify-between shadow-2xs hover:border-indigo-300 transition-all"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
                Late morning / early afternoon
              </span>
              <button
                type="button"
                onClick={() => toggleWeekendTask('deep-block')}
                className="text-xs font-medium flex items-center gap-1 text-stone-500 hover:text-emerald-700 transition-colors"
              >
                {completedWeekendTasks.includes('deep-block') ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-stone-300" />
                )}
                <span>Done</span>
              </button>
            </div>

            <h3 className="text-lg font-bold text-stone-900">
              3–4 hr Deep Block
            </h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Simulate full interview conditions
            </p>

            <div className="mt-4 p-3 rounded-xl bg-indigo-50/50 text-xs text-indigo-950 leading-relaxed border border-indigo-100">
              {WEEKEND_BLOCKS[1].description}
            </div>

            {/* Selection modes for weekend deep block */}
            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold text-stone-700">Choose This Weekend's Focus:</div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'mock-interviews', label: 'Mock Interview' },
                  { id: 'timed-leetcode', label: 'Timed LeetCode Set' },
                  { id: 'full-design', label: 'Full LLD / HLD Case' },
                  { id: 'ai-system-case', label: 'AI-System Case' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setWeekendDeepSelection(opt.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-colors ${
                      weekendDeepSelection === opt.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="text-xs font-semibold text-stone-700">Simulation Checklist:</div>
              <ul className="text-xs text-stone-600 space-y-1">
                {WEEKEND_BLOCKS[1].activities.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 text-xs text-stone-500 font-medium">
            Rule: <span className="text-stone-800 font-semibold">{WEEKEND_BLOCKS[1].keyRule}</span>
          </div>
        </div>

        {/* Block 3: Evening */}
        <div 
          id="weekend-card-evening"
          className="rounded-2xl border border-stone-200 bg-white p-5 flex flex-col justify-between shadow-2xs hover:border-stone-300 transition-all"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200">
                <CalendarCheck className="w-3.5 h-3.5 text-violet-600" />
                Evening
              </span>
              <button
                type="button"
                onClick={() => toggleWeekendTask('evening-planning')}
                className="text-xs font-medium flex items-center gap-1 text-stone-500 hover:text-emerald-700 transition-colors"
              >
                {completedWeekendTasks.includes('evening-planning') ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-stone-300" />
                )}
                <span>Done</span>
              </button>
            </div>

            <h3 className="text-lg font-bold text-stone-900">
              Light review + Planning next week's focus
            </h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Consolidate learnings & reset mental slate
            </p>

            <div className="mt-4 p-3 rounded-xl bg-stone-50 text-xs text-stone-700 leading-relaxed border border-stone-100">
              {WEEKEND_BLOCKS[2].description}
            </div>

            {/* Non-negotiable evening off pledge */}
            <div className="mt-4 p-3.5 rounded-xl border border-rose-200 bg-rose-50/60">
              <div className="flex items-center gap-2 mb-1.5">
                <HeartHandshake className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-rose-900">Non-Negotiable Guardrail</span>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                "One full evening off per weekend — non-negotiable."
              </p>
              <label className="mt-2.5 flex items-center gap-2 text-xs font-medium text-rose-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eveningOffPledged}
                  onChange={(e) => setEveningOffPledged(e.target.checked)}
                  className="rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                />
                <span>I commit to taking one full evening completely off</span>
              </label>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 text-xs text-stone-500 font-medium">
            Rule: <span className="text-stone-800 font-semibold">{WEEKEND_BLOCKS[2].keyRule}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
