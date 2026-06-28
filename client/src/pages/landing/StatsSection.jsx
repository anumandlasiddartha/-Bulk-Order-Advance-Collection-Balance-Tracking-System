/**
 * Cakes and Crunches — Landing Stats Section
 */

import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    { value: "99.8%", label: "Collection Accuracy" },
    { value: "₹45L+", label: "Processed Dues" },
    { value: "10k+", label: "Bulk Deliveries Tracked" },
  ];

  return (
    <section className="py-16 bg-bg-secondary/40 border-y border-glass-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="flex flex-col gap-2"
          >
            <span className="text-4xl md:text-5xl font-black text-primary-light glow-text tracking-tight">
              {stat.value}
            </span>
            <span className="text-text-secondary text-sm font-medium">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
