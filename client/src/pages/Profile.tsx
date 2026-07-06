import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Shield, 
  Lock, 
  Camera, 
  Check, 
  AlertCircle,
  TrendingUp,
  Award,
  Truck
} from 'lucide-react';

export default function Profile() {
  const { user, token, updateUserLocal } = useAuth();
  const { showToast } = useToast();

  // Edit details states
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Avatar Upload States
  const [avatar, setAvatar] = useState(user?.profileImage || '');
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempAvatar, setTempAvatar] = useState('');
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0); // 0 to 3
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Activity stats
  const [stats, setStats] = useState({ reported: 0, resolved: 0, vehicles: 0 });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setAvatar(user.profileImage || '');
    }
  }, [user]);

  // Dynamic Activity stats loading
  useEffect(() => {
    const loadStats = async () => {
      try {
        if (user?.role === 'Citizen') {
          const res = await fetch('http://localhost:5001/api/complaints');
          if (res.ok) {
            const data = await res.json();
            const reported = data.length;
            const resolved = data.filter((c: any) => c.status === 'Resolved').length;
            setStats({ reported, resolved, vehicles: 0 });
          }
        } else if (user?.role === 'Driver') {
          const res = await fetch('http://localhost:5001/api/routes/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            const resolved = data.optimizedOrder?.filter((s: any) => s.status === 'Collected').length || 14;
            setStats({ reported: 0, resolved, vehicles: 1 });
          }
        } else if (user?.role === 'Municipal Admin') {
          const res = await fetch('http://localhost:5001/api/analytics/kpis', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setStats({ reported: data.totalComplaints, resolved: data.resolvedToday, vehicles: data.activeVehicles });
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (user && token) {
      loadStats();
    }
  }, [user, token]);

  // Check password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }
    let strength = 0;
    if (newPassword.length >= 6) strength += 1;
    if (/[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    setPasswordStrength(strength);
  }, [newPassword]);

  // Submit profile details change
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, phone, address, profileImage: avatar })
      });

      if (response.ok) {
        showToast('Profile updated successfully!', 'success');
        setIsEditing(false);
        updateUserLocal({ name, phone, address, profileImage: avatar });
      } else {
        showToast('Failed to update profile.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Connection error.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Password update
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch('http://localhost:5001/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (response.ok) {
        showToast('Password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await response.json();
        showToast(data.message || 'Error updating password.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Connection error.', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle avatar upload click
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatar(reader.result as string);
        setCropOffset({ x: 0, y: 0 });
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag crop calculation mocks
  const handleDrag = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.movementX;
      const deltaY = e.movementY;
      setCropOffset(prev => ({
        x: Math.max(-50, Math.min(50, prev.x + deltaX)),
        y: Math.max(-50, Math.min(50, prev.y + deltaY))
      }));
    }
  };

  const handleApplyCrop = () => {
    setAvatar(tempAvatar);
    setShowCropModal(false);
    showToast('Crop preview applied! Save profile to sync.', 'info');
  };

  return (
    <div className="pt-24 pb-16 px-6 max-w-4xl mx-auto space-y-8 font-sans min-h-screen dark:bg-slate-950">
      
      {/* Animated Cover and Avatar Section */}
      <div className="relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-soft">
        {/* Cover Background */}
        <div className="h-36 bg-gradient-eco relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Profile Details Header */}
        <div className="px-6 pb-6 pt-16 relative flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4">
          
          {/* Avatar overlay */}
          <div className="absolute -top-14 left-6 sm:left-8 group">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-neutral-bg shadow-md relative">
              <img 
                src={avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.name || 'user')}`} 
                alt="Avatar" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                style={{ transform: `translate(${cropOffset.x}px, ${cropOffset.y}px)` }}
              />
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                <Camera className="w-5 h-5 text-white" />
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="text-center sm:text-left mt-2 sm:mt-0 sm:pl-28">
            <h2 className="text-xl font-extrabold text-neutral-dark dark:text-white font-heading">{user?.name}</h2>
            <p className="text-xs text-neutral-muted dark:text-gray-400 mt-0.5">{user?.role} • Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 border rounded-xl text-xs font-bold transition-colors ${
              isEditing 
                ? 'bg-gray-50 dark:bg-slate-800 text-neutral-dark dark:text-white' 
                : 'bg-primary hover:bg-primary-light text-white shadow-soft'
            }`}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {user?.role === 'Citizen' ? (
          <>
            <div className="bg-white dark:bg-slate-900 border dark:border-gray-800 p-5 rounded-3xl shadow-soft flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Reported Issues</p>
                <h3 className="text-xl font-extrabold text-neutral-dark dark:text-white mt-1 font-heading">{stats.reported}</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border dark:border-gray-800 p-5 rounded-3xl shadow-soft flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Resolved Issues</p>
                <h3 className="text-xl font-extrabold text-neutral-dark dark:text-white mt-1 font-heading">{stats.resolved}</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border dark:border-gray-800 p-5 rounded-3xl shadow-soft flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Recycle Points</p>
                <h3 className="text-xl font-extrabold text-neutral-dark dark:text-white mt-1 font-heading">{user?.points} pts</h3>
              </div>
            </div>
          </>
        ) : user?.role === 'Driver' ? (
          <>
            <div className="bg-white dark:bg-slate-900 border dark:border-gray-800 p-5 rounded-3xl shadow-soft flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Assigned Truck</p>
                <h3 className="text-xl font-extrabold text-neutral-dark dark:text-white mt-1 font-heading">Eco-Cab #08</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border dark:border-gray-800 p-5 rounded-3xl shadow-soft flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Stops Completed</p>
                <h3 className="text-xl font-extrabold text-neutral-dark dark:text-white mt-1 font-heading">{stats.resolved}</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border dark:border-gray-800 p-5 rounded-3xl shadow-soft flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Active Status</p>
                <h3 className="text-xl font-extrabold text-neutral-dark dark:text-white mt-1 font-heading">On Duty</h3>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-slate-900 border dark:border-gray-800 p-5 rounded-3xl shadow-soft flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-600 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Active Incidents</p>
                <h3 className="text-xl font-extrabold text-neutral-dark dark:text-white mt-1 font-heading">{stats.reported}</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border dark:border-gray-800 p-5 rounded-3xl shadow-soft flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Registered Fleet</p>
                <h3 className="text-xl font-extrabold text-neutral-dark dark:text-white mt-1 font-heading">{stats.vehicles}</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border dark:border-gray-800 p-5 rounded-3xl shadow-soft flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">System Role</p>
                <h3 className="text-xl font-extrabold text-neutral-dark dark:text-white mt-1 font-heading">Admin Console</h3>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Form Details */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-soft space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-neutral-dark dark:text-white font-heading uppercase tracking-wider">Account Specifications</h3>
            <p className="text-xs text-neutral-muted dark:text-gray-400 mt-1">Review or update your personal account details.</p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-muted dark:text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                <UserIcon className="w-3.5 h-3.5" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-150 dark:border-gray-700 bg-white dark:bg-slate-800 text-xs focus:border-primary outline-none transition-all disabled:opacity-60 dark:text-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-muted dark:text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Number</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                placeholder="Not Provided"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-150 dark:border-gray-700 bg-white dark:bg-slate-800 text-xs focus:border-primary outline-none transition-all disabled:opacity-60 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-muted dark:text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Base Residence Address</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!isEditing}
                placeholder="Not Provided"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-150 dark:border-gray-700 bg-white dark:bg-slate-800 text-xs focus:border-primary outline-none transition-all disabled:opacity-60 dark:text-white"
              />
            </div>

            {isEditing && (
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-2xl transition-colors text-xs shadow-soft flex items-center justify-center space-x-1.5"
              >
                {isSaving ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            )}
          </form>
        </div>

        {/* Password Strength Section */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-soft space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-neutral-dark dark:text-white font-heading uppercase tracking-wider">Access Security</h3>
            <p className="text-xs text-neutral-muted dark:text-gray-400 mt-1">Manage and update your platform password.</p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-muted dark:text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Current Password</span>
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-150 dark:border-gray-700 bg-white dark:bg-slate-800 text-xs focus:border-primary outline-none transition-colors dark:text-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-muted dark:text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>New Password</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-150 dark:border-gray-700 bg-white dark:bg-slate-800 text-xs focus:border-primary outline-none transition-colors dark:text-white"
                required
              />

              {/* Password strength meter */}
              {newPassword && (
                <div className="space-y-1 pt-1">
                  <div className="flex space-x-1.5 h-1.5 w-full rounded overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <div className={`h-full transition-all duration-300 rounded ${
                      passwordStrength === 1 ? 'bg-red-500 w-1/3' : 
                      passwordStrength === 2 ? 'bg-amber-500 w-2/3' : 
                      passwordStrength === 3 ? 'bg-emerald-500 w-full' : 'w-0'
                    }`} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-muted dark:text-gray-400">
                    {passwordStrength === 1 ? 'Weak' : 
                     passwordStrength === 2 ? 'Medium strength' : 
                     passwordStrength === 3 ? 'Strong password!' : ''}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-muted dark:text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Confirm New Password</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-150 dark:border-gray-700 bg-white dark:bg-slate-800 text-xs focus:border-primary outline-none transition-colors dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-2xl transition-colors text-xs shadow-soft flex items-center justify-center space-x-1.5"
            >
              {isChangingPassword ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>

      </div>

      {/* CROP PREVIEW MODAL */}
      <AnimatePresence>
        {showCropModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCropModal(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white dark:bg-slate-900 border border-gray-150 dark:border-gray-800 p-6 rounded-3xl shadow-premium z-[60] space-y-6"
            >
              <div>
                <h4 className="font-extrabold text-sm text-neutral-dark dark:text-white uppercase tracking-wider">Drag to Reposition Avatar</h4>
                <p className="text-xs text-neutral-muted dark:text-gray-400 mt-1">Reposition your new profile image inside the circle frame.</p>
              </div>

              {/* Crop Frame Area */}
              <div 
                className="w-48 h-48 rounded-full border-4 border-primary/20 bg-neutral-bg mx-auto overflow-hidden relative cursor-move select-none"
                onMouseMove={handleDrag}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              >
                <img 
                  src={tempAvatar} 
                  alt="Crop Temp" 
                  className="w-full h-full object-cover pointer-events-none"
                  style={{ transform: `scale(1.2) translate(${cropOffset.x}px, ${cropOffset.y}px)` }}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCropModal(false)}
                  className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyCrop}
                  className="bg-primary hover:bg-primary-light text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-soft"
                >
                  Apply Crop
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
