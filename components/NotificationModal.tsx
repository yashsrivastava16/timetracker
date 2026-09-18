import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Play, X, Check } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

interface NotificationModalProps {
  notification: {
    type: '15_min_before' | 'on_time';
    schedule: any;
  } | null;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ notification, onClose }) => {
  const { getToken } = useAuth();

  const handleAction = async (status: 'started' | 'ignored') => {
    if (!notification) return;

    try {
      const token = await getToken();
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          scheduleId: notification.schedule._id,
          title: notification.schedule.title,
          status,
          eventTime: new Date().toISOString()
        })
      });
    } catch (err) {
      console.error("Failed to save log:", err);
    } finally {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {notification && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50"
            onClick={() => handleAction('ignored')}
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm z-50"
          >
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl ${notification.type === 'on_time' ? 'bg-gray-100 text-gray-600 dark:bg-gray-900/50 dark:text-gray-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-900/50 dark:text-gray-400'}`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {notification.type === 'on_time' ? "Time to Start!" : "Upcoming in 15 mins"}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium font-mono">
                      {notification.schedule.timeRange}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 mb-5">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{notification.schedule.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.schedule.description}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction('started')}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Start Now
                  </button>
                  <button
                    onClick={() => handleAction('ignored')}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Ignore
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
