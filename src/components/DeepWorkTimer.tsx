import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  CheckCircle2, 
  BrainCircuit, 
  Sparkles, 
  FileText, 
  Volume2, 
  VolumeX,
  Layers,
  Star,
  Check
} from 'lucide-react';
import { ROTATING_STUDY_TRACKS, AI_PREP_TRACK } from '../data/scheduleData';
import { DailyLogEntry } from '../types';

interface Props {
  onSaveLog: (log: Omit<DailyLogEntry, 'id' | 'timestamp'>) => void;
}

export const DeepWorkTimer: React.FC<Props> = ({ onSaveLog }) => {
  // 3 segments: 0 = 70m core, 1 = 40m AI prep, 2 = 10m log
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);
  const [selectedCoreTrack, setSelectedCoreTrack] = useState<'dsa' | 'lld' | 'hld'>('dsa');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('');
  const [selectedAITopic, setSelectedAITopic] = useState<string>('');

  // Segment durations in seconds
  const segmentDurations = [70 * 60, 40 * 60, 10 * 60];
  const segmentNames = [
    '70 min: Core Rotation (DSA / LLD / HLD)',
    '40 min: AI & Agentic-Systems Prep',
    '10 min: Reflection & Daily Study Log'
  ];

  const [timeLeft, setTimeLeft] = useState<number>(segmentDurations[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Form for the 10-minute log
  const [logSummary, setLogSummary] = useState<string>('');
  const [confidenceScore, setConfidenceScore] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [logSavedToast, setLogSavedToast] = useState<boolean>(false);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime();
      // If not on last segment, prompt advance
      if (activeSegmentIndex < 2) {
        switchSegment(activeSegmentIndex + 1);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, activeSegmentIndex]);

  // Play synthetic pleasant web audio chime
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

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
    const todayISO = new Date().toISOString().split('T')[0];
    const coreTopicLabel = `${selectedCoreTrack.toUpperCase()}: ${selectedSubtopic || 'Problem Set Practice'}`;
    const aiTopicLabel = selectedAITopic || 'Agentic Architecture Review';

    onSaveLog({
      date: todayISO,
      dsaTopic: coreTopicLabel,
      aiTopic: aiTopicLabel,
      summary: logSummary || 'Completed 2-hour deep study session covering core rotation and AI systems.',
      confidenceScore,
      completedBlocks: ['deep-work'],
    });

    setLogSavedToast(true);
    setTimeout(() => setLogSavedToast(false), 3000);
  };

  const currentTrackData = ROTATING_STUDY_TRACKS.find(t => t.id === selectedCoreTrack)!;

  return (
    <div id="deep-work-focus-suite" className="space-y-6">
      {/* Header card with 2-hour breakdown explanation */}
      <div className="p-5 md:p-6 rounded-2xl bg-indigo-950 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-400 text-indigo-950 uppercase tracking-wider">
                8:50 – 10:50 PM
              </span>
              <span className="text-xs text-indigo-200">Main Study Block · High Cognitive Mode</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
              Deep Work Execution Assistant
            </h2>
            <p className="text-xs md:text-sm text-indigo-200 mt-1 max-w-2xl font-normal leading-relaxed">
              "Your real prep happens here, when you're actually switched on. 2 hrs, split as 70 min DSA/LLD/HLD (rotating) + 40 min AI/agentic-systems interview prep + 10 min log what you covered."
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-indigo-900/80 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-200 flex items-center gap-2 text-xs self-start md:self-auto transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            <span>{soundEnabled ? 'Chime ON' : 'Chime Muted'}</span>
          </button>
        </div>

        {/* 3 Step Pill Navigation */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: '1. Core (70 min)', desc: 'DSA / LLD / HLD Rotating', idx: 0, icon: Layers },
            { label: '2. AI Systems (40 min)', desc: 'Agents, RAG & Tool use', idx: 1, icon: BrainCircuit },
            { label: '3. Log & Notes (10 min)', desc: 'Record what you covered', idx: 2, icon: FileText },
          ].map((step) => {
            const Icon = step.icon;
            const isCurrent = activeSegmentIndex === step.idx;
            return (
              <button
                key={step.idx}
                type="button"
                onClick={() => switchSegment(step.idx)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isCurrent
                    ? 'bg-white text-stone-900 border-white shadow-sm'
                    : 'bg-indigo-900/50 hover:bg-indigo-900/80 text-indigo-100 border-indigo-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isCurrent ? 'text-indigo-900' : 'text-indigo-300'}`}>
                    {step.label}
                  </span>
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-indigo-600' : 'text-indigo-400'}`} />
                </div>
                <div className={`text-[11px] mt-0.5 ${isCurrent ? 'text-stone-600' : 'text-indigo-300'}`}>
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
        <div className="lg:col-span-7 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {segmentNames[activeSegmentIndex]}
          </span>

          {/* Big Digital Display */}
          <div className="my-6">
            <div className="text-6xl md:text-7xl font-mono font-black tracking-tight text-stone-900">
              {formatMinutesSeconds(timeLeft)}
            </div>
            <div className="mt-2 text-xs font-medium text-stone-500">
              {progressPercent}% of this block elapsed
            </div>

            {/* Progress bar */}
            <div className="w-64 h-2 bg-stone-100 rounded-full mx-auto mt-3 overflow-hidden border border-stone-200/60">
              <div 
                className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
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
              className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xs transition-all ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              <span>{isRunning ? 'Pause Timer' : 'Start Focus'}</span>
            </button>

            <button
              type="button"
              id="reset-study-timer-btn"
              onClick={resetCurrentTimer}
              className="p-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
              title="Reset current segment"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {activeSegmentIndex < 2 && (
              <button
                type="button"
                id="skip-study-segment-btn"
                onClick={() => switchSegment(activeSegmentIndex + 1)}
                className="px-4 py-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Next Stage</span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick preset adjustments */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500">
            <span>Quick adjust:</span>
            {[
              { label: '+5m', sec: 5 * 60 },
              { label: '+10m', sec: 10 * 60 },
              { label: 'Set 25m Pomodoro', sec: 25 * 60 },
            ].map(adj => (
              <button
                key={adj.label}
                type="button"
                onClick={() => setTimeLeft(prev => prev + adj.sec)}
                className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
              >
                {adj.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Topic Navigator & Log input based on active tab (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeSegmentIndex === 0 && (
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  70-Minute Core Split
                </span>
                <span className="text-xs text-stone-500">Daily Rotating</span>
              </div>

              {/* Selector for DSA vs LLD vs HLD */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-xl mb-4">
                {(['dsa', 'lld', 'hld'] as const).map(track => (
                  <button
                    key={track}
                    type="button"
                    onClick={() => {
                      setSelectedCoreTrack(track);
                      setSelectedSubtopic('');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg uppercase transition-colors ${
                      selectedCoreTrack === track
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {track}
                  </button>
                ))}
              </div>

              <div className="text-xs font-semibold text-stone-800 mb-2">
                {currentTrackData.subtitle} (Select Focus):
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {currentTrackData.topics.map(topic => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedSubtopic(topic)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center justify-between ${
                      selectedSubtopic === topic
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                        : 'bg-stone-50/70 hover:bg-stone-100 border-stone-200 text-stone-700'
                    }`}
                  >
                    <span>{topic}</span>
                    {selectedSubtopic === topic && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-2" />}
                  </button>
                ))}
              </div>

              <div className="mt-4 p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-600">
                <strong>Rule:</strong> Rotate every day between DSA, LLD, and HLD so all three disciplines build compounding muscle.
              </div>
            </div>
          )}

          {activeSegmentIndex === 1 && (
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  40-Minute AI & Agentic Prep
                </span>
                <span className="text-xs text-stone-500">Modern Architecture</span>
              </div>

              <p className="text-xs text-stone-600 mb-3">
                Focus on agent loops, function calling schemas, RAG vector retrieval, and multi-agent coordination.
              </p>

              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {AI_PREP_TRACK.topics.map(topic => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedAITopic(topic)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center justify-between ${
                      selectedAITopic === topic
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-stone-50/70 hover:bg-stone-100 border-stone-200 text-stone-700'
                    }`}
                  >
                    <span>{topic}</span>
                    {selectedAITopic === topic && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Segment 2: 10-min Log Form */}
          {activeSegmentIndex === 2 && (
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  10-Minute Daily Study Log
                </span>
                <span className="text-xs text-stone-500">Lock In Learnings</span>
              </div>
              <p className="text-xs text-stone-600 mb-3">
                Log what you covered to guarantee retention and identify weak patterns.
              </p>

              <form onSubmit={handleSaveLog} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    What did you cover tonight?
                  </label>
                  <textarea
                    rows={3}
                    value={logSummary}
                    onChange={(e) => setLogSummary(e.target.value)}
                    placeholder="e.g. Solved 2 monotonic queue problems. Reviewed ReAct agent prompt structure with tool schemas..."
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700">
                    Confidence Level:
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
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  id="save-daily-study-log-btn"
                  className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Save to Daily Study History
                </button>

                {logSavedToast && (
                  <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-medium">
                    Study log saved successfully!
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
