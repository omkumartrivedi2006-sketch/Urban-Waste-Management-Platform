import { ShieldAlert, Building2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const title = "Digitizing Municipal Waste for Smarter, Cleaner Cities";
  const words = title.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay: 0.8,
      },
    },
  };

  const illustrationVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay: 0.5,
      },
    },
  };

  return (
    <section id="home" className="min-h-screen pt-32 pb-20 relative bg-gradient-soft overflow-hidden">
      {/* Background blobs for premium depth */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-accent-lime/10 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-accent-teal/5 rounded-full blur-3xl translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Content */}
        <div className="lg:col-span-6 flex flex-col space-y-6 text-left z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full py-1.5 px-4 self-start text-primary-light font-medium text-xs tracking-wider uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-accent-lime animate-pulse"></span>
            <span>Empowering Smart Municipalities</span>
          </motion.div>

          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-dark tracking-tight leading-[1.1] font-heading"
          >
            {words.map((word, idx) => (
              <motion.span
                key={idx}
                variants={wordVariants}
                className="inline-block mr-2.5"
              >
                {word.includes("Smarter,") || word.includes("Cleaner") ? (
                  <span className="text-gradient-accent">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-lg text-neutral-muted max-w-xl font-normal leading-relaxed"
          >
            UWMP coordinates citizen reporting, AI container level alerts, real-time routing, and vehicle telematics into one central dashboard. Solve waste issues in clicks, not weeks.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4"
          >
            <a
              href="#report"
              className="group bg-gradient-eco text-white font-semibold py-4 px-8 rounded-2xl flex items-center justify-center space-x-2 hover:shadow-premium hover:-translate-y-0.5 active:translate-y-0 transition-premium"
            >
              <ShieldAlert className="w-5 h-5 text-accent-lime group-hover:scale-110 transition-transform" />
              <span>Report an Issue</span>
              <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#contact"
              className="bg-white text-neutral-dark border border-gray-200 font-semibold py-4 px-8 rounded-2xl flex items-center justify-center space-x-2 hover:border-primary/50 hover:bg-neutral-bg hover:-translate-y-0.5 active:translate-y-0 transition-premium"
            >
              <Building2 className="w-5 h-5 text-primary" />
              <span>For Municipalities</span>
            </a>
          </motion.div>

          {/* Key Value Points */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-x-6 gap-y-2 pt-6 border-t border-gray-100"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-muted">
              <CheckCircle2 className="w-4.5 h-4.5 text-accent-lime" />
              <span>Zero-code setups</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-muted">
              <CheckCircle2 className="w-4.5 h-4.5 text-accent-lime" />
              <span>OpenAPI compliance</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-muted">
              <CheckCircle2 className="w-4.5 h-4.5 text-accent-lime" />
              <span>99.9% uptime</span>
            </div>
          </motion.div>
        </div>

        {/* Right Smart City Animated Illustration */}
        <motion.div
          variants={illustrationVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 relative flex justify-center items-center"
        >
          {/* Glass Card Behind illustration */}
          <div className="absolute inset-0 bg-white/40 border border-white/20 backdrop-blur-2xl rounded-3xl -z-10 shadow-soft" />

          <svg
            className="w-full max-w-[500px] h-auto p-6"
            viewBox="0 0 600 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid Guidelines (Smart Grid) */}
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
            </pattern>
            <rect width="600" height="500" fill="url(#grid)" opacity="0.3" rx="24" />

            {/* Smart City Background Silhouettes */}
            <g opacity="0.2">
              <rect x="50" y="200" width="80" height="200" rx="4" fill="#0F5132" />
              <rect x="150" y="150" width="100" height="250" rx="4" fill="#0F5132" />
              <rect x="270" y="220" width="70" height="180" rx="4" fill="#0F5132" />
              <rect x="360" y="120" width="110" height="280" rx="4" fill="#0F5132" />
            </g>

            {/* Sun or Clean Energy Source */}
            <circle cx="480" cy="100" r="35" fill="url(#sunGrad)" />
            <defs>
              <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Connecting Telemetry Lines */}
            <g stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="4 4">
              <path d="M 120 280 L 250 180" />
              <path d="M 250 180 L 400 240" />
              <path d="M 400 240 L 480 350" />
            </g>

            {/* Wind Turbines (Pulsing and rotating) */}
            <g transform="translate(110, 180)">
              {/* Stand */}
              <line x1="0" y1="0" x2="0" y2="70" stroke="#94A3B8" strokeWidth="3" />
              {/* Rotating Blades */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 6, ease: "linear", repeat: Infinity }}
              >
                <circle cx="0" cy="0" r="4" fill="#64748B" />
                <line x1="0" y1="0" x2="0" y2="-25" stroke="#64748B" strokeWidth="2.5" />
                <line x1="0" y1="0" x2="22" y2="13" stroke="#64748B" strokeWidth="2.5" />
                <line x1="0" y1="0" x2="-22" y2="13" stroke="#64748B" strokeWidth="2.5" />
              </motion.g>
            </g>

            <g transform="translate(230, 140)">
              {/* Stand */}
              <line x1="0" y1="0" x2="0" y2="90" stroke="#94A3B8" strokeWidth="3" />
              {/* Rotating Blades */}
              <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              >
                <circle cx="0" cy="0" r="4" fill="#64748B" />
                <line x1="0" y1="0" x2="0" y2="-32" stroke="#64748B" strokeWidth="2.5" />
                <line x1="0" y1="0" x2="28" y2="16" stroke="#64748B" strokeWidth="2.5" />
                <line x1="0" y1="0" x2="-28" y2="16" stroke="#64748B" strokeWidth="2.5" />
              </motion.g>
            </g>

            {/* Telemetry Sensor Nodes */}
            <motion.circle
              cx="250"
              cy="180"
              r="7"
              fill="#06B6D4"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx="250" cy="180" r="3" fill="#FFFFFF" />

            <motion.circle
              cx="400"
              cy="240"
              r="7"
              fill="#22C55E"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx="400" cy="240" r="3" fill="#FFFFFF" />

            {/* Cloud Server (The Smart Core) */}
            <g transform="translate(420, 60)">
              <rect x="0" y="0" width="80" height="50" rx="8" fill="#0F5132" />
              <rect x="10" y="10" width="60" height="8" rx="2" fill="#22C55E" />
              <rect x="10" y="24" width="60" height="8" rx="2" fill="#06B6D4" />
              {/* Pulsing Core LED */}
              <motion.circle
                cx="65"
                cy="40"
                r="3"
                fill="#22C55E"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </g>

            {/* The Smart Bin (Connected IoT Waste Bin) */}
            <g transform="translate(80, 320)">
              {/* Lid */}
              <rect x="0" y="0" width="45" height="6" rx="3" fill="#0F5132" />
              {/* Body */}
              <path d="M 5 6 L 8 60 A 4 4 0 0 0 12 64 L 33 64 A 4 4 0 0 0 37 60 L 40 6" fill="#14532D" />
              {/* Digital fill-level status */}
              <rect x="12" y="15" width="21" height="35" rx="3" fill="#0B2E1C" />
              {/* Status Indicator inside */}
              <motion.rect
                x="14"
                y="35"
                width="17"
                height="13"
                rx="1"
                fill="#22C55E"
                animate={{ height: [13, 28, 13], y: [35, 20, 35] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Wi-Fi / Radio Waves transmitting */}
              <g stroke="#22C55E" strokeWidth="1.5" fill="none">
                <motion.path
                  d="M 12 -12 A 15 15 0 0 1 33 -12"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                />
                <motion.path
                  d="M 7 -18 A 22 22 0 0 1 38 -18"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                />
              </g>
            </g>

            {/* Smart Recycling Truck */}
            <motion.g
              transform="translate(320, 310)"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Truck Path / Eco Glow */}
              <rect x="-80" y="52" width="220" height="6" rx="3" fill="#22C55E" opacity="0.15" />
              
              {/* Cab / Front body */}
              <path d="M 80 15 L 115 15 L 125 35 L 125 50 L 80 50 Z" fill="#64748B" />
              <rect x="98" y="20" width="18" height="12" rx="2" fill="#E2E8F0" />
              <rect x="80" y="38" width="8" height="12" fill="#F1F5F9" />
              {/* Headlight */}
              <polygon points="125,42 145,40 145,48 125,45" fill="url(#lightBeam)" opacity="0.3" />

              {/* Cargo Tank (Eco design) */}
              <path d="M 0 5 Q 0 0 5 0 L 78 0 Q 80 0 80 5 L 80 50 Q 80 50 78 50 L 5 50 Q 0 50 0 45 Z" fill="#0F5132" />
              {/* Recycle Icon on cargo */}
              <g transform="translate(30, 15) scale(0.7)" stroke="#22C55E" strokeWidth="2.5" fill="none">
                <path d="M 15 5 L 25 22 L 5 22 Z" />
                <path d="M 22 17 L 30 30 L 15 30 Z" />
              </g>
              
              {/* Wheels */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                transform="translate(20, 52)"
              >
                <circle cx="0" cy="0" r="12" fill="#1E293B" />
                <circle cx="0" cy="0" r="5" fill="#94A3B8" />
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#0F172A" strokeWidth="1.5" />
              </motion.g>

              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                transform="translate(68, 52)"
              >
                <circle cx="0" cy="0" r="12" fill="#1E293B" />
                <circle cx="0" cy="0" r="5" fill="#94A3B8" />
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#0F172A" strokeWidth="1.5" />
              </motion.g>

              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                transform="translate(108, 52)"
              >
                <circle cx="0" cy="0" r="12" fill="#1E293B" />
                <circle cx="0" cy="0" r="5" fill="#94A3B8" />
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#0F172A" strokeWidth="1.5" />
              </motion.g>
            </motion.g>

            <defs>
              <linearGradient id="lightBeam" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#22C55E" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
