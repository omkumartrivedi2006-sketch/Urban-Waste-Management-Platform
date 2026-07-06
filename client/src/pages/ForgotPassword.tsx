import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Recycle, ArrowLeft, Mail, Check, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ForgotPassword() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showSuccessCheck, setShowSuccessCheck] = useState(false);

  const validateForm = () => {
    if (!email) {
      showToast('Email is required', 'error');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email address', 'error');
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
    // Simulate sending email reset link
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessCheck(true);
      showToast('Password reset link sent to your email!', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }, 1500);
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
              className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center text-center px-6"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-24 h-24 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-premium"
              >
                <Check className="w-12 h-12 stroke-[3]" />
              </motion.div>
              <motion.h3
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-xl font-bold text-neutral-dark font-heading"
              >
                Email Sent!
              </motion.h3>
              <p className="text-sm text-neutral-muted mt-2 max-w-sm">
                We've sent a password recovery link to <strong>{email}</strong>. Please check your inbox.
              </p>
              <Link
                to="/login"
                className="mt-8 inline-flex items-center space-x-2 font-bold text-primary hover:text-primary-light transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Login</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Container */}
        <motion.div
          animate={isShaking ? "shake" : "default"}
          variants={shakeVariants}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-10">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-neutral-muted hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-neutral-dark tracking-tight font-heading">
              Recover Password
            </h2>
            <p className="text-sm text-neutral-muted mt-2">
              Enter your email and we'll send you instructions to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-neutral-muted uppercase tracking-wider">
                Account Email
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

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4.5 px-6 bg-gradient-eco hover:shadow-premium text-white font-semibold rounded-2xl shadow-soft flex items-center justify-center space-x-2 transition-premium hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Sending Request...' : 'Send Recovery Link'}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Right Column: Visual Design Side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-soft relative flex-col justify-between p-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-lime/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-accent-teal/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

        <div className="z-10">
          <span className="text-xs font-bold text-primary/70 uppercase tracking-widest bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
            Secure operations portal
          </span>
        </div>

        {/* Info */}
        <div className="my-auto z-10 space-y-6 max-w-sm ml-8 text-left">
          <h3 className="text-2xl font-extrabold text-neutral-dark font-heading leading-tight">
            Security is our priority.
          </h3>
          <p className="text-sm text-neutral-muted leading-relaxed">
            UWMP coordinates with municipal directories using industry-standard OAuth 2.0 and cryptographically hashed passwords. Your login session is encrypted and protected.
          </p>
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
