/**
 * Cakes and Crunches — Landing Features Section
 */

import { motion } from "framer-motion";
import {
  RiShieldFlashLine,
  RiCoinLine,
  RiWallet3Line,
  RiFileList2Line,
} from "react-icons/ri";

export default function FeaturesSection() {
  const features = [
    {
      icon: RiShieldFlashLine,
      title: "Secure Verification",
      desc: "Instant cryptographic JWT verification secure authentication limits across admin/manager scopes.",
    },
    {
      icon: RiCoinLine,
      title: "Advance Installments",
      desc: "Flexible deposit settings supporting credit cards, UPI, cash, and banking receipts tracking.",
    },
    {
      icon: RiWallet3Line,
      title: "Wallet Credit Engine",
      desc: "Refunds, credit balances, and financial adjustments ledgered correctly with double entries.",
    },
    {
      icon: RiFileList2Line,
      title: "Audit History Logs",
      desc: "Track critical model transactions with immutable, security-focused operational logging.",
    },
  ];

  return (
    <section id="features" className="py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Financial Management <span className="gradient-text">Built for Scale</span>
          </h2>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Standardize bulk cake order bookkeeping and eliminate cash tracking mistakes with dedicated features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-card p-6 flex flex-col gap-4 text-left border border-glass-border hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <feat.icon className="w-6 h-6 text-primary-light" />
              </div>
              <h3 className="text-lg font-bold text-text-primary group-hover:text-primary-light transition-colors">
                {feat.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
