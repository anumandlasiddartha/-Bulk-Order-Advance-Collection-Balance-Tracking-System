/**
 * Cakes and Crunches — Landing Hero Section
 */

import { motion } from "framer-motion";
import BakeryScene from "../../components/three/BakeryScene";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-grid pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Texts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6 text-left"
        >
          <span className="inline-block self-start text-xs font-bold tracking-widest text-primary-light uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            Secure Bulk Order Operations
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Take Control of Your <br />
            <span className="gradient-text glow-text">Bakery Financials</span>
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-xl leading-relaxed">
            Automate advance collections, track outstanding remaining balances in real-time, audit ledgers, and secure cash flows with enterprise-grade precision.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <a href="/login" className="btn-primary px-8 py-4 text-base">
              Enter Platform
            </a>
            <a href="#features" className="btn-secondary px-8 py-4 text-base">
              Explore Features
            </a>
          </div>
        </motion.div>

        {/* 3D Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative glass-card p-4 rounded-2xl glow-lg border border-glass-border overflow-hidden"
        >
          <BakeryScene />
        </motion.div>
      </div>
    </section>
  );
}
