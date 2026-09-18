import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Star, 
  Plus, 
  Trash2, 
  Code2, 
  Bot, 
  Search,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { DailyLogEntry } from '../types';

interface Props {
  logs: DailyLogEntry[];
  onAddLog: (entry: Omit<DailyLogEntry, 'id' | 'timestamp'>) => void;
  onDeleteLog: (id: string) => void;
}

export const StudyLogHistory: React.FC<Props> = ({ logs, onAddLog, onDeleteLog }) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Quick add state
  const [primaryTask, setprimaryTask] = useState<string>('');
  const [secondaryTask, setsecondaryTask] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;

    const offset = new Date().getTimezoneOffset() * 60000;
    const localDate = new Date(Date.now() - offset).toISOString().split('T')[0];

    onAddLog({
      date: localDate,
      primaryTask,
      secondaryTask,
      summary,
      confidenceScore: confidence,
      completedBlocks: ['deep-work'],
    });

    setSummary('');
    setShowAddModal(false);
  };

  const filteredLogs = logs.filter(log => {
    const q = searchQuery.toLowerCase();
    return (
      log.primaryTask.toLowerCase().includes(q) ||
      log.secondaryTask.toLowerCase().includes(q) ||
      log.summary.toLowerCase().includes(q) ||
      log.date.includes(q)
    );
  });

  return (
    <div id="study-log-history-view" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[28px] bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 text-black dark:text-white shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
              10-Minute Log Archive
            </span>
            <span className="text-xs text-black/50 dark:text-white/50">• Continuous Knowledge Repository</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white mt-1">
            Daily Study Logs & Learnings
          </h2>
          <p className="text-xs md:text-sm text-black/70 dark:text-white/70 mt-1 max-w-xl font-normal leading-relaxed">
            "10 min log what you covered." Capturing problem takeaways, edge-case bugs, and system-design trade-offs every night.
          </p>
        </div>

        <button
          type="button"
          id="open-add-log-modal-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-2xl bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 border border-black/10 dark:border-white/10 text-black dark:text-white text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Daily Entry</span>
        </button>
      </div>

      {/* Search & Filter bar */}
      <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 backdrop-blur-md p-3 rounded-[28px] border border-black/10 dark:border-white/10 shadow-xl">
        <Search className="w-4 h-4 text-black/50 dark:text-white/50 shrink-0 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by topic, keyword, or date..."
          className="w-full text-xs text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none bg-transparent"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Modal / Inline Add Form */}
      {showAddModal && (
        <div className="p-5 rounded-[28px] border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-black dark:text-white">Record Today's Study Log (10 min)</h3>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="text-xs text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-black/80 dark:text-white/80 mb-1">
                  Primary Task / Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. System Architecture"
                  value={primaryTask}
                  onChange={(e) => setprimaryTask(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-black/20 dark:border-white/20 bg-black/5 dark:bg-black/20 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-black/80 dark:text-white/80 mb-1">
                  Secondary Task / Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. API Integration"
                  value={secondaryTask}
                  onChange={(e) => setsecondaryTask(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-black/20 dark:border-white/20 bg-black/5 dark:bg-black/20 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-black/80 dark:text-white/80 mb-1">
                Takeaways, Problems Solved, or Gotchas
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="What clicked today? Any edge cases or architectural bottlenecks to remember?"
                className="w-full text-xs p-2.5 rounded-xl border border-black/20 dark:border-white/20 bg-black/5 dark:bg-black/20 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-black/80 dark:text-white/80">Confidence:</span>
                <div className="flex gap-1">
                  {([1, 2, 3, 4, 5] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setConfidence(s)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          s <= confidence ? 'text-black fill-black dark:text-white dark:fill-white' : 'text-black/20 dark:text-white/20'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-gray-200 text-xs font-bold transition-colors"
              >
                Save Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="p-8 text-center rounded-[28px] border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl">
          <BookOpen className="w-8 h-8 text-black/30 dark:text-white/30 mx-auto mb-2" />
          <p className="text-sm font-semibold text-black dark:text-white">No logs found</p>
          <p className="text-xs text-black/50 dark:text-white/50 mt-1">
            Complete your 8:50 – 10:50 PM study block to log your first takeaways.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map(log => (
            <div
              key={log.id || (log as any)._id}
              className="p-4 rounded-[24px] border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all shadow-xl backdrop-blur-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-black dark:text-white bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded border border-black/10 dark:border-white/10">
                    {log.date}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < log.confidenceScore ? 'text-black fill-black dark:text-white dark:fill-white' : 'text-black/20 dark:text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteLog(log.id || (log as any)._id)}
                  className="text-black/40 dark:text-white/40 hover:text-black/80 dark:hover:text-white/80 transition-colors p-1 self-end sm:self-auto"
                  title="Delete log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Topics badges */}
              <div className="flex flex-wrap gap-2 my-2.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-black/10 dark:bg-white/10 text-black/90 dark:text-white/90 border border-black/10 dark:border-white/10">
                  {log.primaryTask}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-black/10 dark:bg-white/10 text-black/90 dark:text-white/90 border border-black/10 dark:border-white/10">
                  {log.secondaryTask}
                </span>
              </div>

              <p className="text-xs md:text-sm text-black/80 dark:text-white/80 leading-relaxed font-normal whitespace-pre-line">
                {log.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
