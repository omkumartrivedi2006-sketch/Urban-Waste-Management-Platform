import { motion } from 'framer-motion';
import { Trash2, MessageSquare, EyeOff, Route } from 'lucide-react';

interface ProblemCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  index: number;
}

const ProblemCard = ({ icon, title, description, badge, index }: ProblemCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="relative bg-white border border-gray-100 p-8 rounded-3xl shadow-soft hover:shadow-premium transition-premium group overflow-hidden"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent-lime/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Icon block */}
      <div className="w-14 h-14 rounded-2xl bg-neutral-bg flex items-center justify-center text-primary-light mb-6 group-hover:bg-primary group-hover:text-white transition-premium">
        {icon}
      </div>

      <span className="inline-block text-[10px] font-bold text-accent-cyan tracking-wider uppercase bg-accent-teal/10 rounded-full py-1 px-3 mb-3">
        {badge}
      </span>

      <h3 className="font-heading text-lg font-bold text-neutral-dark mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-sm leading-relaxed text-neutral-muted">
        {description}
      </p>
    </motion.div>
  );
};

export default function Problems() {
  const problems = [
    {
      icon: <Trash2 className="w-6 h-6" />,
      title: "Overflowing Street Bins",
      badge: "Hygiene Risk",
      description: "Street bins frequently spill over before municipal collection cycles, triggering toxic odor, pest infestations, and community complaints.",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Fragmented Reporting",
      badge: "Process Block",
      description: "Citizens lack direct channels to report waste blockages. Issues go unheard, and follow-ups rely on slow, bureaucratic support pipelines.",
    },
    {
      icon: <EyeOff className="w-6 h-6" />,
      title: "Zero Operational Visibility",
      badge: "Data Deficit",
      description: "Municipal centers have no live indicators of container capacities. Resources are deployed blindly, lacking quantitative analytics.",
    },
    {
      icon: <Route className="w-6 h-6" />,
      title: "Rigid Route Planning",
      badge: "Wasteful fuel",
      description: "Service vehicles operate on unoptimized, legacy schedules—visiting empty bins while overflowing ones are ignored.",
    },
  ];

  return (
    <section id="problems" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs font-bold uppercase tracking-widest text-primary-light"
          >
            The Waste Crisis
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-neutral-dark font-heading leading-tight"
          >
            Traditional Collection is Broken. <br />
            <span className="text-gradient-green">We Re-engineered It.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="text-neutral-muted max-w-2xl text-base"
          >
            Legacy public systems rely on guesswork. UWMP transforms waste management from a reactive, costly chore into an automated, data-driven utility.
          </motion.p>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, idx) => (
            <ProblemCard
              key={problem.title}
              icon={problem.icon}
              title={problem.title}
              badge={problem.badge}
              description={problem.description}
              index={idx}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}
