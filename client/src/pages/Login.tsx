import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Recycle, ArrowRight, Eye, EyeOff, Lock, Mail, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showSuccessCheck, setShowSuccessCheck] = useState(false);

  // Form Validation
  const validateForm = () => {
    if (!email) {
      showToast('Email is required', 'error');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return false;
    }
    if (!password) {
      showToast('Password is required', 'error');
      return false;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }

    setIsSubmitting(true);
    const success = await login(email, password);

    if (success) {
      // Success checkmark animation first
      setShowSuccessCheck(true);
      setTimeout(() => {
        // Fetch fresh state & redirect in protected route, but we redirect explicitly here
        // The auth context state change will handle the navigation if we let it,
        // but let's navigate to the appropriate route:
        // We'll read the token and parse it or just wait. The login API returns user object.
        // We will decode user role and navigate.
        const storedToken = localStorage.getItem('uwmp_token');
        if (storedToken) {
          try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            if (payload.role === 'Citizen') navigate('/dashboard');
            else if (payload.role === 'Driver') navigate('/driver');
            else if (payload.role === 'Municipal Admin') navigate('/admin');
            else navigate('/dashboard');
          } catch {
            navigate('/dashboard');
          }
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } else {
      setIsSubmitting(false);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: { duration: 0.5 }
    },
    default: { x: 0 }
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex items-stretch overflow-hidden font-sans">
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 relative z-10 bg-white">
        
        {/* Top Logo and Back to Home */}
        <div className="absolute top-8 left-8 sm:left-12 lg:left-20">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent-lime flex items-center justify-center text-white shadow-sm transition-premium group-hover:rotate-12">
              <Recycle className="w-5 h-5" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-neutral-dark flex items-center">
              UWMP
              <span className="w-1.5 h-1.5 rounded-full bg-accent-lime ml-1"></span>
            </span>
          </Link>
        </div>

        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccessCheck && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-24 h-24 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-premium"
              >
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Check className="w-12 h-12 stroke-[3]" />
                </motion.div>
              </motion.div>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-lg font-bold text-neutral-dark font-heading"
              >
                Access Granted
              </motion.p>
              <p className="text-xs text-neutral-muted mt-1">Redirecting to portal...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actual Form Container */}
        <motion.div
          animate={isShaking ? "shake" : "default"}
          variants={shakeVariants}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-neutral-dark tracking-tight font-heading">
              Welcome Back
            </h2>
            <p className="text-sm text-neutral-muted mt-2">
              Log in to manage and view waste logistics operations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-neutral-muted uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative rounded-2xl border border-gray-200 focus-within:border-primary/50 transition-premium shadow-soft bg-neutral-bg/30">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-transparent outline-none text-sm text-neutral-dark placeholder-gray-400 transition-premium font-medium"
                  placeholder="name@city.gov"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-bold text-neutral-muted uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-primary hover:text-primary-light transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-2xl border border-gray-200 focus-within:border-primary/50 transition-premium shadow-soft bg-neutral-bg/30">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-4 bg-transparent outline-none text-sm text-neutral-dark placeholder-gray-400 transition-premium font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-eco hover:shadow-premium text-white font-semibold rounded-2xl shadow-soft flex items-center justify-center space-x-2 transition-premium hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          {/* Bottom redirection */}
          <div className="mt-8 text-center text-sm text-neutral-muted">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-primary hover:text-primary-light transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Visual Design Side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-soft relative flex-col justify-between p-16 overflow-hidden">
        {/* Soft floating background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-lime/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-accent-teal/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

        {/* Top brand tagline */}
        <div className="z-10">
          <span className="text-xs font-bold text-primary/70 uppercase tracking-widest bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
            Smart waste operations
          </span>
        </div>

        {/* Center illustration: Smart city logistics details */}
        <div className="my-auto z-10 flex flex-col items-center">
          <div className="relative w-full max-w-[380px] h-[380px] flex items-center justify-center">
            
            {/* Pulsing circular frames */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border border-dashed border-primary/20 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-10 border border-primary/10 rounded-full"
            />

            {/* Inner Glass Card */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-64 h-64 glass shadow-premium rounded-3xl flex flex-col justify-between p-6 relative border border-white/40"
            >
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Recycle className="w-6 h-6 animate-spin-slow" />
                </div>
                <span className="text-[10px] font-bold bg-accent-lime/20 text-emerald-800 px-2 py-0.5 rounded-full">
                  Live Analytics
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400">Total Recycled</p>
                <h4 className="text-3xl font-extrabold text-neutral-dark font-heading leading-tight mt-1">
                  12,840 <span className="text-xs font-medium text-neutral-muted">Tons</span>
                </h4>
              </div>

              <div className="border-t border-gray-100/50 pt-3 flex justify-between items-center text-xs">
                <span className="text-neutral-muted font-medium">94.8% SLA Target</span>
                <span className="text-emerald-600 font-bold flex items-center">
                  +3.2%
                </span>
              </div>
            </motion.div>

            {/* Floating details */}
            <motion.div 
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute top-6 right-2 bg-white/95 border border-gray-100 shadow-soft p-3 rounded-2xl flex items-center space-x-2.5 text-xs font-bold text-neutral-dark"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-accent-lime animate-ping" />
              <span>Driver #4 Active</span>
            </motion.div>

            <motion.div 
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-6 left-2 bg-white/95 border border-gray-100 shadow-soft p-3 rounded-2xl flex items-center space-x-2.5 text-xs font-bold text-neutral-dark"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-accent-teal" />
              <span>Container 84% full</span>
            </motion.div>
          </div>
        </div>

        {/* Bottom quotes / context */}
        <div className="z-10 max-w-sm">
          <p className="text-sm font-semibold text-primary-dark font-heading">
            "Connecting communities with local services to create the next generation of eco-tech municipal platforms."
          </p>
          <p className="text-xs text-neutral-muted mt-2 font-medium">
            UWMP Smart Logistics Suite, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
