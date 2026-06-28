/**
 * Cakes and Crunches — Landing Timeline Section
 */

import { motion } from "framer-motion";

export default function TimelineSection() {
  const steps = [
    {
      num: "01",
      title: "Place Order Entry",
      desc: "Record event specs, cake details, delivery targets, and calculate minimum advance required.",
    },
    {
      num: "02",
      title: "Collect Upfront Advance",
      desc: "Verify initial token amount and instantly trigger automated balance dues calculations.",
    },
    {
      num: "03",
      title: "Fulfill & Clear Balance",
      desc: "Audit baking progress, collect payments, auto-resolve alerts and generate formal PDF invoice receipts.",
    },
  ];

  return (
    <section className="py-24 bg-bg-secondary/20 px-4 md:px-8 border-y border-glass-border bg-dots">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            How The System <span className="gradient-text">Assures Cashflow</span>
          </h2>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Our step-by-step pipeline guarantees deposits are locked before raw materials hit production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="flex flex-col gap-4 text-left relative"
            >
              <div className="text-5xl font-black text-primary/10 tracking-widest font-display">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-text-primary">
                {step.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
