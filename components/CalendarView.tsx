import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { DailyLogEntry } from '../types';

interface Props {
  logs: DailyLogEntry[];
}

export const CalendarView: React.FC<Props> = ({ logs }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const formatLocalDateString = (date: Date) => {
    const offset = date.getTimezoneOffset()
    const safeDate = new Date(date.getTime() - (offset * 60 * 1000))
    return safeDate.toISOString().split('T')[0]
  }

  // Map logs by date string for O(1) lookup
  const logsByDate = logs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = [];
    }
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, DailyLogEntry[]>);

  const selectedDateStr = selectedDate ? formatLocalDateString(selectedDate) : '';
  const selectedLogs = selectedDateStr ? logsByDate[selectedDateStr] || [] : [];

  const renderCells = () => {
    const cells = [];
    // empty cells before 1st of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="h-12 border border-transparent"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth, day);
      const dateStr = formatLocalDateString(dateObj);
      const dayLogs = logsByDate[dateStr] || [];
      const hasLogs = dayLogs.length > 0;

      const isSelected = selectedDateStr === dateStr;

      cells.push(
        <button
          key={day}
          onClick={() => setSelectedDate(dateObj)}
          className={`h-12 md:h-16 flex flex-col items-center justify-center border rounded-xl transition-all relative ${isSelected
              ? 'border-black dark:border-white bg-black/20 dark:bg-white/20'
              : 'border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 hover:bg-white/60 dark:hover:bg-black/60'
            }`}
        >
          <span className={`text-xs md:text-sm font-semibold ${isSelected ? 'text-black dark:text-white' : 'text-black/70 dark:text-white/70'}`}>
            {day}
          </span>
          {hasLogs && (
            <div className="absolute bottom-2 flex gap-1">
              {dayLogs.slice(0, 3).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              ))}
              {dayLogs.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-50"></div>}
            </div>
          )}
        </button>
      );
    }
    return cells;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-[28px] p-6 shadow-2xl">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-black/10 dark:bg-white/10 rounded-xl">
              <CalendarIcon className="w-5 h-5 text-black dark:text-white" />
            </div>
            <h2 className="text-xl font-bold text-black dark:text-white">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {renderCells()}
        </div>

      </div>

      {selectedDate && (
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-[28px] p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-black dark:text-white mb-4 border-b border-black/10 dark:border-white/10 pb-3">
            Logs for {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>

          {selectedLogs.length === 0 ? (
            <div className="py-8 text-center text-black/50 dark:text-white/50 text-sm">
              No logs recorded on this date.
            </div>
          ) : (
            <div className="space-y-4">
              {selectedLogs.map(log => (
                <div key={log.id || (log as any)._id} className="p-4 rounded-[24px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-black dark:text-white">{log.primaryTask}</h4>
                      {log.secondaryTask && <p className="text-sm text-black/60 dark:text-white/60">{log.secondaryTask}</p>}
                    </div>
                  </div>
                  <p className="text-sm text-black/80 dark:text-white/80 mt-2 whitespace-pre-wrap leading-relaxed">
                    {log.summary}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
