import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Bell, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Clock
} from 'lucide-react';

export default function NotificationsCenter() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(await response.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const handleMarkAllRead = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/notifications/mark-read', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        showToast('All notifications marked as read.', 'success');
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error(error);
      showToast('Error updating notifications.', 'error');
    }
  };

  // Group notifications helper
  const getGroupedNotifications = () => {
    const today: any[] = [];
    const thisWeek: any[] = [];
    const earlier: any[] = [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfThisWeek = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);

    notifications.forEach((n) => {
      const date = new Date(n.createdAt);
      if (date >= startOfToday) {
        today.push(n);
      } else if (date >= startOfThisWeek) {
        thisWeek.push(n);
      } else {
        earlier.push(n);
      }
    });

    return { today, thisWeek, earlier };
  };

  const { today, thisWeek, earlier } = getGroupedNotifications();

  const renderNotificationItem = (n: any) => {
    const isUnread = !n.read;
    const date = new Date(n.createdAt);

    // Get matching icon based on notification title/type
    let Icon = Info;
    let iconColor = 'text-blue-500 bg-blue-50 dark:bg-blue-950/20';

    if (n.title.toLowerCase().includes('resolved') || n.title.toLowerCase().includes('success')) {
      Icon = CheckCircle2;
      iconColor = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';
    } else if (n.title.toLowerCase().includes('alert') || n.title.toLowerCase().includes('priority') || n.title.toLowerCase().includes('warn')) {
      Icon = AlertCircle;
      iconColor = 'text-amber-500 bg-amber-50 dark:bg-amber-950/20';
    }

    return (
      <motion.div
        key={n._id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        className={`p-4 rounded-2xl border dark:border-gray-800 transition-all duration-300 flex justify-between items-start gap-4 ${
          isUnread 
            ? 'bg-primary/5 border-primary/20 dark:bg-emerald-950/10' 
            : 'bg-white dark:bg-slate-900 border-gray-100'
        }`}
      >
        <div className="flex space-x-3.5">
          {/* Notification Icon */}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <h4 className={`text-xs font-bold leading-none ${isUnread ? 'text-neutral-dark dark:text-white font-extrabold' : 'text-neutral-muted dark:text-gray-400'}`}>
              {n.title}
            </h4>
            <p className="text-[11px] text-neutral-muted dark:text-gray-400 leading-normal">{n.description}</p>
            <span className="text-[9px] font-semibold text-neutral-muted/80 dark:text-gray-500 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {date.toLocaleDateString()}</span>
            </span>
          </div>
        </div>

        {/* Read/Unread pulse dot indicator */}
        {isUnread && (
          <div className="relative w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1">
            <span className="absolute -inset-1.5 rounded-full bg-primary opacity-45 animate-ping" />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="pt-24 pb-16 px-6 max-w-3xl mx-auto space-y-8 font-sans min-h-screen dark:bg-slate-950">
      
      {/* Header Banner */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-5 sm:p-6 rounded-3xl shadow-soft">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-neutral-dark dark:text-white font-heading leading-tight">Notifications Center</h2>
            <p className="text-[10px] text-neutral-muted dark:text-gray-400 mt-0.5">Chronological system alert logs.</p>
          </div>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="text-[10px] font-bold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/10 px-3.5 py-2 rounded-xl transition-all duration-300 flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => <div key={n} className="h-16 bg-white dark:bg-slate-900 rounded-2xl animate-pulse" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl text-center shadow-soft space-y-2">
          <Bell className="w-8 h-8 text-neutral-muted mx-auto" />
          <h4 className="font-extrabold text-sm text-neutral-dark dark:text-white">Clean Log Inbox</h4>
          <p className="text-xs text-neutral-muted dark:text-gray-400">You are completely up to date.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <AnimatePresence>
            
            {/* TODAY */}
            {today.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-extrabold text-neutral-muted dark:text-gray-450 uppercase tracking-widest pl-2">Today</h3>
                <div className="space-y-3">
                  {today.map(renderNotificationItem)}
                </div>
              </div>
            )}

            {/* THIS WEEK */}
            {thisWeek.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-extrabold text-neutral-muted dark:text-gray-450 uppercase tracking-widest pl-2 font-heading">This Week</h3>
                <div className="space-y-3">
                  {thisWeek.map(renderNotificationItem)}
                </div>
              </div>
            )}

            {/* EARLIER */}
            {earlier.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-extrabold text-neutral-muted dark:text-gray-450 uppercase tracking-widest pl-2">Earlier</h3>
                <div className="space-y-3">
                  {earlier.map(renderNotificationItem)}
                </div>
              </div>
            )}

          </AnimatePresence>
        </div>
      )}

    </div>
  );
}
