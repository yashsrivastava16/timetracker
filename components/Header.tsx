"use client";
import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  BrainCircuit,
  Milestone,
  FileText,
  SunMedium,
  Settings,
  Moon,
  Sun,
  Activity,
  CalendarDays,
  CheckSquare
} from 'lucide-react';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import { useTheme } from '@/components/ThemeContext';

export type ActiveTab = 'weekday' | 'weekend' | 'deep-work' | 'logs' | 'calendar' | 'daily-tasks' | 'config';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isWeekendToday: boolean;
  activePhaseTitle: string;
}

export const Header: React.FC<Props> = ({
  activeTab,
  onTabChange,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { isSignedIn, isLoaded } = useAuth();

  const tabs = [
    { id: 'weekday' as ActiveTab, label: 'Weekday', icon: Clock },
    { id: 'weekend' as ActiveTab, label: 'Weekend', icon: SunMedium },
    { id: 'daily-tasks' as ActiveTab, label: 'Daily Tasks', icon: CheckSquare },
    { id: 'deep-work' as ActiveTab, label: 'Focus', icon: BrainCircuit },
    { id: 'logs' as ActiveTab, label: 'Task Log', icon: FileText },
    { id: 'calendar' as ActiveTab, label: 'Progression', icon: CalendarDays },
    { id: 'config' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-30 transition-colors duration-300">
      <div className="w-full px-6 md:px-12 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-bold text-sm">
              <Activity className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-semibold text-white tracking-tight">
              TimeTracker
            </h1>
          </Link>

          {/* Center Navigation */}
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar justify-start md:justify-center flex-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors relative rounded-lg ${isActive
                    ? 'text-white bg-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="flex items-center min-w-[32px] min-h-[32px]">
              {isLoaded && !isSignedIn && (
                <SignInButton mode="modal">
                  <button className="px-4 py-1.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              )}
              {isLoaded && isSignedIn && (
                <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-8 h-8 rounded-md' } }} />
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
