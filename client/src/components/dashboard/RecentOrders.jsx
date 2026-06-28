/**
 * Cakes and Crunches — Dashboard Recent Orders List
 */

export default function RecentOrders() {
  const dummyOrders = [
    {
      id: "ORD-20260628-X928",
      customer: "Aria Grand Hotels",
      cake: "Wedding Cake",
      value: "₹60,000",
      status: "partial",
    },
    {
      id: "ORD-20260628-H129",
      customer: "TechSolutions India",
      cake: "Corporate Cupcakes",
      value: "₹12,000",
      status: "overdue",
    },
    {
      id: "ORD-20260628-M291",
      customer: "Ananya Sharma",
      cake: "Birthday Cake",
      value: "₹8,000",
      status: "pending",
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "partial":
        return "bg-info/10 text-info border-info/20";
      case "overdue":
        return "bg-danger/10 text-danger border-danger/20";
      default:
        return "bg-warning/10 text-warning border-warning/20";
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold text-text-primary">Recent Bulk Orders</h3>
        <p className="text-text-secondary text-xs mt-0.5">Audit of latest bulk order activities</p>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-72">
        {dummyOrders.map((ord) => (
          <div
            key={ord.id}
            className="p-3 border border-glass-border rounded-lg bg-bg-secondary/40 flex items-center justify-between hover:border-primary/20 transition-all"
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-text-primary">{ord.customer}</span>
              <span className="text-xs text-text-muted">{ord.cake} • {ord.id}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-text-secondary">{ord.value}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getStatusColor(ord.status)}`}>
                {ord.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
