import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Truck, Check, Sparkles } from 'lucide-react';

interface TabContent {
  id: string;
  label: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
  mockup: React.ReactNode;
}

export default function WhoIsThisFor() {
  const [activeTab, setActiveTab] = useState('citizens');

  const tabs: TabContent[] = [
    {
      id: 'citizens',
      label: 'Citizens',
      icon: <User className="w-4 h-4" />,
      title: 'Be the Eyes of Your Neighborhood',
      subtitle: 'Empowering Local Communities',
      description: 'UWMP gives you the tools to report issues in seconds, eliminating traditional bureaucratic hold-ups. Help shape a cleaner environment while earning rewards.',
      points: [
        'Report garbage overflows and dumping in 30 seconds.',
        'Upload photo proof with automatic geolocation.',
        'Track report status from submission to resolution.',
        'Earn eco-credits redeemable for local community perks.',
      ],
      mockup: (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-soft max-w-sm mx-auto relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-accent-lime/20 flex items-center justify-center text-accent-lime font-bold text-xs">JD</div>
              <div>
                <div className="text-xs font-bold text-neutral-dark">John Doe</div>
                <div className="text-[10px] text-neutral-muted">2 mins ago</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Report Sent</span>
          </div>
          <div className="aspect-[4/3] bg-neutral-bg rounded-2xl mb-4 flex items-center justify-center border border-dashed border-gray-200 overflow-hidden relative group">
            <span className="text-xs text-neutral-muted">📷 Overflowing Bin Photo</span>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold">Location Verified ✓</span>
            </div>
          </div>
          <div className="bg-primary/5 rounded-2xl p-4 flex items-center justify-between border border-primary/10">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4.5 h-4.5 text-accent-lime" />
              <span className="text-xs font-bold text-primary-light">Citizen Reward Earned</span>
            </div>
            <span className="text-xs font-extrabold text-primary font-mono">+50 pts</span>
          </div>
        </div>
      )
    },
    {
      id: 'municipalities',
      label: 'Municipalities',
      icon: <Shield className="w-4 h-4" />,
      title: 'Full Operational Control',
      subtitle: 'Data-Driven City Management',
      description: 'Equip your administrative teams with automated intake, visual inspection metrics, route builders, and carbon reports to slash overhead.',
      points: [
        'Centralized ticketing dashboard with automated duplicate filtering.',
        'Visual severity scoring via AI computer vision models.',
        'Real-time fleet coordinates and telematics tracking.',
        'Verify resolutions automatically with driver completion photos.',
      ],
      mockup: (
        <div className="bg-neutral-dark rounded-3xl p-6 shadow-2xl text-white max-w-md mx-auto relative border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <span className="text-xs font-bold text-gray-300">UWMP Operator Console</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-[10px] text-gray-400 block mb-1">Open Reports</span>
              <span className="text-lg font-extrabold text-accent-lime">14 Active</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-[10px] text-gray-400 block mb-1">Trucks Dispatched</span>
              <span className="text-lg font-extrabold text-accent-teal">8 / 10</span>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col space-y-2">
            <div className="text-[10px] text-gray-400 font-bold">LIVE SEVERITY LOGS</div>
            <div className="flex items-center justify-between text-xs border-b border-white/5 pb-1">
              <span>📍 Zone B-12 (Overflow)</span>
              <span className="text-red-400 font-bold uppercase text-[9px]">High</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-1">
              <span>📍 Sector 4 (Illegal Dump)</span>
              <span className="text-amber-400 font-bold uppercase text-[9px]">Medium</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'drivers',
      label: 'Drivers',
      icon: <Truck className="w-4 h-4" />,
      title: 'Effortless Shift Routes',
      subtitle: 'Streamlined Driver Workflow',
      description: 'Clear navigation maps sent to in-cab devices bypass traffic congestion and target overflowing bins, preventing empty-run fuel waste.',
      points: [
        'Turn-by-turn routing instructions optimized in real-time.',
        'Fewer collection stops at empty or low-fill dump sites.',
        'Single-tap photo clearance logs to close tickets.',
        'Report blocked streets or damaged bins directly to managers.',
      ],
      mockup: (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-soft max-w-sm mx-auto relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
            <span className="text-xs font-bold text-neutral-dark">Driver App (Shift #09)</span>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">On Duty</span>
          </div>
          <div className="bg-neutral-bg aspect-[4/3] rounded-2xl mb-4 flex flex-col justify-between p-4 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-neutral-muted uppercase block">Next Stop</span>
                <span className="text-xs font-bold text-neutral-dark">Sector 8 Bin #042</span>
              </div>
              <span className="text-[10px] font-extrabold text-accent-cyan bg-accent-teal/10 px-2 py-0.5 rounded-full">92% Full</span>
            </div>
            {/* Mock Map Route */}
            <div className="h-16 w-full relative flex items-center justify-center bg-white border border-gray-100 rounded-xl overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 200 64" fill="none">
                <path d="M 10 32 L 80 32 L 120 16 L 190 16" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
                <path d="M 10 32 L 80 32 L 120 16 L 190 16" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" />
                <circle cx="120" cy="16" r="6" fill="#06B6D4" />
              </svg>
            </div>
          </div>
          <button className="w-full py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-light transition-premium">
            Clear Stop & Upload Photo
          </button>
        </div>
      )
    }
  ];

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <section id="who-is-for" className="py-24 bg-neutral-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-light">
            Platform Users
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-dark font-heading leading-tight">
            Tailored Experiences for <br />
            <span className="text-gradient-green">Every Waste Management stakeholder</span>
          </h2>
          <p className="text-neutral-muted max-w-2xl text-base">
            UWMP is a multi-sided ecosystem designed to streamline workflow, communication, and transparency across the entire cycle.
          </p>
        </div>

        {/* Tab Switcher Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white border border-gray-200 p-1.5 rounded-2xl flex space-x-1 shadow-soft">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-2 py-3 px-6 text-sm font-semibold rounded-xl transition-premium z-10 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-neutral-muted hover:text-neutral-dark'
                }`}
              >
                {/* Active Background Pill */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-gradient-eco rounded-xl -z-10 shadow-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Display Area */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 lg:p-12 shadow-soft hover:shadow-premium transition-premium">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* Left Details */}
              <div className="lg:col-span-7 text-left space-y-6">
                <div>
                  <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider block mb-1">
                    {currentTab.subtitle}
                  </span>
                  <h3 className="font-heading text-2xl lg:text-3xl font-extrabold text-neutral-dark">
                    {currentTab.title}
                  </h3>
                </div>
                
                <p className="text-sm leading-relaxed text-neutral-muted">
                  {currentTab.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentTab.points.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3 text-xs">
                      <div className="w-5 h-5 rounded-full bg-accent-lime/20 flex items-center justify-center text-primary mt-0.5 shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-neutral-text font-medium leading-normal">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Mockup Preview */}
              <div className="lg:col-span-5 w-full">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {currentTab.mockup}
                </motion.div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
