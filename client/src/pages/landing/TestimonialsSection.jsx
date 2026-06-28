/**
 * Cakes and Crunches — Landing Testimonials Section
 */

import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const reviews = [
    {
      quote: "Managing hotel bulk cake orders with manually filled ledger papers was chaotic. The platform resolved our tracking issues completely.",
      author: "Samantha Roberts",
      role: "F&B Manager, Grand Aria Hotels",
    },
    {
      quote: "The wallet engine refund system is stellar. We can convert canceled orders into store credit vouchers instantly.",
      author: "Deepak Nair",
      role: "Operations Chief, Cakes & Crunches Pune",
    },
  ];

  return (
    <section className="py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Trusted by <span className="gradient-text">Operations Teams</span>
          </h2>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            See how managers and head chefs evaluate our bulk order financial engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.author}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="glass-card p-8 flex flex-col gap-6 text-left border border-glass-border hover:border-primary/20 transition-all duration-300 relative"
            >
              <p className="text-text-primary text-base md:text-lg italic leading-relaxed">
                "{rev.quote}"
              </p>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-primary-light">{rev.author}</span>
                <span className="text-xs text-text-muted">{rev.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
