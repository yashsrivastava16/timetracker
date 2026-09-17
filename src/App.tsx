import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { CurrentBlockBanner } from './components/CurrentBlockBanner';
import { WeekdaySchedule } from './components/WeekdaySchedule';
import { WeekendSchedule } from './components/WeekendSchedule';
import { DeepWorkTimer } from './components/DeepWorkTimer';
import { PhasesRoadmap } from './components/PhasesRoadmap';
import { StudyLogHistory } from './components/StudyLogHistory';
import { DailyLogEntry } from './types';
import { PHASES_ROADMAP } from './data/scheduleData';

// Initial default logs for an immediate rich feel
const INITIAL_LOGS: DailyLogEntry[] = [
  {
    id: 'log-1',
    date: '2026-09-17',
    timestamp: Date.now() - 86400000,
    dsaTopic: 'DSA: Two Pointers & Sliding Window',
    aiTopic: 'LLM Function Calling & Parameter Schema Validation',
    summary: 'Solved 2 medium sliding window problems (Minimum Window Substring intuition). For AI, reviewed JSON schema parameter constraints for tool routing.',
    confidenceScore: 4,
    completedBlocks: ['deep-work', 'terrace-walk', 'dinner'],
  },
  {
    id: 'log-2',
    date: '2026-09-16',
    timestamp: Date.now() - 172800000,
    dsaTopic: 'LLD: Strategy Pattern & Factory Decoupling',
    aiTopic: 'ReAct Agent Reasoning Loop & Tool Execution',
    summary: 'Implemented a clean Payment Processor using Strategy pattern. In AI prep, traced how ReAct loops parse Thoughts and Actions with regex fallbacks.',
    confidenceScore: 5,
    completedBlocks: ['deep-work', 'terrace-walk'],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('weekday');
  
  // Detect if today is weekend
  const todayDay = new Date().getDay();
  const isWeekendToday = todayDay === 0 || todayDay === 6;

  // Key for today's completed blocks
  const todayKey = `prep_blocks_${new Date().toISOString().split('T')[0]}`;
  const [completedBlocks, setCompletedBlocks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      return saved ? JSON.parse(saved) : ['wake-review'];
    } catch {
      return ['wake-review'];
    }
  });

  // Study logs
  const [studyLogs, setStudyLogs] = useState<DailyLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('prep_schedule_study_logs');
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  // Save completed blocks
  useEffect(() => {
    try {
      localStorage.setItem(todayKey, JSON.stringify(completedBlocks));
    } catch {
      // ignore
    }
  }, [completedBlocks, todayKey]);

  // Save study logs
  useEffect(() => {
    try {
      localStorage.setItem('prep_schedule_study_logs', JSON.stringify(studyLogs));
    } catch {
      // ignore
    }
  }, [studyLogs]);

  const toggleBlockCompletion = (blockId: string) => {
    setCompletedBlocks((prev) =>
      prev.includes(blockId) ? prev.filter((id) => id !== blockId) : [...prev, blockId]
    );
  };

  const handleAddStudyLog = (newEntry: Omit<DailyLogEntry, 'id' | 'timestamp'>) => {
    const entry: DailyLogEntry = {
      ...newEntry,
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
    };
    setStudyLogs((prev) => [entry, ...prev]);
    // Also auto-mark deep work block as completed for today
    if (!completedBlocks.includes('deep-work')) {
      setCompletedBlocks((prev) => [...prev, 'deep-work']);
    }
  };

  const handleDeleteLog = (id: string) => {
    setStudyLogs((prev) => prev.filter((log) => log.id !== id));
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Sticky navigation header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isWeekendToday={isWeekendToday}
        activePhaseTitle={PHASES_ROADMAP[0].title.split('&')[0]}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dynamic real-time/simulated block indicator */}
        <CurrentBlockBanner
          isWeekend={isWeekendToday}
          onNavigateToDeepWork={() => setActiveTab('deep-work')}
          completedBlocks={completedBlocks}
          onToggleBlock={toggleBlockCompletion}
        />

        {/* Tab content rendering */}
        {activeTab === 'weekday' && (
          <WeekdaySchedule
            completedBlocks={completedBlocks}
            onToggleBlock={toggleBlockCompletion}
            onLaunchDeepWork={() => setActiveTab('deep-work')}
          />
        )}

        {activeTab === 'weekend' && <WeekendSchedule />}

        {activeTab === 'deep-work' && (
          <DeepWorkTimer onSaveLog={handleAddStudyLog} />
        )}

        {activeTab === 'phases' && <PhasesRoadmap />}

        {activeTab === 'logs' && (
          <StudyLogHistory
            logs={studyLogs}
            onAddLog={handleAddStudyLog}
            onDeleteLog={handleDeleteLog}
          />
        )}
      </main>

      {/* Footer info */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-stone-200 mt-12 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          Daily Prep Schedule • Sept 17 → Mar 27 Masterplan
        </div>
        <div className="flex items-center gap-4 text-stone-400">
          <span>70m DSA/LLD/HLD</span>
          <span>•</span>
          <span>40m AI Systems</span>
          <span>•</span>
          <span>10m Log</span>
          <span>•</span>
          <span>Weekend Evenings Off</span>
        </div>
      </footer>
    </div>
  );
}
