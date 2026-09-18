import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  CheckCircle2, 
  BrainCircuit, 
  FileText, 
  Layers,
  Star,
  Check
} from 'lucide-react';
// Removed hardcoded scheduleData imports
import { DailyLogEntry } from '../types';

interface Props {
  onSaveLog: (log: Omit<DailyLogEntry, 'id' | 'timestamp'>) => void;
}

export const DeepWorkTimer: React.FC<Props> = ({ onSaveLog }) => {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);
  const [selectedCoreTrack, setSelectedCoreTrack] = useState<string>('Primary Task');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('');
  const [selectedAITopic, setSelectedAITopic] = useState<string>('');

  const segmentDurations = [70 * 60, 40 * 60, 10 * 60];
  const segmentNames = [
    '70 min: Primary Focus',
    '40 min: Secondary Focus',
    '10 min: Log & Reflection'
  ];

  const [timeLeft, setTimeLeft] = useState<number>(segmentDurations[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [logSummary, setLogSummary] = useState<string>('');
  const [confidenceScore, setConfidenceScore] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [logSavedToast, setLogSavedToast] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (activeSegmentIndex < 2) {
        switchSegment(activeSegmentIndex + 1);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, activeSegmentIndex]);

  const switchSegment = (index: number) => {
    setActiveSegmentIndex(index);
    setTimeLeft(segmentDurations[index]);
    setIsRunning(false);
  };

  const resetCurrentTimer = () => {
    setIsRunning(false);
    setTimeLeft(segmentDurations[activeSegmentIndex]);
  };

  const formatMinutesSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentTotal = segmentDurations[activeSegmentIndex];
  const progressPercent = Math.min(100, Math.max(0, Math.round(((currentTotal - timeLeft) / currentTotal) * 100)));

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const offset = new Date().getTimezoneOffset() * 60000;
    const todayISO = new Date(Date.now() - offset).toISOString().split('T')[0];
    const coreTopicLabel = `${selectedCoreTrack}: ${selectedSubtopic || 'General Task'}`;
    const aiTopicLabel = selectedAITopic || 'Secondary Work';

    onSaveLog({
      date: todayISO,
      primaryTask: coreTopicLabel,
      secondaryTask: aiTopicLabel,
      summary: logSummary || 'Completed focus session.',
      confidenceScore,
      completedBlocks: ['deep-work'],
    });

    setLogSavedToast(true);
    setTimeout(() => setLogSavedToast(false), 3000);
  };


  return (
    <div id="deep-work-focus-suite" className="space-y-6">
      {/* Header card with 2-hour breakdown explanation */}
      <div className="p-5 md:p-6 rounded-[28px] bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 text-black dark:text-white shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/10 dark:bg-white/20 text-black dark:text-white tracking-wider">
                Focus Mode
              </span>
              <span className="text-xs text-black/60 dark:text-white/60">Main Focus Block · High Cognitive Mode</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white mt-1">
              Focus Execution Assistant
            </h2>
            <p className="text-xs md:text-sm text-black/70 dark:text-white/70 mt-1 max-w-2xl font-normal leading-relaxed">
              "Your real work happens here. 2 hrs, split as 70 min primary task + 40 min secondary task + 10 min logging."
            </p>
          </div>
        </div>

        {/* 3 Step Pill Navigation */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: '1. Primary (70 min)', desc: 'Main Focus Task', idx: 0, icon: Layers },
            { label: '2. Secondary (40 min)', desc: 'Side Task / Review', idx: 1, icon: BrainCircuit },
            { label: '3. Log (10 min)', desc: 'Record what you covered', idx: 2, icon: FileText },
          ].map((step) => {
            const Icon = step.icon;
            const isCurrent = activeSegmentIndex === step.idx;
            return (
              <button
                key={step.idx}
                type="button"
                onClick={() => switchSegment(step.idx)}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  isCurrent
                    ? 'bg-black/10 dark:bg-white/20 text-black dark:text-white border-black/20 dark:border-white/20 shadow-lg backdrop-blur-md'
                    : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-black/70 dark:text-white/70 border-black/10 dark:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isCurrent ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50'}`}>
                    {step.label}
                  </span>
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-black dark:text-white' : 'text-black/40 dark:text-white/40'}`} />
                </div>
                <div className={`text-[11px] mt-0.5 ${isCurrent ? 'text-black/80 dark:text-white/80' : 'text-black/40 dark:text-white/40'}`}>
                  {step.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Focus Canvas & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: Interactive Timer (7 Cols) */}
        <div className="lg:col-span-7 rounded-[28px] border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-6 shadow-2xl flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold tracking-wider text-black/60 dark:text-white/60">
            {segmentNames[activeSegmentIndex]}
          </span>

          {/* Big Digital Display */}
          <div className="my-6">
            <div className="text-6xl md:text-7xl font-mono font-black tracking-tight text-black dark:text-white">
              {formatMinutesSeconds(timeLeft)}
            </div>
            <div className="mt-2 text-xs font-medium text-black/60 dark:text-white/60">
              {progressPercent}% of this block elapsed
            </div>

            {/* Progress bar */}
            <div className="w-64 h-2 bg-black/10 dark:bg-black/40 rounded-full mx-auto mt-3 overflow-hidden border border-black/10 dark:border-white/10">
              <div 
                className="h-full bg-black dark:bg-white transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="toggle-study-timer-btn"
              onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
                isRunning
                  ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white hover:bg-black/20 dark:hover:bg-white/20'
                  : 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-gray-200'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className={`w-5 h-5 ${!isRunning && 'fill-current'}`} />}
              <span>{isRunning ? 'Pause Timer' : 'Start Focus'}</span>
            </button>

            <button
              type="button"
              id="reset-study-timer-btn"
              onClick={resetCurrentTimer}
              className="p-3 rounded-2xl border border-black/20 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/10 text-black/70 dark:text-white/70 transition-colors"
              title="Reset current segment"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {activeSegmentIndex < 2 && (
              <button
                type="button"
                id="skip-study-segment-btn"
                onClick={() => switchSegment(activeSegmentIndex + 1)}
                className="px-4 py-3 rounded-2xl border border-black/20 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/10 text-black/80 dark:text-white/80 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Next Stage</span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick preset adjustments */}
          <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
            <span>Quick adjust:</span>
            {[
              { label: '+5m', sec: 5 * 60, type: 'add' },
              { label: '+10m', sec: 10 * 60, type: 'add' },
              { label: 'Set 25m Pomodoro', sec: 25 * 60, type: 'set' },
            ].map(adj => (
              <button
                key={adj.label}
                type="button"
                onClick={() => {
                  if (adj.type === 'add') {
                    setTimeLeft(prev => prev + adj.sec);
                  } else {
                    setTimeLeft(adj.sec);
                  }
                }}
                className="px-2 py-1 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black/80 dark:text-white/80 font-medium"
              >
                {adj.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Topic Navigator & Log input based on active tab (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeSegmentIndex === 0 && (
            <div className="rounded-[28px] border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70">
                  70-Minute Primary Focus
                </span>
              </div>

              {/* Generic Inputs */}
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-black/80 dark:text-white/80 mb-1">
                    Primary Track / Project
                  </label>
                  <input
                    type="text"
                    value={selectedCoreTrack}
                    onChange={(e) => setSelectedCoreTrack(e.target.value)}
                    placeholder="e.g. Backend Refactor"
                    className="w-full text-xs p-2.5 rounded-xl border border-black/20 dark:border-white/20 bg-black/5 dark:bg-black/20 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black/80 dark:text-white/80 mb-1">
                    Specific Task
                  </label>
                  <input
                    type="text"
                    value={selectedSubtopic}
                    onChange={(e) => setSelectedSubtopic(e.target.value)}
                    placeholder="e.g. Implement authentication middleware"
                    className="w-full text-xs p-2.5 rounded-xl border border-black/20 dark:border-white/20 bg-black/5 dark:bg-black/20 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSegmentIndex === 1 && (
            <div className="rounded-[28px] border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70">
                  40-Minute Secondary Task
                </span>
              </div>

              <p className="text-xs text-black/50 dark:text-white/50 mb-3">
                Focus on side projects, learning new tools, or code reviews.
              </p>

              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-black/80 dark:text-white/80 mb-1">
                    Secondary Task
                  </label>
                  <input
                    type="text"
                    value={selectedAITopic}
                    onChange={(e) => setSelectedAITopic(e.target.value)}
                    placeholder="e.g. Inbox zero, PR reviews, etc."
                    className="w-full text-xs p-2.5 rounded-xl border border-black/20 dark:border-white/20 bg-black/5 dark:bg-black/20 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active Segment 2: 10-min Log Form */}
          {activeSegmentIndex === 2 && (
            <div className="rounded-[28px] border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70">
                  10-Minute Log
                </span>
              </div>
              <p className="text-xs text-black/50 dark:text-white/50 mb-3">
                Log what you covered to guarantee retention and track progress.
              </p>

              <form onSubmit={handleSaveLog} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-black/80 dark:text-white/80 mb-1">
                    What did you complete?
                  </label>
                  <textarea
                    rows={3}
                    value={logSummary}
                    onChange={(e) => setLogSummary(e.target.value)}
                    placeholder="e.g. Completed feature X and reviewed pull requests..."
                    className="w-full text-xs p-2.5 rounded-xl border border-black/20 dark:border-white/20 bg-black/5 dark:bg-black/20 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-black/80 dark:text-white/80">
                    Productivity Score:
                  </label>
                  <div className="flex gap-1">
                    {([1, 2, 3, 4, 5] as const).map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setConfidenceScore(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= confidenceScore
                              ? 'text-black fill-black dark:text-white dark:fill-white'
                              : 'text-black/20 dark:text-white/20'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  id="save-daily-study-log-btn"
                  className="w-full py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs hover:bg-black/80 dark:hover:bg-gray-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Save to Task Log
                </button>

                {logSavedToast && (
                  <div className="p-2 rounded-xl bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 text-black dark:text-white text-xs text-center font-medium">
                    Task log saved successfully!
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
