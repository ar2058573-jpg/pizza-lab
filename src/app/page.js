"use client";

import Sidebar from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";

export default function DashboardPage() {
  const { orders, riders, stats } = useApp();
  const pendingOrders = orders.filter((o) => o.status === "PENDING");

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Delivery Management Dashboard</h1>
              <p className="text-sm text-slate-500 mt-0.5">Today • Live Operations • Multan</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">
                🔄 Sync
              </button>
              <button className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl shadow-md shadow-orange-200">
                + Create New Order
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Cards - now live */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="TOTAL REVENUE" value={`Rs. ${stats.totalRevenue}`} subtitle="Delivered orders" color="blue" />
            <StatCard title="PENDING ORDERS" value={stats.pendingOrders} subtitle="Unassigned in queue" color="orange" badge={`${stats.pendingOrders} Unassigned`} />
            <StatCard title="NEEDS ATTENTION" value={stats.needsAttention} subtitle="Action Required" color="red" badge={stats.pendingOrders > 0 ? "Delayed > 10 min" : "All clear"} />
            <StatCard title="ACTIVE DELIVERIES" value={stats.activeDeliveries} subtitle="On Road" color="purple" />
            <StatCard title="RIDER UTILIZATION" value={`${stats.riderUtilization}%`} subtitle={`${riders.filter(r => r.status === "ON_DELIVERY").length} of ${riders.length} Active`} color="green" />
            <StatCard title="FLEET" value={`${riders.length} Drivers`} subtitle={`${riders.filter(r => r.status === "AVAILABLE").length} Standby`} color="indigo" />
          </div>

          {/* Live GPS + Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-slate-900">Live GPS Fleet Map</h2>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-live"></span>
                    LIVE
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span> On Delivery
                  </span>
                </div>
              </div>
              
              <div className="h-96 relative map-grid bg-gradient-to-br from-slate-50 via-blue-50/40 to-emerald-50/30">
                <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 180 Q200 120 400 200 T800 160" stroke="#94a3b8" strokeWidth="3" fill="none"/>
                  <path d="M100 0 Q150 200 120 400" stroke="#94a3b8" strokeWidth="2" fill="none"/>
                  <path d="M300 0 Q280 250 350 400" stroke="#94a3b8" strokeWidth="2.5" fill="none"/>
                  <path d="M500 50 Q520 200 480 380" stroke="#94a3b8" strokeWidth="2" fill="none"/>
                  <path d="M0 300 H800" stroke="#cbd5e1" strokeWidth="1.5" fill="none"/>
                </svg>

                {riders.map((rider, i) => {
                  const positions = [
                    { top: "28%", left: "22%" },
                    { top: "45%", left: "58%" },
                    { top: "62%", left: "35%" },
                    { top: "35%", left: "72%" },
                  ];
                  const pos = positions[i] || positions[0];
                  const isBusy = rider.status === "ON_DELIVERY";
                  
                  return (
                    <div
                      key={rider.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      style={{ top: pos.top, left: pos.left }}
                    >
                      <div className="relative flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ${
                          isBusy 
                            ? "bg-gradient-to-br from-orange-500 to-orange-600 ring-4 ring-orange-200" 
                            : "bg-gradient-to-br from-emerald-500 to-emerald-600 ring-4 ring-emerald-200"
                        }`}>
                          🛵
                        </div>
                        <div className={`mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-sm whitespace-nowrap ${
                          isBusy ? "bg-orange-500 text-white" : "bg-emerald-500 text-white"
                        }`}>
                          {rider.name.split(" ")[0]}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-md border border-slate-200">
                  <p className="text-xs font-medium text-slate-600">📍 Multan City • Live Tracking Active</p>
                </div>
              </div>
            </div>

            {/* Fleet Telemetry - live */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Fleet Live Telemetry</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time rider status</p>
              </div>
              <div className="p-4 space-y-3">
                {riders.map((rider) => {
                  const isBusy = rider.status === "ON_DELIVERY";
                  return (
                    <div
                      key={rider.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all hover:shadow-md ${
                        isBusy 
                          ? "bg-orange-50/50 border-orange-100" 
                          : "bg-emerald-50/50 border-emerald-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow ${
                          isBusy ? "bg-orange-500" : "bg-emerald-500"
                        }`}>
                          {rider.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{rider.name}</p>
                          <p className="text-[11px] text-slate-500">{rider.phone}</p>
                        </div>
                      </div>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                        isBusy
                          ? "bg-orange-100 text-orange-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {isBusy ? "On Delivery" : "Available"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Pending Orders - live */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Recent Orders (Pending)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Awaiting kitchen / dispatch</p>
              </div>
              <a href="/orders" className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline">
                View All →
              </a>
            </div>
            <div className="overflow-x-auto">
              {pendingOrders.length === 0 ? (
                <div className="p-10 text-center text-slate-400">
                  <p className="text-lg">✅ No pending orders</p>
                  <p className="text-sm mt-1">All orders dispatched or delivered</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider">Customer</th>
                      <th className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider">Order #</th>
                      <th className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider">Items</th>
                      <th className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider">Amount</th>
                      <th className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/80">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">{order.customerName}</p>
                          <p className="text-xs text-slate-500">{order.customerPhone}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-600 font-mono text-xs">{order.orderNumber}</td>
                        <td className="px-5 py-4 text-slate-700">
                          {order.items.map((i, idx) => (
                            <span key={idx}>{i.name} <span className="text-slate-400">({i.size})</span></span>
                          ))}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-900">Rs. {order.total}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full border border-orange-100">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse-live"></span>
                            Pending
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                            order.source === "VOICE" 
                              ? "bg-purple-50 text-purple-700 border border-purple-100" 
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}>
                            {order.source}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, subtitle, color, badge }) {
  const styles = {
    blue:   { bg: "bg-blue-50", border: "border-blue-100", value: "text-blue-700" },
    orange: { bg: "bg-orange-50", border: "border-orange-100", value: "text-orange-700" },
    red:    { bg: "bg-red-50", border: "border-red-100", value: "text-red-700" },
    purple: { bg: "bg-purple-50", border: "border-purple-100", value: "text-purple-700" },
    green:  { bg: "bg-emerald-50", border: "border-emerald-100", value: "text-emerald-700" },
    indigo: { bg: "bg-indigo-50", border: "border-indigo-100", value: "text-indigo-700" },
  };
  const s = styles[color] || styles.blue;

  return (
    <div className={`rounded-2xl border p-4 ${s.bg} ${s.border} shadow-sm hover:shadow-md transition-shadow`}>
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
      <p className={`text-2xl font-bold mt-1.5 tracking-tight ${s.value}`}>{value}</p>
      <p className="text-[11px] text-slate-500 mt-1">{subtitle}</p>
      {badge && (
        <span className="inline-block mt-2.5 text-[10px] px-2 py-0.5 bg-white/70 rounded-md text-slate-600 font-medium border border-white">
          {badge}
        </span>
      )}
    </div>
  );
}
