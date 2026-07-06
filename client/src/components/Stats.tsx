import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Timer, Leaf, TrendingUp } from 'lucide-react';

interface CounterProps {
  value: number;
  decimals?: number;
  duration?: number;
}

function Counter({ value, decimals = 0, duration = 1.8 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number | null = null;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = (timestamp - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            
            // Quad ease-out easing function
            const easeOutQuad = progress * (2 - progress);
            const currentVal = easeOutQuad * value;
            
            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value, duration, hasAnimated]);

  return (
    <span ref={ref} className="font-heading font-extrabold tabular-nums">
      {count.toFixed(decimals)}
    </span>
  );
}

export default function Stats() {
  const stats = [
    {
      icon: <ThumbsUp className="w-5 h-5 text-emerald-600" />,
      label: "Complaints Resolved",
      prefix: "",
      suffix: "+",
      number: 14850,
      decimals: 0,
      description: "Successful waste cleanups reported and verified by city residents.",
    },
    {
      icon: <Timer className="w-5 h-5 text-cyan-600" />,
      label: "Average Response",
      prefix: "",
      suffix: " min",
      number: 38.5,
      decimals: 1,
      description: "From submission tag to operational team resolution clearance.",
    },
    {
      icon: <Leaf className="w-5 h-5 text-lime-600" />,
      label: "CO2 Saved",
      prefix: "",
      suffix: " Tons",
      number: 124,
      decimals: 0,
      description: "Saved by running optimized, shorter collection dispatch paths.",
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-teal-600" />,
      label: "Recyclables Redirected",
      prefix: "",
      suffix: "%",
      number: 48,
      decimals: 0,
      description: "Increase in sorted recyclable waste materials diversion.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-eco text-white relative overflow-hidden">
      {/* Decorative vector background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.15),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm flex flex-col items-center text-center shadow-lg hover:bg-white/10 transition-premium"
            >
              {/* Icon Holder */}
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-5 shadow-inner">
                {stat.icon}
              </div>

              {/* Number */}
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                {stat.prefix}
                <Counter value={stat.number} decimals={stat.decimals} />
                {stat.suffix}
              </div>

              {/* Label */}
              <div className="text-sm font-semibold text-accent-lime uppercase tracking-wider mb-2">
                {stat.label}
              </div>

              {/* Description */}
              <p className="text-xs text-white/70 leading-relaxed max-w-[240px]">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
