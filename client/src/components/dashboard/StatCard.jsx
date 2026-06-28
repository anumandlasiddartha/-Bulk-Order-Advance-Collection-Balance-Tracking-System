/**
 * Cakes and Crunches — Dashboard Stat Card Component
 */

export default function StatCard({ title, value, changeText, isTrendUp, colorClass = "text-primary-light" }) {
  return (
    <div className="glass-card p-6 flex flex-col gap-2 relative overflow-hidden group">
      {/* Decorative Blur Background Element */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-300"></div>

      <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
        {title}
      </span>
      <span className={`text-3.5xl font-extrabold tracking-tight ${colorClass} glow-text`}>
        {value}
      </span>
      
      <div className="flex items-center gap-1.5 mt-1">
        <span className={`text-xs font-bold ${isTrendUp ? "text-success" : "text-danger"}`}>
          {isTrendUp ? "▲" : "▼"} {changeText}
        </span>
      </div>
    </div>
  );
}
