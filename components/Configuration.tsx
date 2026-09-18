import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Plus, Trash2, Clock, Calendar, Flag, Edit2, X } from 'lucide-react';
import { ScheduleItem } from '@/app/dashboard/page';
import { WeekendBlock, Phase } from '@/types';

interface Props {
  onScheduleChange?: () => void;
}

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
          {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
            <option key={h} value={h} className="text-black bg-white dark:bg-gray-800 dark:text-white">{h.toString().padStart(2, '0')}</option>
          ))}
        </select>

        <span className="font-bold text-black/40 dark:text-white/40">:</span>

        <select
          value={mins}
          onChange={(e) => updateTime(hours12, Number(e.target.value), isPM)}
          className="w-full px-2 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white appearance-none text-center cursor-pointer"
        >
          {Array.from({ length: 60 }, (_, i) => i).map(m => (
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

  const formatMinutesToAMPM = (m: number | string) => {
    const mins = Number(m || 0);
    const totalHrs = Math.floor(mins / 60);
    const mm = mins % 60;
    const isPM = totalHrs >= 12 && totalHrs < 24;
    let hrs12 = totalHrs % 12;
    if (hrs12 === 0) hrs12 = 12;
    return `${hrs12}:${mm.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
  };

  export const Configuration: React.FC<Props> = ({ onScheduleChange }) => {
  const { getToken, isSignedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<'weekday' | 'weekend' | 'phases'>('weekday');

  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [weekendSchedules, setWeekendSchedules] = useState<WeekendBlock[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingWeekdayId, setEditingWeekdayId] = useState<string | null>(null);
  const [editingWeekendId, setEditingWeekendId] = useState<string | null>(null);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);

  // Form states
  const [newSchedule, setNewSchedule] = useState({
    timeRange: '08:00 - 09:00',
    title: '',
    description: '',
    startMinutes: 480 as number | string,
    endMinutes: 540 as number | string
  });

  const [newWeekend, setNewWeekend] = useState({
    timeTitle: 'Morning Block',
    title: '',
    description: '',
    activities: '',
    keyRule: ''
  });

  const [newPhase, setNewPhase] = useState({
    number: 1 as number | string,
    title: '',
    startDate: '',
    endDate: '',
    milestoneGoal: '',
    primaryFocus: '',
    secondaryFocus: '',
    otherFocus: ''
  });

  const fetchData = async () => {
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [resWeekday, resWeekend, resPhases] = await Promise.all([
        fetch('/api/schedules', { headers }),
        fetch('/api/weekend-schedules', { headers }),
        fetch('/api/phases', { headers })
      ]);

      if (resWeekday.ok) setSchedules(await resWeekday.json());
      if (resWeekend.ok) setWeekendSchedules(await resWeekend.json());
      if (resPhases.ok) setPhases(await resPhases.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isSignedIn]);

  const handleAddWeekday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      const method = editingWeekdayId ? 'PUT' : 'POST';
      const url = editingWeekdayId ? `/api/schedules/${editingWeekdayId}` : '/api/schedules';

      const payload = {
        ...newSchedule,
        timeRange: `${formatMinutesToAMPM(newSchedule.startMinutes)} - ${formatMinutesToAMPM(newSchedule.endMinutes)}`
      };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Failed to ${editingWeekdayId ? 'edit' : 'add'} schedule`);
      await fetchData();
      onScheduleChange?.();
      setNewSchedule({ timeRange: '08:00 - 09:00', title: '', description: '', startMinutes: 480, endMinutes: 540 });
      setEditingWeekdayId(null);
    } catch (err: any) { setError(err.message); }
  };

  const handleAddWeekend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      const method = editingWeekendId ? 'PUT' : 'POST';
      const url = editingWeekendId ? `/api/weekend-schedules/${editingWeekendId}` : '/api/weekend-schedules';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...newWeekend,
          activities: typeof newWeekend.activities === 'string' ? newWeekend.activities.split(',').map(a => a.trim()).filter(Boolean) : newWeekend.activities
        })
      });
      if (!res.ok) throw new Error(`Failed to ${editingWeekendId ? 'edit' : 'add'} weekend schedule`);
      await fetchData();
      onScheduleChange?.();
      setNewWeekend({ timeTitle: 'Morning Block', title: '', description: '', activities: '', keyRule: '' });
      setEditingWeekendId(null);
    } catch (err: any) { setError(err.message); }
  };

  const handleAddPhase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      const method = editingPhaseId ? 'PUT' : 'POST';
      const url = editingPhaseId ? `/api/phases/${editingPhaseId}` : '/api/phases';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...newPhase,
          primaryFocus: typeof newPhase.primaryFocus === 'string' ? newPhase.primaryFocus.split(',').map(a => a.trim()).filter(Boolean) : newPhase.primaryFocus,
          secondaryFocus: typeof newPhase.secondaryFocus === 'string' ? newPhase.secondaryFocus.split(',').map(a => a.trim()).filter(Boolean) : newPhase.secondaryFocus,
          otherFocus: typeof newPhase.otherFocus === 'string' ? newPhase.otherFocus.split(',').map(a => a.trim()).filter(Boolean) : newPhase.otherFocus
        })
      });
      if (!res.ok) throw new Error(`Failed to ${editingPhaseId ? 'edit' : 'add'} phase`);
      await fetchData();
      onScheduleChange?.();
      setNewPhase({
        number: Number(newPhase.number) + 1,
        title: '',
        startDate: '',
        endDate: '',
        milestoneGoal: '',
        primaryFocus: '',
        secondaryFocus: '',
        otherFocus: ''
      });
      setEditingPhaseId(null);
    } catch (err: any) { setError(err.message); }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Failed to delete ${type}`);
      await fetchData();
      onScheduleChange?.();
    } catch (err: any) { setError(err.message); }
  };

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-black/50 dark:text-white/50">
        <Clock className="w-12 h-12 mb-4 opacity-50 text-black dark:text-white" />
        <p>Please sign in to configure your platform.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuration Tabs */}
      <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('weekday')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'weekday' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white'}`}
        >
          <Clock className="w-4 h-4" /> Weekday Blocks
        </button>
        <button
          onClick={() => setActiveTab('weekend')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'weekend' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white'}`}
        >
          <Calendar className="w-4 h-4" /> Weekend Blocks
        </button>
        <button
          onClick={() => setActiveTab('phases')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'phases' ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white'}`}
        >
          <Flag className="w-4 h-4" /> Project Phases
        </button>
      </div>

      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-200">{error}</div>}

      {/* WEEKDAY TAB */}
      {activeTab === 'weekday' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-[28px] p-6 shadow-2xl self-start text-black dark:text-white">
            <h2 className="text-lg font-bold text-black dark:text-white mb-4">{editingWeekdayId ? 'Edit Weekday Block' : 'Add Weekday Block'}</h2>
            <form onSubmit={handleAddWeekday} className="space-y-4">
              <input type="text" value={newSchedule.title} onChange={e => setNewSchedule({ ...newSchedule, title: e.target.value })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="Title" required />
              <input type="text" value={newSchedule.description} onChange={e => setNewSchedule({ ...newSchedule, description: e.target.value })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="Description" required />
              <div className="grid grid-cols-2 gap-4">
                <ExactTimeSelector
                  label="Start Time"
                  minutes={newSchedule.startMinutes}
                  onChange={(m) => setNewSchedule({ ...newSchedule, startMinutes: m })}
                />
                <ExactTimeSelector
                  label="End Time"
                  minutes={newSchedule.endMinutes}
                  onChange={(m) => setNewSchedule({ ...newSchedule, endMinutes: m })}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold hover:bg-black/80 dark:hover:bg-gray-200 transition-colors">
                  <Plus className="w-4 h-4" /> {editingWeekdayId ? 'Save Changes' : 'Add Weekday Block'}
                </button>
                {editingWeekdayId && (
                  <button type="button" onClick={() => { setEditingWeekdayId(null); setNewSchedule({ timeRange: '08:00 - 09:00', title: '', description: '', startMinutes: 480, endMinutes: 540 }); }} className="flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl text-sm font-bold transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-[28px] p-6 shadow-2xl text-black dark:text-white">
            <h2 className="text-lg font-bold text-black dark:text-white mb-4">Your Weekday Schedule</h2>
            {loading ? <p className="text-black/50 dark:text-white/50 text-sm">Loading...</p> : schedules.map(block => (
              <div key={block._id} className="flex justify-between items-start p-3 mb-2 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 backdrop-blur-md">
                <div>
                  <div className="text-xs font-mono font-semibold bg-black/10 dark:bg-white/10 text-black dark:text-white px-2 py-0.5 inline-block rounded border border-black/10 dark:border-white/10 mb-1">{block.timeRange}</div>
                  <div className="font-bold text-black dark:text-white">{block.title}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingWeekdayId(block._id || null); setNewSchedule({ timeRange: block.timeRange, title: block.title, description: block.description || '', startMinutes: block.startMinutes, endMinutes: block.endMinutes }); }} className="text-black/40 dark:text-white/40 hover:text-blue-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete('schedules', block._id!)} className="text-black/40 dark:text-white/40 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WEEKEND TAB */}
      {activeTab === 'weekend' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-[28px] p-6 shadow-2xl self-start text-black dark:text-white">
            <h2 className="text-lg font-bold text-black dark:text-white mb-4">{editingWeekendId ? 'Edit Weekend Block' : 'Add Weekend Block'}</h2>
            <form onSubmit={handleAddWeekend} className="space-y-4">
              <input type="text" value={newWeekend.timeTitle} onChange={e => setNewWeekend({ ...newWeekend, timeTitle: e.target.value })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="Time Title (e.g. Morning Block)" required />
              <input type="text" value={newWeekend.title} onChange={e => setNewWeekend({ ...newWeekend, title: e.target.value })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="Title" required />
              <textarea value={newWeekend.description} onChange={e => setNewWeekend({ ...newWeekend, description: e.target.value })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="Description" rows={2} required />
              <input type="text" value={newWeekend.activities} onChange={e => setNewWeekend({ ...newWeekend, activities: e.target.value })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="Activities (comma separated)" required />
              <input type="text" value={newWeekend.keyRule} onChange={e => setNewWeekend({ ...newWeekend, keyRule: e.target.value })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="Key Rule" required />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold hover:bg-black/80 dark:hover:bg-gray-200 transition-colors">
                  <Plus className="w-4 h-4" /> {editingWeekendId ? 'Save Changes' : 'Add Weekend Block'}
                </button>
                {editingWeekendId && (
                  <button type="button" onClick={() => { setEditingWeekendId(null); setNewWeekend({ timeTitle: 'Morning Block', title: '', description: '', activities: '', keyRule: '' }); }} className="flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl text-sm font-bold transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-[28px] p-6 shadow-2xl text-black dark:text-white">
            <h2 className="text-lg font-bold text-black dark:text-white mb-4">Your Weekend Schedule</h2>
            {loading ? <p className="text-black/50 dark:text-white/50 text-sm">Loading...</p> : weekendSchedules.map((block: any) => (
              <div key={block._id} className="flex justify-between items-start p-3 mb-2 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 backdrop-blur-md">
                <div>
                  <div className="text-xs font-mono font-semibold bg-black/10 dark:bg-white/10 text-black dark:text-white px-2 py-0.5 inline-block rounded border border-black/10 dark:border-white/10 mb-1">{block.timeTitle}</div>
                  <div className="font-bold text-black dark:text-white">{block.title}</div>
                  <div className="text-xs text-black/60 dark:text-white/60 mt-1">{block.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingWeekendId(block._id); setNewWeekend({ timeTitle: block.timeTitle, title: block.title, description: block.description, activities: block.activities?.join(', ') || '', keyRule: block.keyRule }); }} className="text-black/40 dark:text-white/40 hover:text-blue-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete('weekend-schedules', block._id)} className="text-black/40 dark:text-white/40 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASES TAB */}
      {activeTab === 'phases' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-[28px] p-6 shadow-2xl self-start text-black dark:text-white">
            <h2 className="text-lg font-bold text-black dark:text-white mb-4">{editingPhaseId ? 'Edit Phase' : 'Add Phase'}</h2>
            <form onSubmit={handleAddPhase} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={newPhase.number} onChange={e => setNewPhase({ ...newPhase, number: e.target.value === '' ? '' : parseInt(e.target.value) })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="Phase Number" required />
                <input type="text" value={newPhase.title} onChange={e => setNewPhase({ ...newPhase, title: e.target.value })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="Title" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={newPhase.startDate} onChange={e => setNewPhase({ ...newPhase, startDate: e.target.value })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="Start Date (e.g. Sept 17)" required />
                <input type="text" value={newPhase.endDate} onChange={e => setNewPhase({ ...newPhase, endDate: e.target.value })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="End Date" required />
              </div>
              <input type="text" value={newPhase.milestoneGoal} onChange={e => setNewPhase({ ...newPhase, milestoneGoal: e.target.value })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="Milestone Goal" required />
              <input type="text" value={newPhase.primaryFocus} onChange={e => setNewPhase({ ...newPhase, primaryFocus: e.target.value })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="Primary Focus (comma separated)" />
              <input type="text" value={newPhase.secondaryFocus} onChange={e => setNewPhase({ ...newPhase, secondaryFocus: e.target.value })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="Secondary Focus (comma separated)" />
              <input type="text" value={newPhase.otherFocus} onChange={e => setNewPhase({ ...newPhase, otherFocus: e.target.value })} className="w-full px-3 py-2 bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white placeholder-black/40 dark:placeholder-white/40" placeholder="Other Focus (comma separated)" />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold hover:bg-black/80 dark:hover:bg-gray-200 transition-colors">
                  <Plus className="w-4 h-4" /> {editingPhaseId ? 'Save Changes' : 'Add Phase'}
                </button>
                {editingPhaseId && (
                  <button type="button" onClick={() => { setEditingPhaseId(null); setNewPhase({ number: 1, title: '', startDate: '', endDate: '', milestoneGoal: '', primaryFocus: '', secondaryFocus: '', otherFocus: '' }); }} className="flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl text-sm font-bold transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-[28px] p-6 shadow-2xl text-black dark:text-white">
            <h2 className="text-lg font-bold text-black dark:text-white mb-4">Your Phases</h2>
            {loading ? <p className="text-black/50 dark:text-white/50 text-sm">Loading...</p> : phases.map((p: any) => (
              <div key={p._id} className="flex justify-between items-start p-3 mb-2 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 backdrop-blur-md">
                <div>
                  <div className="text-xs font-mono font-semibold bg-black/10 dark:bg-white/10 text-black dark:text-white px-2 py-0.5 inline-block rounded border border-black/10 dark:border-white/10 mb-1">Phase {p.number}</div>
                  <div className="font-bold text-black dark:text-white">{p.title}</div>
                  <div className="text-xs text-black/60 dark:text-white/60 mt-1">{p.startDate} - {p.endDate}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingPhaseId(p._id); setNewPhase({ number: p.number, title: p.title, startDate: p.startDate, endDate: p.endDate, milestoneGoal: p.milestoneGoal, primaryFocus: p.primaryFocus?.join(', ') || '', secondaryFocus: p.secondaryFocus?.join(', ') || '', otherFocus: p.otherFocus?.join(', ') || '' }); }} className="text-black/40 dark:text-white/40 hover:text-blue-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete('phases', p._id)} className="text-black/40 dark:text-white/40 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
