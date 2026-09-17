import React, { useState } from 'react';
import { 
  Calendar, 
  Flag, 
  CheckCircle2, 
  Clock, 
  Code2, 
  Server, 
  Bot, 
  ChevronRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { PHASES_ROADMAP } from '../data/scheduleData';
import { Phase } from '../types';

export const PhasesRoadmap: React.FC = () => {
  const [activePhaseTab, setActivePhaseTab] = useState<string>('phase-1');
  const [completedMilestones, setCompletedMilestones] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('prep_schedule_milestones');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleMilestone = (id: string) => {
    setCompletedMilestones(prev => {
      const updated = prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id];
      localStorage.setItem('prep_schedule_milestones', JSON.stringify(updated));
      return updated;
    });
  };

  // Calculate timeline progress between Sept 17, 2026 and Mar 27, 2027
  const startDate = new Date('2026-09-17T00:00:00');
  const endDate = new Date('2027-03-27T23:59:59');
  const now = new Date();

  const totalDurationMs = endDate.getTime() - startDate.getTime();
  const elapsedMs = Math.max(0, now.getTime() - startDate.getTime());
  const percentElapsed = Math.min(100, Math.max(0, Math.round((elapsedMs / totalDurationMs) * 100)));

  const totalDays = Math.round(totalDurationMs / (1000 * 60 * 60 * 24));
  const currentDay = Math.min(totalDays, Math.max(1, Math.ceil(elapsedMs / (1000 * 60 * 60 * 24))));

  const selectedPhase = PHASES_ROADMAP.find(p => p.id === activePhaseTab) || PHASES_ROADMAP[0];

  return (
    <div id="phases-roadmap-view" className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-stone-900 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400 text-stone-950 uppercase tracking-wider">
                Multi-Phase Masterplan
              </span>
              <span className="text-xs text-stone-300">Sept 17 → Mar 27 (191 Days)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
              Phased Roadmap & Milestone Architecture
            </h2>
            <p className="text-xs md:text-sm text-stone-300 mt-1 max-w-2xl font-normal leading-relaxed">
              Structured progressive overload across 5 sequential phases: Foundations → Advanced Patterns → Production Architecture → Timed Simulation → Peak Readiness.
            </p>
          </div>

          {/* Stat pill */}
          <div className="bg-stone-800/90 border border-stone-700/80 p-3.5 rounded-xl flex items-center gap-4 shrink-0">
            <div>
              <div className="text-xs text-stone-400">Timeline Progress</div>
              <div className="text-lg font-bold text-white">
                Day {currentDay} <span className="text-xs font-normal text-stone-400">of {totalDays}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-stone-700 flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-400">{percentElapsed}%</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-stone-400 mb-1.5 font-medium">
            <span>Sept 17, 2026 (Kickoff)</span>
            <span>Mar 27, 2027 (Peak Readiness)</span>
          </div>
          <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden border border-stone-700">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(percentElapsed, 3)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5 Phase Steps Pill List */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {PHASES_ROADMAP.map((p) => {
          const isSelected = activePhaseTab === p.id;
          return (
            <button
              key={p.id}
              type="button"
              id={`phase-tab-${p.id}`}
              onClick={() => setActivePhaseTab(p.id)}
              className={`p-3 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-white border-stone-900 shadow-xs'
                  : 'bg-stone-50/80 hover:bg-stone-100 border-stone-200 text-stone-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-indigo-600' : 'text-stone-500'}`}>
                  Phase {p.number}
                </span>
                <span className="text-[10px] text-stone-400">
                  {p.startDate.split(',')[0]}
                </span>
              </div>
              <div className={`text-xs font-bold truncate ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                {p.title.split('&')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detail Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-900 text-white">
                PHASE {selectedPhase.number}
              </span>
              <span className="text-xs font-semibold text-stone-500">
                {selectedPhase.startDate} – {selectedPhase.endDate}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-stone-900 mt-1">
              {selectedPhase.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
            <Target className="w-3.5 h-3.5" />
            <span>Target Milestone</span>
          </div>
        </div>

        {/* Milestone Callout */}
        <div className="my-4 p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80 text-xs md:text-sm text-indigo-950 flex items-start gap-2.5">
          <Flag className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-indigo-900">Phase Mission: </strong>
            {selectedPhase.milestoneGoal}
          </div>
        </div>

        {/* 3 Pillars Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Pillar 1: DSA */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <Code2 className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">DSA Syllabus</h4>
                <div className="text-[11px] text-stone-400">70m rotation focus</div>
              </div>
            </div>

            <ul className="space-y-2">
              {selectedPhase.focusDSA.map((item, idx) => {
                const itemKey = `${selectedPhase.id}-dsa-${idx}`;
                const isChecked = completedMilestones.includes(itemKey);
                return (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleMilestone(itemKey)}
                      className="mt-0.5 text-stone-400 hover:text-emerald-600 shrink-0"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-stone-300 block" />
                      )}
                    </button>
                    <span className={isChecked ? 'line-through text-stone-400' : 'text-stone-700 font-medium'}>
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Pillar 2: System Design */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                <Server className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">LLD / HLD Syllabus</h4>
                <div className="text-[11px] text-stone-400">Architecture & Patterns</div>
              </div>
            </div>

            <ul className="space-y-2">
              {selectedPhase.focusDesign.map((item, idx) => {
                const itemKey = `${selectedPhase.id}-design-${idx}`;
                const isChecked = completedMilestones.includes(itemKey);
                return (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleMilestone(itemKey)}
                      className="mt-0.5 text-stone-400 hover:text-emerald-600 shrink-0"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-stone-300 block" />
                      )}
                    </button>
                    <span className={isChecked ? 'line-through text-stone-400' : 'text-stone-700 font-medium'}>
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Pillar 3: AI & Agentic Systems */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
                <Bot className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">AI & Agentic Systems</h4>
                <div className="text-[11px] text-stone-400">40m daily slot</div>
              </div>
            </div>

            <ul className="space-y-2">
              {selectedPhase.focusAI.map((item, idx) => {
                const itemKey = `${selectedPhase.id}-ai-${idx}`;
                const isChecked = completedMilestones.includes(itemKey);
                return (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleMilestone(itemKey)}
                      className="mt-0.5 text-stone-400 hover:text-emerald-600 shrink-0"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-stone-300 block" />
                      )}
                    </button>
                    <span className={isChecked ? 'line-through text-stone-400' : 'text-stone-700 font-medium'}>
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
