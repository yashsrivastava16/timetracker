"use client";

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from '@/components/Header';
import { CurrentBlockBanner } from '@/components/CurrentBlockBanner';
import { WeekdaySchedule } from '@/components/WeekdaySchedule';
import { WeekendSchedule } from '@/components/WeekendSchedule';
import { DeepWorkTimer } from '@/components/DeepWorkTimer';
import { PhasesRoadmap } from '@/components/PhasesRoadmap';
import { CalendarView } from '@/components/CalendarView';
import { StudyLogHistory } from '@/components/StudyLogHistory';
import { DailyTasksTab } from '@/components/DailyTasksTab';
import { Configuration } from '@/components/Configuration';
import { NotificationModal } from '@/components/NotificationModal';
import { Toast } from '@/components/Toast';
import { useScheduleNotifications } from '@/hooks/useScheduleNotifications';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@clerk/nextjs';
import { useTheme } from '@/components/ThemeContext';
import { PHASES_ROADMAP } from '@/data/scheduleData';
import { DailyLogEntry } from '@/types';

export interface ScheduleItem {
  _id: string;
  timeRange: string;
  title: string;
  description: string;
  startMinutes: number;
  endMinutes: number;
}

// removed INITIAL_LOGS

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('weekday');
  const { activeNotification, clearNotification } = useScheduleNotifications();
  const { getToken, isSignedIn } = useAuth();
  const { theme } = useTheme();
  usePushNotifications();

  const [isMounted, setIsMounted] = useState(false);

  const [userSchedules, setUserSchedules] = useState<ScheduleItem[]>([]);
  const [weekendSchedules, setWeekendSchedules] = useState<any[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
  const [studyLogs, setStudyLogs] = useState<DailyLogEntry[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(true);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const fetchAllData = async () => {
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [resSchedules, resWeekends, resPhases, resLogs] = await Promise.all([
        fetch('/api/schedules', { headers }),
        fetch('/api/weekend-schedules', { headers }),
        fetch('/api/phases', { headers }),
        fetch('/api/daily-logs', { headers })
      ]);

      if (resSchedules.ok) setUserSchedules(await resSchedules.json());
      if (resWeekends.ok) setWeekendSchedules(await resWeekends.json());
      if (resPhases.ok) setPhases(await resPhases.json());
      if (resLogs.ok) setStudyLogs(await resLogs.json());
    } catch (e) {
      console.error(e);
    } finally {
      setSchedulesLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchAllData();
  }, [isSignedIn]);

  // Detect if today is weekend
  const todayDay = new Date().getDay();
  const isWeekendToday = todayDay === 0 || todayDay === 6;

  // Key for today's completed blocks
  const todayKey = `prep_blocks_${new Date().toISOString().split('T')[0]}`;
  const [completedBlocks, setCompletedBlocks] = useState<string[]>(() => {
    if (typeof window === 'undefined') return ['wake-review'];
    try {
      const saved = localStorage.getItem(todayKey);
      return saved ? JSON.parse(saved) : ['wake-review'];
    } catch {
      return ['wake-review'];
    }
  });

  // Removed localStorage studyLogs initialization

  // Save completed blocks
  useEffect(() => {
    try {
      localStorage.setItem(todayKey, JSON.stringify(completedBlocks));
    } catch {
      // ignore
    }
  }, [completedBlocks, todayKey]);

  // Study logs are now fetched from DB

  const toggleBlockCompletion = (blockId: string) => {
    if (completedBlocks.includes(blockId)) {
      setCompletedBlocks((prev) => prev.filter((id) => id !== blockId));
    } else {
      setCompletedBlocks((prev) => [...prev, blockId]);
      showToast('Task completed! Great job.');

      // Auto-generate log
      const block = userSchedules.find(s => s._id === blockId) || weekendSchedules.find(s => s._id === blockId);
      if (block) {
        const offset = new Date().getTimezoneOffset() * 60000;
        const localDate = new Date(Date.now() - offset).toISOString().split('T')[0];

        const autoLog = {
          date: localDate,
          primaryTask: block.title,
          secondaryTask: 'Routine Block',
          confidenceScore: 3 as const,
          summary: `Completed schedule block: ${block.title}`,
          completedBlocks: [blockId],
        };

        // Prevent double entry
        const isDuplicate = studyLogs.some(
          log => log.date === autoLog.date && log.primaryTask === autoLog.primaryTask && log.summary === autoLog.summary
        );

        if (!isDuplicate) {
          handleAddStudyLog(autoLog, false);
        }
      }
    }
  };

  const handleAddStudyLog = async (newEntry: Omit<DailyLogEntry, 'id' | 'timestamp'>, isDeepWork: boolean = true) => {
    const entryData = {
      ...newEntry,
      timestamp: Date.now(),
    };

    // Add to DB
    try {
      const token = await getToken();
      const res = await fetch('/api/daily-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(entryData)
      });
      if (res.ok) {
        const savedEntry = await res.json();
        // Optimistic UI update
        savedEntry.id = savedEntry._id;
        setStudyLogs(prev => [savedEntry, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
    // Also auto-mark deep work block as completed for today
    if (isDeepWork && !completedBlocks.includes('deep-work')) {
      setCompletedBlocks((prev) => [...prev, 'deep-work']);
    }
  };

  const handleDeleteLog = async (id: string) => {
    // Delete from DB
    try {
      const token = await getToken();
      await fetch(`/api/daily-logs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudyLogs((prev) => prev.filter((log) => log.id !== id && (log as any)._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-sans antialiased text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black relative transition-colors duration-500"
      style={{
        backgroundImage: `url('/istockphoto-1451071102-1024x1024.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Blurred Overlay for premium aesthetic */}
      <div className={`fixed inset-0 pointer-events-none z-0 ${theme === 'dark' ? 'bg-black/60' : 'bg-white/70'} backdrop-blur-[40px]`} />

      {/* Content wrapper with z-index to stay above the blur overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Sticky navigation header */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isWeekendToday={isWeekendToday}
          activePhaseTitle={phases.length > 0 ? phases[0].title.split('&')[0] : 'Project Overview'}
        />

        <main className="w-full px-6 md:px-12 py-8">
          {/* Dynamic real-time/simulated block indicator */}
          <CurrentBlockBanner
            schedules={userSchedules}
            isWeekend={isWeekendToday}
            onNavigateToDeepWork={() => setActiveTab('deep-work')}
            completedBlocks={completedBlocks}
            onToggleBlock={toggleBlockCompletion}
          />

          {/* Tab content rendering */}
          {activeTab === 'weekday' && (
            <WeekdaySchedule
              schedules={userSchedules}
              loading={schedulesLoading}
              completedBlocks={completedBlocks}
              onToggleBlock={toggleBlockCompletion}
              onLaunchDeepWork={() => setActiveTab('deep-work')}
            />
          )}

          {activeTab === 'weekend' && <WeekendSchedule schedules={weekendSchedules} loading={schedulesLoading} />}

          {activeTab === 'deep-work' && (
            <DeepWorkTimer onSaveLog={handleAddStudyLog} />
          )}

          {activeTab === 'calendar' && (
            <CalendarView logs={studyLogs} />
          )}

          {activeTab === 'daily-tasks' && <DailyTasksTab />}

          {activeTab === 'logs' && (
            <StudyLogHistory
              logs={studyLogs}
              onAddLog={handleAddStudyLog}
              onDeleteLog={handleDeleteLog}
            />
          )}

          {activeTab === 'config' && (
            <Configuration onScheduleChange={fetchAllData} />
          )}
        </main>

        {/* Footer info */}
        <footer className="w-full px-6 md:px-12 py-8 border-t border-gray-200 dark:border-gray-800 mt-12 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Time Tracker & Productivity Suite
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span>Focus Blocks</span>
            <span>•</span>
            <span>Task Logs</span>
            <span>•</span>
            <span>Project Milestones</span>
          </div>
        </footer>

        {/* Global Notifications */}
        <NotificationModal
          notification={activeNotification}
          onClose={clearNotification}
        />

        <Toast
          message={toastMessage}
          visible={toastVisible}
          onClose={() => setToastVisible(false)}
        />
      </div>
    </div>
  );
}
