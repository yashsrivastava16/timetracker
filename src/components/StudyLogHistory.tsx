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
  const [dsaTopic, setDsaTopic] = useState<string>('DSA: Sliding Window & Two Pointers');
  const [aiTopic, setAiTopic] = useState<string>('ReAct Agent Loop & Function Calling');
  const [summary, setSummary] = useState<string>('');
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;

    onAddLog({
      date: new Date().toISOString().split('T')[0],
      dsaTopic,
      aiTopic,
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
      log.dsaTopic.toLowerCase().includes(q) ||
      log.aiTopic.toLowerCase().includes(q) ||
      log.summary.toLowerCase().includes(q) ||
      log.date.includes(q)
    );
  });

  return (
    <div id="study-log-history-view" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-stone-900 text-white shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              10-Minute Log Archive
            </span>
            <span className="text-xs text-stone-400">• Continuous Knowledge Repository</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
            Daily Study Logs & Learnings
          </h2>
          <p className="text-xs md:text-sm text-stone-300 mt-1 max-w-xl font-normal leading-relaxed">
            "10 min log what you covered." Capturing problem takeaways, edge-case bugs, and system-design trade-offs every night.
          </p>
        </div>

        <button
          type="button"
          id="open-add-log-modal-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Daily Entry</span>
        </button>
      </div>

      {/* Search & Filter bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200">
        <Search className="w-4 h-4 text-stone-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by topic, keyword, or date..."
          className="w-full text-xs text-stone-800 placeholder-stone-400 focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-stone-400 hover:text-stone-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* Modal / Inline Add Form */}
      {showAddModal && (
        <div className="p-5 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">Record Today's Study Log (10 min)</h3>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="text-xs text-stone-500 hover:text-stone-800"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Core Topic (DSA / LLD / HLD)
                </label>
                <input
                  type="text"
                  value={dsaTopic}
                  onChange={(e) => setDsaTopic(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  AI / Agentic Systems Topic
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Takeaways, Problems Solved, or Gotchas
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="What clicked today? Any edge cases or architectural bottlenecks to remember?"
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-700">Confidence:</span>
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
                          s <= confidence ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
              >
                Save Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-stone-200 bg-white">
          <BookOpen className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-stone-700">No logs found</p>
          <p className="text-xs text-stone-500 mt-1">
            Complete your 8:50 – 10:50 PM study block to log your first takeaways.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map(log => (
            <div
              key={log.id}
              className="p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-all shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                    {log.date}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < log.confidenceScore ? 'text-amber-400 fill-amber-400' : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteLog(log.id)}
                  className="text-stone-400 hover:text-rose-600 transition-colors p-1 self-end sm:self-auto"
                  title="Delete log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Topics badges */}
              <div className="flex flex-wrap gap-2 my-2.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <Code2 className="w-3 h-3" />
                  {log.dsaTopic}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                  <Bot className="w-3 h-3" />
                  {log.aiTopic}
                </span>
              </div>

              <p className="text-xs md:text-sm text-stone-700 leading-relaxed font-normal whitespace-pre-line">
                {log.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
