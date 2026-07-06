import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Recycle, ArrowRight, User, Mail, Lock, Phone, UserCheck, Shield, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

type RoleType = 'Citizen' | 'Driver' | 'Municipal Admin';

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<RoleType>('Citizen');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showSuccessCheck, setShowSuccessCheck] = useState(false);

  // Form Validation
  const validateForm = () => {
    if (!name) {
      showToast('Name is required', 'error');
      return false;
    }
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
    const success = await register({ name, email, password, role, phone });

    if (success) {
      setShowSuccessCheck(true);
      setTimeout(() => {
        if (role === 'Citizen') navigate('/dashboard');
        else if (role === 'Driver') navigate('/driver');
        else if (role === 'Municipal Admin') navigate('/admin');
        else navigate('/dashboard');
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

  // Roles available
  const rolesList: { type: RoleType; title: string; desc: string; icon: any }[] = [
    {
      type: 'Citizen',
      title: 'Citizen',
      desc: 'Report waste piles, request collection, and earn recycle points/rewards.',
      icon: User
    },
    {
      type: 'Driver',
      title: 'Driver / Operator',
      desc: 'Access maps, view assignments, update collection status.',
      icon: UserCheck
    },
    {
      type: 'Municipal Admin',
      title: 'Municipality',
      desc: 'Manage logistics, dispatch drivers, review community logs.',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-bg flex items-stretch overflow-hidden font-sans">
      
      {/* Left Column: Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 relative z-10 bg-white overflow-y-auto max-h-screen">
        
        {/* Top Logo */}
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
                Welcome to UWMP
              </motion.p>
              <p className="text-xs text-neutral-muted mt-1">Creating your account and initializing dashboard...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Register container */}
        <motion.div
          animate={isShaking ? "shake" : "default"}
          variants={shakeVariants}
          className="max-w-md w-full mx-auto pt-16 pb-8"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-neutral-dark tracking-tight font-heading">
              Join UWMP
            </h2>
            <p className="text-sm text-neutral-muted mt-2">
              Help build a cleaner, greener community. Choose your role below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-neutral-muted uppercase tracking-wider block">
                Select Your Role
              </label>
              <div className="grid grid-cols-1 gap-3">
                {rolesList.map((item) => {
                  const Icon = item.icon;
                  const isSelected = role === item.type;
                  return (
                    <motion.div
                      key={item.type}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setRole(item.type)}
                      className={`p-3.5 rounded-2xl border flex items-start space-x-3.5 cursor-pointer transition-premium ${
                        isSelected
                          ? 'bg-primary/5 border-primary/40 shadow-soft'
                          : 'bg-neutral-bg/30 border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className={`p-2 rounded-xl flex-shrink-0 border transition-colors ${
                        isSelected 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-white text-gray-500 border-gray-100'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-neutral-dark">{item.title}</p>
                        <p className="text-[10.5px] text-neutral-muted leading-tight mt-0.5">{item.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px]">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-bold text-neutral-muted uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative rounded-2xl border border-gray-200 focus-within:border-primary/50 transition-premium shadow-soft bg-neutral-bg/30">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4.5 bg-transparent outline-none text-sm text-neutral-dark placeholder-gray-400 transition-premium font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  className="block w-full pl-11 pr-4 py-4.5 bg-transparent outline-none text-sm text-neutral-dark placeholder-gray-400 transition-premium font-medium"
                  placeholder="name@city.gov"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs font-bold text-neutral-muted uppercase tracking-wider">
                Phone Number (Optional)
              </label>
              <div className="relative rounded-2xl border border-gray-200 focus-within:border-primary/50 transition-premium shadow-soft bg-neutral-bg/30">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4.5 bg-transparent outline-none text-sm text-neutral-dark placeholder-gray-400 transition-premium font-medium"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-bold text-neutral-muted uppercase tracking-wider">
                Create Password
              </label>
              <div className="relative rounded-2xl border border-gray-200 focus-within:border-primary/50 transition-premium shadow-soft bg-neutral-bg/30">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4.5 bg-transparent outline-none text-sm text-neutral-dark placeholder-gray-400 transition-premium font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Register */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4.5 px-6 bg-gradient-eco hover:shadow-premium text-white font-semibold rounded-2xl shadow-soft flex items-center justify-center space-x-2 transition-premium hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Get Started'}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          {/* Bottom redirect */}
          <div className="mt-8 text-center text-sm text-neutral-muted">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-primary hover:text-primary-light transition-colors"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Animated Graphics (Matched with Login) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-soft relative flex-col justify-between p-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-lime/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-accent-teal/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

        <div className="z-10">
          <span className="text-xs font-bold text-primary/70 uppercase tracking-widest bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
            Eco-tech municipal networks
          </span>
        </div>

        {/* Smart city features checklist */}
        <div className="my-auto z-10 space-y-8 max-w-sm ml-8">
          <h3 className="text-2xl font-extrabold text-neutral-dark font-heading leading-tight">
            One platform, multiple roles.
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-accent-lime/20 flex items-center justify-center text-emerald-700 mt-1 flex-shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-dark">Community Impact</p>
                <p className="text-xs text-neutral-muted mt-0.5">Report sanitation issues, keep your locality clean and collect eco-credits.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-accent-lime/20 flex items-center justify-center text-emerald-700 mt-1 flex-shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-dark">Fleet Coordination</p>
                <p className="text-xs text-neutral-muted mt-0.5">Optimized routing, instant pickup updates, and container status triggers.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-accent-lime/20 flex items-center justify-center text-emerald-700 mt-1 flex-shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-dark">Municipal Audits</p>
                <p className="text-xs text-neutral-muted mt-0.5">Review overall bin thresholds and dispatch operators in seconds.</p>
              </div>
            </div>
          </div>
        </div>

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
