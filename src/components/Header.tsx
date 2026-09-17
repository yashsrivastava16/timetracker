import React from 'react';
import { 
  Calendar, 
  Clock, 
  BrainCircuit, 
  Milestone, 
  FileText, 
  SunMedium, 
  Coffee,
  CheckCircle
} from 'lucide-react';

export type ActiveTab = 'weekday' | 'weekend' | 'deep-work' | 'phases' | 'logs';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isWeekendToday: boolean;
  activePhaseTitle: string;
}

export const Header: React.FC<Props> = ({
  activeTab,
  onTabChange,
  isWeekendToday,
  activePhaseTitle,
}) => {
  const tabs = [
    { id: 'weekday' as ActiveTab, label: 'Weekday Routine', icon: Clock, badge: '8 Blocks' },
    { id: 'weekend' as ActiveTab, label: 'Weekend Blueprint', icon: SunMedium, badge: 'Sat–Sun' },
    { id: 'deep-work' as ActiveTab, label: 'Deep Work (2 hrs)', icon: BrainCircuit, badge: '70/40/10' },
    { id: 'phases' as ActiveTab, label: 'Phases (Sept 17 → Mar 27)', icon: Milestone, badge: 'Roadmap' },
    { id: 'logs' as ActiveTab, label: 'Daily Study Log', icon: FileText, badge: '10 min' },
  ];

  return (
    <header className="border-b border-stone-200 bg-white/95 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-black text-base shadow-xs">
              DS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                  Daily Prep Schedule
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                  Sept 17 → Mar 27
                </span>
              </div>
              <p className="text-xs text-stone-500 font-normal">
                {isWeekendToday ? 'Today is Weekend Mode' : 'Weekday Focus Active'} • Current: {activePhaseTitle}
              </p>
            </div>
          </div>

          {/* Quick status pill */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Burnout-Proof Cadence</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 mt-3 overflow-x-auto no-scrollbar pb-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                id={`nav-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-stone-50/80 hover:bg-stone-100 text-stone-600 border border-stone-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    isActive
                      ? 'bg-stone-800 text-amber-300'
                      : 'bg-stone-200/70 text-stone-600'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
