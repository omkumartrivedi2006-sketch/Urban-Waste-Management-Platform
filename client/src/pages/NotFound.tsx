import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
      
      {/* SVG Illustration Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-64 h-64 relative flex items-center justify-center mb-8"
      >
        {/* Glowing aura */}
        <span className="absolute inset-10 bg-primary/5 rounded-full filter blur-2xl animate-pulse-subtle" />

        {/* Custom 404 Trash Bin SVG */}
        <svg className="w-48 h-48 text-primary dark:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
          />
        </svg>

        {/* Floating 404 Badge */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 bg-red-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-premium border-2 border-white dark:border-slate-950 uppercase tracking-widest"
        >
          404 Error
        </motion.div>
      </motion.div>

      {/* Warning details */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4 max-w-sm"
      >
        <h2 className="text-xl font-extrabold text-neutral-dark dark:text-white font-heading">Incidents Path Missing</h2>
        <p className="text-xs text-neutral-muted dark:text-gray-400 leading-relaxed">
          The requested administrative route or dashboard portal does not exist or has been relocated by municipal operations.
        </p>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-light text-white text-xs font-bold py-3.5 px-6 rounded-2xl transition-premium shadow-soft hover:-translate-y-0.5"
        >
          <Home className="w-4 h-4 text-accent-lime" />
          <span>Return to Safety</span>
        </button>
      </motion.div>

    </div>
  );
}
