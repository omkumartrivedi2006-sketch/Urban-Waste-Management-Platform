import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Sun, 
  Moon, 
  ShieldAlert, 
  Settings as SettingsIcon
} from 'lucide-react';

export default function Settings() {
  const { showToast } = useToast();

  // Notification Preferences States
  const [prefPush, setPrefPush] = useState(true);
  const [prefEmail, setPrefEmail] = useState(true);
  const [prefSMS, setPrefSMS] = useState(false);
  const [prefAlerts, setPrefAlerts] = useState(true);

  // Theme Toggling State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Synchronize document theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}`, 'success');
  };

  const handleTogglePref = (pref: string, state: boolean, setter: (s: boolean) => void) => {
    setter(!state);
    showToast(`${pref} preference updated.`, 'success');
  };

  return (
    <div className="pt-24 pb-16 px-6 max-w-3xl mx-auto space-y-8 font-sans min-h-screen dark:bg-slate-950">
      
      {/* Header Banner */}
      <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-5 sm:p-6 rounded-3xl shadow-soft">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <SettingsIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-neutral-dark dark:text-white font-heading leading-tight">Settings & Preferences</h2>
          <p className="text-[10px] text-neutral-muted dark:text-gray-400 mt-0.5">Customize municipal platform notifications and UI templates.</p>
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Visual Theme Settings */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-soft space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-neutral-dark dark:text-white font-heading uppercase tracking-wider">Visual Aesthetics</h3>
            <p className="text-xs text-neutral-muted dark:text-gray-400 mt-1">Configure interface color variables and display templates.</p>
          </div>

          <div className="flex justify-between items-center p-4 bg-neutral-bg dark:bg-slate-800/40 border dark:border-gray-800 rounded-2xl">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <AnimatePresence mode="wait">
                  {theme === 'light' ? (
                    <motion.div
                      key="sun"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-5 h-5 text-amber-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-5 h-5 text-blue-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <h4 className="font-bold text-xs text-neutral-dark dark:text-white">Dark Color Scheme Mode</h4>
                <p className="text-[10px] text-neutral-muted dark:text-gray-400 mt-0.5">Toggle to darken dashboard interfaces and map overlays.</p>
              </div>
            </div>

            {/* Slider Switch */}
            <button
              onClick={handleToggleTheme}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                theme === 'dark' ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <motion.div 
                layout
                className="w-6 h-6 rounded-full bg-white shadow-md"
                animate={{ x: theme === 'dark' ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

        {/* Notifications Preferences */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-soft space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-neutral-dark dark:text-white font-heading uppercase tracking-wider">Alert Configurations</h3>
            <p className="text-xs text-neutral-muted dark:text-gray-400 mt-1">Configure your personal channel routing for municipal notifications.</p>
          </div>

          <div className="space-y-4">
            
            {/* Preference item 1 */}
            <div className="flex justify-between items-center p-3 border-b dark:border-gray-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-neutral-dark dark:text-white">Push Notifications</h4>
                  <p className="text-[9px] text-neutral-muted dark:text-gray-400 mt-0.5">Instant popup toasts when reported bin status changes.</p>
                </div>
              </div>
              
              <button
                onClick={() => handleTogglePref('Push Alerts', prefPush, setPrefPush)}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                  prefPush ? 'bg-primary' : 'bg-gray-350'
                }`}
              >
                <motion.div 
                  layout
                  className="w-5 h-5 rounded-full bg-white shadow"
                  animate={{ x: prefPush ? 16 : 0 }}
                />
              </button>
            </div>

            {/* Preference item 2 */}
            <div className="flex justify-between items-center p-3 border-b dark:border-gray-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-neutral-dark dark:text-white">Email Digest</h4>
                  <p className="text-[9px] text-neutral-muted dark:text-gray-400 mt-0.5">Receive copy records of verification and resolution tickets.</p>
                </div>
              </div>
              
              <button
                onClick={() => handleTogglePref('Email Alerts', prefEmail, setPrefEmail)}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                  prefEmail ? 'bg-primary' : 'bg-gray-350'
                }`}
              >
                <motion.div 
                  layout
                  className="w-5 h-5 rounded-full bg-white shadow"
                  animate={{ x: prefEmail ? 16 : 0 }}
                />
              </button>
            </div>

            {/* Preference item 3 */}
            <div className="flex justify-between items-center p-3 border-b dark:border-gray-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-neutral-dark dark:text-white">SMS Updates</h4>
                  <p className="text-[9px] text-neutral-muted dark:text-gray-400 mt-0.5">Send a SMS update for priority escalated dispatches.</p>
                </div>
              </div>
              
              <button
                onClick={() => handleTogglePref('SMS Alerts', prefSMS, setPrefSMS)}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                  prefSMS ? 'bg-primary' : 'bg-gray-350'
                }`}
              >
                <motion.div 
                  layout
                  className="w-5 h-5 rounded-full bg-white shadow"
                  animate={{ x: prefSMS ? 16 : 0 }}
                />
              </button>
            </div>

            {/* Preference item 4 */}
            <div className="flex justify-between items-center p-3 pb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-neutral-dark dark:text-white">Security Alerts</h4>
                  <p className="text-[9px] text-neutral-muted dark:text-gray-400 mt-0.5">Critical notifications regarding login updates or role changes.</p>
                </div>
              </div>
              
              <button
                onClick={() => handleTogglePref('Security Alerts', prefAlerts, setPrefAlerts)}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                  prefAlerts ? 'bg-primary' : 'bg-gray-350'
                }`}
              >
                <motion.div 
                  layout
                  className="w-5 h-5 rounded-full bg-white shadow"
                  animate={{ x: prefAlerts ? 16 : 0 }}
                />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
