import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileEdit, 
  MapPin, 
  Bell, 
  Cpu, 
  Truck, 
  Compass, 
  CheckCircle, 
  Camera, 
  Gift 
} from 'lucide-react';

interface Step {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function HowItWorks() {
  const steps: Step[] = [
    {
      number: "01",
      icon: <FileEdit className="w-5 h-5" />,
      title: "Citizen Submission",
      description: "A resident captures a photo of waste overflow and files a submission on the mobile portal.",
    },
    {
      number: "02",
      icon: <MapPin className="w-5 h-5" />,
      title: "GPS Geotagging",
      description: "The application instantly tags the precise coordinate details for route dispatching.",
    },
    {
      number: "03",
      icon: <Cpu className="w-5 h-5" />,
      title: "AI Image Verification",
      description: "Our AI model checks the photo to confirm waste presence and assess spill severity.",
    },
    {
      number: "04",
      icon: <Bell className="w-5 h-5" />,
      title: "Operator Console Alert",
      description: "A ticket is populated on the municipality's dashboard, prioritized by urgency.",
    },
    {
      number: "05",
      icon: <Cpu className="w-5 h-5" />,
      title: "Smart Route Generation",
      description: "The engine runs a routing algorithm, incorporating new stops into the active fleet schedule.",
    },
    {
      number: "06",
      icon: <Truck className="w-5 h-5" />,
      title: "Vehicle Dispatch",
      description: "The nearest garbage collection vehicle is updated with the modified path.",
    },
    {
      number: "07",
      icon: <Compass className="w-5 h-5" />,
      title: "Navigation Assistance",
      description: "The collection driver receives turn-by-turn guidance to reach the reported site.",
    },
    {
      number: "08",
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Waste Cleared",
      description: "The municipal workers collect the waste, restoring public cleanliness to the area.",
    },
    {
      number: "09",
      icon: <Camera className="w-5 h-5" />,
      title: "Close-Out Picture",
      description: "The driver uploads a photo of the clean site to close the open ticket.",
    },
    {
      number: "10",
      icon: <Gift className="w-5 h-5" />,
      title: "Rewards Awarded",
      description: "The reporting citizen receives eco-points, redeemable for local community credits.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-accent-lime/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-light">
            Operational Flow
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-dark font-heading leading-tight">
            The 10-Step Resolution Cycle: <br />
            <span className="text-gradient-green">From Report to Clean Streets</span>
          </h2>
          <p className="text-neutral-muted max-w-2xl text-base">
            See how our platform closes the gap between citizen concerns and municipal response through automated data synchronization.
          </p>
        </div>

        {/* Timeline Component */}
        <div className="relative">
          
          {/* Vertical Center Line for Desktop */}
          <div className="absolute left-6 lg:left-1/2 top-2 bottom-2 w-0.5 bg-gray-100 -translate-x-1/2" />

          {/* Active timeline tracker */}
          <motion.div 
            className="absolute left-6 lg:left-1/2 top-2 w-0.5 bg-gradient-to-b from-primary to-accent-lime origin-top -translate-x-1/2"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ height: 'calc(100% - 16px)' }}
          />

          {/* Steps */}
          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div 
                  key={step.number} 
                  className={`relative flex flex-col lg:flex-row items-start ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Connection Node (Bullet) */}
                  <div className="absolute left-6 lg:left-1/2 top-1.5 -translate-x-1/2 z-10 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                      className="w-10 h-10 rounded-full bg-white border-2 border-primary flex items-center justify-center text-primary shadow-md"
                    >
                      {step.icon}
                    </motion.div>
                  </div>

                  {/* Step Card Content */}
                  <div className={`w-full lg:w-1/2 pl-16 lg:pl-0 ${
                    isEven ? 'lg:pr-16 lg:text-right' : 'lg:pl-16 lg:text-left'
                  }`}>
                    <motion.div
                      initial={{ 
                        opacity: 0, 
                        x: isEven ? 50 : -50,
                        y: 10 
                      }}
                      whileInView={{ 
                        opacity: 1, 
                        x: 0,
                        y: 0 
                      }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="bg-neutral-bg border border-gray-100 p-6 rounded-2xl shadow-soft hover:shadow-premium transition-premium inline-block w-full max-w-lg text-left"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-extrabold text-accent-lime font-mono tracking-widest uppercase">
                          Step {step.number}
                        </span>
                        <span className="text-[10px] bg-white border border-gray-100 font-semibold px-2 py-1 rounded text-neutral-muted">
                          Auto-Tracked
                        </span>
                      </div>
                      
                      <h3 className="font-heading text-base font-bold text-neutral-dark mb-2">
                        {step.title}
                      </h3>
                      
                      <p className="text-xs leading-relaxed text-neutral-muted">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Spacer for columns balance */}
                  <div className="hidden lg:block w-1/2" />

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
