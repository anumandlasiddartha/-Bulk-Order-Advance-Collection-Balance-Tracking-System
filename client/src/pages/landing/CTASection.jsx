/**
 * Cakes and Crunches — Landing CTA (Call to Action) Section
 */

import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-24 bg-grid px-4 md:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="max-w-4xl mx-auto glass-card p-12 text-center flex flex-col gap-6 items-center">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Ready to Secure Your <br />
          <span className="gradient-text">Bakery Cashflows?</span>
        </h2>
        <p className="text-text-secondary text-sm md:text-base max-w-xl leading-relaxed">
          Log in with your administrator credentials or manager invitation link to access the ledger system, run reports, and configure auto-alerts.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4"
        >
          <a href="/login" className="btn-primary px-8 py-4 text-base glow">
            Get Started Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}
