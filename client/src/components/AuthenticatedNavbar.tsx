import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Recycle, 
  Bell, 
  LogOut, 
  User as UserIcon, 
  Settings, 
  ChevronDown, 
  Award,
  CheckCircle2
} from 'lucide-react';

export default function AuthenticatedNavbar() {
  const { user, token, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Track toasted notifications in this session
  const toastedIds = useRef<Set<string>>(new Set());
  const sessionStart = useRef(new Date());

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5001/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);

        // Toast new unread notifications that were created after sessionStart
        data.forEach((notification: any) => {
          const isNew = new Date(notification.createdAt) > sessionStart.current;
          if (isNew && !notification.read && !toastedIds.current.has(notification._id)) {
            toastedIds.current.add(notification._id);
            showToast(notification.description, notification.type === 'points_earned' ? 'success' : 'info');
          }
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 8000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/notifications/mark-read', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        showToast('All notifications marked as read', 'success');
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  // Set colors based on role
  const roleColors = {
    'Citizen': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Driver': 'bg-cyan-50 text-cyan-700 border-cyan-100',
    'Municipal Admin': 'bg-rose-50 text-rose-700 border-rose-100'
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-white/80 border-b border-gray-100 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left section: Logo */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent-lime flex items-center justify-center text-white shadow-sm transition-premium group-hover:rotate-12">
              <Recycle className="w-5 h-5" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-neutral-dark flex items-center">
              UWMP
              <span className="w-1 h-1 rounded-full bg-accent-lime ml-1"></span>
            </span>
          </Link>

          {/* Role badge */}
          <span className={`hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${roleColors[user.role]}`}>
            {user.role} Portal
          </span>
        </div>

        {/* Right section: Actions & Profile */}
        <div className="flex items-center space-x-4">
          
          {/* Notifications Bell */}
          <div className="relative" ref={notificationsRef}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsDropdownOpen(false);
              }}
              className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-premium p-2 z-50 origin-top-right"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-50 mb-1">
                    <span className="font-semibold text-sm text-neutral-dark">Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs font-semibold text-primary hover:text-primary-light transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-1">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs font-semibold text-neutral-muted">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        let Icon = Bell;
                        let colorClass = 'text-primary bg-emerald-50';

                        if (notification.type === 'status_change') {
                          Icon = CheckCircle2;
                          colorClass = 'text-cyan-500 bg-cyan-50';
                        } else if (notification.type === 'points_earned') {
                          Icon = Award;
                          colorClass = 'text-amber-500 bg-amber-50';
                        }

                        return (
                          <div
                            key={notification._id}
                            className={`p-3 rounded-xl flex items-start space-x-3 transition-colors ${
                              notification.read ? 'hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg flex-shrink-0 ${colorClass}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 space-y-0.5 text-left">
                              <p className={`text-xs leading-normal ${notification.read ? 'text-neutral-dark font-semibold' : 'text-neutral-dark font-extrabold'}`}>
                                {notification.title}
                              </p>
                              <p className="text-[11px] text-neutral-muted leading-tight">
                                {notification.description}
                              </p>
                              <p className="text-[10px] text-gray-400 font-medium">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-primary-light mt-2 flex-shrink-0" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="border-t border-gray-50 mt-1 pt-1.5 pb-0.5 text-center">
                    <button
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        navigate('/notifications');
                      }}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      View All Notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center space-x-2.5 p-1 pr-3 border border-gray-100 bg-gray-50 rounded-2xl hover:border-gray-200 transition-colors"
            >
              <img
                src={user.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-8 h-8 rounded-xl bg-gray-200 object-cover"
              />
              <span className="hidden md:inline-block text-xs font-semibold text-neutral-dark max-w-[100px] truncate">
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Avatar Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-premium p-1.5 z-50 origin-top-right"
                >
                  {/* User brief info */}
                  <div className="px-3 py-2.5 border-b border-gray-50 mb-1">
                    <p className="text-xs font-bold text-neutral-dark truncate">{user.name}</p>
                    <p className="text-[10px] text-neutral-muted truncate">{user.email}</p>
                    {user.role === 'Citizen' && (
                      <div className="flex items-center space-x-1 mt-1 text-[11px] text-emerald-600 font-bold bg-emerald-50/50 px-1.5 py-0.5 rounded-lg w-max">
                        <Award className="w-3.5 h-3.5" />
                        <span>{user.points} Recycle Points</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full px-3 py-2 rounded-xl flex items-center space-x-2.5 text-xs font-semibold text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors text-left"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>

                  {user.role === 'Citizen' && (
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/rewards');
                      }}
                      className="w-full px-3 py-2 rounded-xl flex items-center space-x-2.5 text-xs font-semibold text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors text-left"
                    >
                      <Award className="w-4 h-4" />
                      <span>Rewards</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full px-3 py-2 rounded-xl flex items-center space-x-2.5 text-xs font-semibold text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors text-left"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-gray-50 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 rounded-xl flex items-center space-x-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </nav>
  );
}
