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
import { Phase } from '../types';

interface Props {
  phases: Phase[];
  loading: boolean;
}

export const PhasesRoadmap: React.FC<Props> = ({ phases, loading }) => {
  const [activePhaseTab, setActivePhaseTab] = useState<string>('');
  
  // Set default active tab when phases load
  React.useEffect(() => {
    if (phases.length > 0 && !activePhaseTab) {
      setActivePhaseTab((phases[0] as any)._id);
    }
  }, [phases]);
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

  const selectedPhase = phases.find((p: any) => p._id === activePhaseTab) || phases[0];

  if (loading) {
    return <div className="p-6 text-gray-500">Loading phases...</div>;
  }

  if (!phases || phases.length === 0) {
    return <div className="p-6 text-gray-500">No phases configured. Add them in settings.</div>;
  }

  return (
    <div id="phases-roadmap-view" className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-[28px] bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 text-black dark:text-white shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/10 dark:bg-white/20 text-black dark:text-white uppercase tracking-wider">
                Multi-Phase Masterplan
              </span>
              <span className="text-xs text-black/70 dark:text-white/70">Sept 17 → Mar 27 (191 Days)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white mt-1">
              Phased Roadmap & Milestone Architecture
            </h2>
            <p className="text-xs md:text-sm text-black/80 dark:text-white/80 mt-1 max-w-2xl font-normal leading-relaxed">
              Structured progressive overload across 5 sequential phases: Foundations → Advanced Patterns → Production Architecture → Timed Simulation → Peak Readiness.
            </p>
          </div>

          {/* Stat pill */}
          <div className="bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 p-3.5 rounded-2xl flex items-center gap-4 shrink-0">
            <div>
              <div className="text-xs text-black/60 dark:text-white/60">Timeline Progress</div>
              <div className="text-lg font-bold text-black dark:text-white">
                Day {currentDay} <span className="text-xs font-normal text-black/50 dark:text-white/50">of {totalDays}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-black/20 dark:border-white/20 flex items-center justify-center">
              <span className="text-xs font-bold text-black/80 dark:text-white/80">{percentElapsed}%</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-black/50 dark:text-white/50 mb-1.5 font-medium">
            <span>Sept 17, 2026 (Kickoff)</span>
            <span>Mar 27, 2027 (Peak Readiness)</span>
          </div>
          <div className="w-full h-2.5 bg-black/10 dark:bg-black/40 rounded-full overflow-hidden border border-black/10 dark:border-white/10">
            <div 
              className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.max(percentElapsed, 3)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5 Phase Steps Pill List */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {phases.map((p: any) => {
          const isSelected = activePhaseTab === p._id;
          return (
            <button
              key={p._id}
              type="button"
              id={`phase-tab-${p._id}`}
              onClick={() => setActivePhaseTab(p._id)}
              className={`p-3 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-black/10 dark:bg-white/20 border-black/20 dark:border-white/20 shadow-lg backdrop-blur-md'
                  : 'bg-white/40 dark:bg-black/40 hover:bg-white/60 dark:hover:bg-black/60 border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 backdrop-blur-md'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50'}`}>
                  Phase {p.number}
                </span>
                <span className={`text-[10px] ${isSelected ? 'text-black/80 dark:text-white/80' : 'text-black/40 dark:text-white/40'}`}>
                  {p.startDate.split(',')[0]}
                </span>
              </div>
              <div className={`text-xs font-bold truncate ${isSelected ? 'text-black dark:text-white' : 'text-black/70 dark:text-white/70'}`}>
                {p.title.split('&')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detail Card */}
      <div className="rounded-[28px] border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-6 shadow-2xl text-black dark:text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-black/10 dark:bg-white/20 text-black dark:text-white">
                PHASE {selectedPhase.number}
              </span>
              <span className="text-xs font-semibold text-black/60 dark:text-white/60">
                {selectedPhase.startDate} – {selectedPhase.endDate}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-black dark:text-white mt-1">
              {selectedPhase.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 text-black dark:text-white text-xs font-semibold self-start sm:self-auto">
            <Target className="w-3.5 h-3.5" />
            <span>Target Milestone</span>
          </div>
        </div>

        {/* Milestone Callout */}
        <div className="my-4 p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs md:text-sm text-black dark:text-white flex items-start gap-2.5">
          <Flag className="w-4 h-4 text-black/60 dark:text-white/60 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-black/90 dark:text-white/90">Phase Mission: </strong>
            <span className="text-black/80 dark:text-white/80">{selectedPhase.milestoneGoal}</span>
          </div>
        </div>

        {/* 3 Pillars Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Pillar 1: Primary */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-xl bg-black/10 dark:bg-white/10 text-black dark:text-white">
                <Code2 className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">Primary Syllabus</h4>
                <div className="text-[11px] text-black/50 dark:text-white/50">70m rotation focus</div>
              </div>
            </div>

            <ul className="space-y-2">
              {selectedPhase.primaryFocus?.map((item: string, idx: number) => {
                const itemKey = `${(selectedPhase as any)._id}-Primary-${idx}`;
                const isChecked = completedMilestones.includes(itemKey);
                return (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleMilestone(itemKey)}
                      className="mt-0.5 text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 shrink-0 transition-colors"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white fill-black/20 dark:fill-white/20" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-black/30 dark:border-white/30 block" />
                      )}
                    </button>
                    <span className={isChecked ? 'line-through text-black/40 dark:text-white/40' : 'text-black/80 dark:text-white/80 font-medium'}>
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Pillar 2: System Design */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-xl bg-black/10 dark:bg-white/10 text-black dark:text-white">
                <Server className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">LLD / HLD Syllabus</h4>
                <div className="text-[11px] text-black/50 dark:text-white/50">Architecture & Patterns</div>
              </div>
            </div>

            <ul className="space-y-2">
              {selectedPhase.secondaryFocus?.map((item: string, idx: number) => {
                const itemKey = `${(selectedPhase as any)._id}-design-${idx}`;
                const isChecked = completedMilestones.includes(itemKey);
                return (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleMilestone(itemKey)}
                      className="mt-0.5 text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 shrink-0 transition-colors"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white fill-black/20 dark:fill-white/20" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-black/30 dark:border-white/30 block" />
                      )}
                    </button>
                    <span className={isChecked ? 'line-through text-black/40 dark:text-white/40' : 'text-black/80 dark:text-white/80 font-medium'}>
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Pillar 3: AI & Agentic Systems */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-xl bg-black/10 dark:bg-white/10 text-black dark:text-white">
                <Bot className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">AI & Agentic Systems</h4>
                <div className="text-[11px] text-black/50 dark:text-white/50">40m daily slot</div>
              </div>
            </div>

            <ul className="space-y-2">
              {selectedPhase.otherFocus?.map((item: string, idx: number) => {
                const itemKey = `${(selectedPhase as any)._id}-ai-${idx}`;
                const isChecked = completedMilestones.includes(itemKey);
                return (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleMilestone(itemKey)}
                      className="mt-0.5 text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 shrink-0 transition-colors"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white fill-black/20 dark:fill-white/20" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-black/30 dark:border-white/30 block" />
                      )}
                    </button>
                    <span className={isChecked ? 'line-through text-black/40 dark:text-white/40' : 'text-black/80 dark:text-white/80 font-medium'}>
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
