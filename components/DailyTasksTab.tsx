"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { CheckCircle2, Circle, Trash2, Plus, Bell, CheckSquare } from 'lucide-react';
import { Toast } from './Toast';

const ExactTimeSelector = ({ 
  label, 
  minutes, 
  onChange 
}: { 
  label: string; 
  minutes: number | string; 
  onChange: (m: number) => void 
}) => {
  const m = Number(minutes || 0);
  const totalHrs = Math.floor(m / 60);
  const mins = m % 60;
  
  const isPM = totalHrs >= 12 && totalHrs < 24;
  let hours12 = totalHrs % 12;
  if (hours12 === 0) hours12 = 12;

  const updateTime = (newH12: number, newMins: number, newIsPM: boolean) => {
    let hrs24 = newH12 === 12 ? 0 : newH12;
    if (newIsPM) hrs24 += 12;
    onChange(hrs24 * 60 + newMins);
  };

  return (
    <div className="flex flex-col">
      <label className="text-xs font-semibold text-black/60 dark:text-white/60 mb-1 ml-1">{label}</label>
      <div className="flex items-center gap-1.5">
        <select 
          value={hours12} 
          onChange={(e) => updateTime(Number(e.target.value), mins, isPM)}
          className="w-full px-2 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white appearance-none text-center cursor-pointer"
        >
          {Array.from({length: 12}, (_, i) => i + 1).map(h => (
            <option key={h} value={h} className="text-black bg-white dark:bg-gray-800 dark:text-white">{h.toString().padStart(2, '0')}</option>
          ))}
        </select>
        
        <span className="font-bold text-black/40 dark:text-white/40">:</span>
        
        <select 
          value={mins} 
          onChange={(e) => updateTime(hours12, Number(e.target.value), isPM)}
          className="w-full px-2 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white appearance-none text-center cursor-pointer"
        >
          {Array.from({length: 60}, (_, i) => i).map(m => (
            <option key={m} value={m} className="text-black bg-white dark:bg-gray-800 dark:text-white">{m.toString().padStart(2, '0')}</option>
          ))}
        </select>

        <select 
          value={isPM ? 'PM' : 'AM'} 
          onChange={(e) => updateTime(hours12, mins, e.target.value === 'PM')}
          className="w-full px-2 py-2 bg-black/10 dark:bg-black/40 border border-black/20 dark:border-white/20 rounded-xl text-sm font-bold text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white appearance-none text-center cursor-pointer ml-1"
        >
          <option value="AM" className="text-black bg-white dark:bg-gray-800 dark:text-white">AM</option>
          <option value="PM" className="text-black bg-white dark:bg-gray-800 dark:text-white">PM</option>
        </select>
      </div>
    </div>
  );
};

export const DailyTasksTab = () => {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const getInitialMinutes = () => {
    const now = new Date();
    // Default to +1 hour
    now.setHours(now.getHours() + 1);
    return now.getHours() * 60 + now.getMinutes();
  };

  const [reminderMinutes, setReminderMinutes] = useState(getInitialMinutes());
  const [useCustomTime, setUseCustomTime] = useState(false);

  const fetchTasks = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/daily-tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const token = await getToken();
      const payload = {
        title,
        description,
        reminderMinutes: useCustomTime ? reminderMinutes : getInitialMinutes()
      };

      const res = await fetch('/api/daily-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setToast({ message: 'Task added successfully!', type: 'success' });
        setTitle('');
        setDescription('');
        setUseCustomTime(false);
        setReminderMinutes(getInitialMinutes());
        fetchTasks();
      } else {
        throw new Error('Failed to add task');
      }
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    try {
      const token = await getToken();
      const res = await fetch(`/api/daily-tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ completed: !currentStatus })
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`/api/daily-tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setToast({ message: 'Task deleted', type: 'success' });
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatMinutesToAMPM = (m: number) => {
    const mins = Number(m || 0);
    const totalHrs = Math.floor(mins / 60);
    const mm = mins % 60;
    const isPM = totalHrs >= 12 && totalHrs < 24;
    let hrs12 = totalHrs % 12;
    if (hrs12 === 0) hrs12 = 12;
    return `${hrs12}:${mm.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
  };

  if (loading) {
    return <div className="p-8 text-center text-white/50 animate-pulse">Loading tasks...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {toast && <Toast message={toast.message} visible={true} onClose={() => setToast(null)} />}

      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-[28px] p-8 shadow-2xl">
        <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
          <CheckSquare className="w-5 h-5" /> Add New Task
        </h2>
        <form onSubmit={handleAddTask} className="space-y-5">
          <div>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full px-4 py-3 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" 
              placeholder="Task Title" 
              required 
            />
          </div>
          <div>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="w-full px-4 py-3 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40 resize-none h-24" 
              placeholder="Description (Optional)" 
            />
          </div>

          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-black dark:text-white">
                <Bell className="w-4 h-4" />
                <span className="font-semibold text-sm">Set Reminder</span>
              </div>
              <label className="flex items-center cursor-pointer gap-2">
                <span className="text-xs text-black/60 dark:text-white/60 font-medium">
                  {useCustomTime ? 'Custom Time' : 'Default (In 1 Hour)'}
                </span>
                <input 
                  type="checkbox" 
                  checked={useCustomTime} 
                  onChange={(e) => setUseCustomTime(e.target.checked)}
                  className="w-4 h-4 accent-black dark:accent-white cursor-pointer"
                />
              </label>
            </div>
            
            {useCustomTime && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <ExactTimeSelector 
                  label="Remind me at" 
                  minutes={reminderMinutes} 
                  onChange={setReminderMinutes} 
                />
              </div>
            )}
          </div>

          <button type="submit" className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform">
            <Plus className="w-5 h-5" /> Add Task
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-black dark:text-white px-2">Your Tasks</h3>
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-black/40 dark:text-white/40">
            No tasks yet. Add one above!
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task._id} 
              className={`bg-white/60 dark:bg-black/60 backdrop-blur-md border border-black/5 dark:border-white/5 p-5 rounded-2xl flex items-start gap-4 transition-all duration-300 ${task.completed ? 'opacity-50 grayscale' : 'hover:border-black/20 dark:hover:border-white/20'}`}
            >
              <button 
                onClick={() => toggleTask(task._id, task.completed)}
                className="mt-1 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
              >
                {task.completed ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6" />}
              </button>
              
              <div className="flex-1">
                <h4 className={`font-bold text-black dark:text-white text-lg ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
                {task.description && (
                  <p className="text-black/60 dark:text-white/60 text-sm mt-1">{task.description}</p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs font-semibold text-black/70 dark:text-white/70">
                    <Bell className="w-3 h-3" />
                    {formatMinutesToAMPM(task.reminderMinutes)}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => deleteTask(task._id)}
                className="text-black/20 dark:text-white/20 hover:text-red-500 dark:hover:text-red-500 transition-colors p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
