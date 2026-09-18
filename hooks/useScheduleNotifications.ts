import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface Schedule {
  _id: string;
  timeRange: string;
  title: string;
  description: string;
  startMinutes: number;
  endMinutes: number;
}

export const useScheduleNotifications = () => {
  const { getToken, isSignedIn } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activeNotification, setActiveNotification] = useState<{
    type: '15_min_before' | 'on_time';
    schedule: Schedule;
  } | null>(null);

  // Track which notifications have already been shown today
  const [shownNotifications, setShownNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isSignedIn) return;

    const fetchSchedules = async () => {
      try {
        const token = await getToken();
        const res = await fetch('/api/schedules', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSchedules(data);
        }
      } catch (err) {
        console.error("Error fetching schedules for notifications:", err);
      }
    };
    
    fetchSchedules();
  }, [isSignedIn, getToken]);

  useEffect(() => {
    if (!isSignedIn || schedules.length === 0) return;

    const checkTime = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      schedules.forEach(schedule => {
        // 15 minutes before
        if (currentMinutes === schedule.startMinutes - 15) {
          const notifKey = `${schedule._id}-15min-${now.toDateString()}`;
          if (!shownNotifications.has(notifKey)) {
            setActiveNotification({ type: '15_min_before', schedule });
            setShownNotifications(prev => new Set(prev).add(notifKey));
          }
        }

        // Exactly on time
        if (currentMinutes === schedule.startMinutes) {
          const notifKey = `${schedule._id}-ontime-${now.toDateString()}`;
          if (!shownNotifications.has(notifKey)) {
            setActiveNotification({ type: 'on_time', schedule });
            setShownNotifications(prev => new Set(prev).add(notifKey));
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkTime, 60000);
    checkTime(); // Check immediately on mount

    return () => clearInterval(interval);
  }, [isSignedIn, schedules, shownNotifications]);

  const clearNotification = () => setActiveNotification(null);

  return {
    activeNotification,
    clearNotification
  };
};
