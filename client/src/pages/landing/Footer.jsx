/**
 * Cakes and Crunches — Landing Footer Component
 */

export default function Footer() {
  return (
    <footer className="py-12 border-t border-glass-border glass bg-bg-secondary/40 text-text-secondary text-sm px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-1 items-center md:items-start">
          <span className="text-lg font-black tracking-wider text-text-primary font-display">
            CAKES & CRUNCHES
          </span>
          <span className="text-xs text-text-muted">
            Bulk Order Advance Collection & Balance Tracking System
          </span>
        </div>
        <div className="flex gap-6">
          <a href="/login" className="hover:text-text-primary transition-colors">Portal Login</a>
          <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
        </div>
        <div className="text-xs text-text-muted">
          © {new Date().getFullYear()} Cakes & Crunches. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
