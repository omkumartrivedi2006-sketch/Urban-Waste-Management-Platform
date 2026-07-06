import React from 'react';
import { motion as motionFramer } from 'framer-motion';
import { 
  FileText, 
  Camera, 
  MapPin, 
  Navigation, 
  LayoutDashboard, 
  Cpu, 
  BarChart3, 
  Award 
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function Features() {
  const features: Feature[] = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Citizen Reports Portal",
      description: "Allow citizens to file reports of trash overflows, illegal dumping, or damaged municipal bins in under 30 seconds.",
      color: "from-emerald-500/10 to-emerald-500/0 text-emerald-600",
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Photo Proof Upload",
      description: "Quickly capture and upload snapshots of waste problems to provide operational teams with instant visual context.",
      color: "from-cyan-500/10 to-cyan-500/0 text-cyan-600",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Auto GPS Geotagging",
      description: "Mobile reports automatically capture coordinates, pinning the exact issue location on municipal operator maps.",
      color: "from-lime-500/10 to-lime-500/0 text-lime-600",
    },
    {
      icon: <Navigation className="w-6 h-6" />,
      title: "Optimized Dispatch Routing",
      description: "Real-time navigation paths calculated automatically for waste vehicles to bypass traffic and clear full containers first.",
      color: "from-teal-500/10 to-teal-500/0 text-teal-600",
    },
    {
      icon: <LayoutDashboard className="w-6 h-6" />,
      title: "Fleet Manager Dashboard",
      description: "A centralized command dashboard maps vehicle coordinates, pending alerts, and historical route completions.",
      color: "from-blue-500/10 to-blue-500/0 text-blue-600",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Computer Vision Analysis",
      description: "AI automatically scans citizen photos to grade container overflow levels, filter spam, and categorize trash classes.",
      color: "from-purple-500/10 to-purple-500/0 text-purple-600",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics & Carbon Reports",
      description: "Review comprehensive reports detailing waste weight metrics, collection speeds, fuel savings, and carbon offset statistics.",
      color: "from-indigo-500/10 to-indigo-500/0 text-indigo-600",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Recycling Reward Credits",
      description: "Motivate community waste reporting. Citizens gain carbon offset points redeemable for local council rewards or tax benefits.",
      color: "from-amber-500/10 to-amber-500/0 text-amber-600",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <section id="features" className="py-24 bg-neutral-bg relative overflow-hidden">
      {/* Background graphic elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-lime/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center space-y-4">
          <motionFramer.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="text-xs font-bold uppercase tracking-widest text-primary-light"
          >
            Platform Capabilities
          </motionFramer.span>
          <motionFramer.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-neutral-dark font-heading leading-tight"
          >
            A Unified Ecosystem for <br />
            <span className="text-gradient-green">Smart Municipal Waste</span>
          </motionFramer.h2>
          <motionFramer.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.2 }}
            className="text-neutral-muted max-w-2xl text-base"
          >
            UWMP coordinates mobile applications, automated routing APIs, cloud telemetry, and data engines to connect drivers, city staff, and citizens.
          </motionFramer.p>
        </div>

        {/* Features Grid */}
        <motionFramer.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motionFramer.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ 
                y: -6, 
                boxShadow: "0 20px 40px -15px rgba(15, 81, 50, 0.08)",
                transition: { duration: 0.3 }
              }}
              className="bg-white border border-gray-100 p-6 rounded-2xl shadow-soft relative overflow-hidden group transition-premium"
            >
              {/* Background gradient flare */}
              <div className={`absolute inset-0 bg-gradient-to-b ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-white transition-premium ${feature.color.split(" ").pop()}`}>
                {feature.icon}
              </div>

              {/* Text content */}
              <h3 className="font-heading text-base font-bold text-neutral-dark mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-neutral-muted">
                {feature.description}
              </p>
            </motionFramer.div>
          ))}
        </motionFramer.div>

      </div>
    </section>
  );
}
