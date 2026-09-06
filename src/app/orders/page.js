"use client";

import Sidebar from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";

export default function OrdersPage() {
  const { orders, stats } = useApp();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Orders</h1>
              <p className="text-sm text-slate-500">Live Order Management • Multan Central Fleet</p>
            </div>
            <button className="px-4 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl">
              + Create New Order
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">TOTAL ORDERS</p>
              <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] text-orange-600 uppercase font-semibold">KITCHEN QUEUE</p>
              <p className="text-2xl font-bold mt-1 text-orange-700">{stats.kitchenQueue}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] text-blue-600 uppercase font-semibold">OUT FOR DELIVERY</p>
              <p className="text-2xl font-bold mt-1 text-blue-700">{stats.outForDelivery}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] text-emerald-600 uppercase font-semibold">DELIVERED</p>
              <p className="text-2xl font-bold mt-1 text-emerald-700">{stats.delivered}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">TOTAL REVENUE</p>
              <p className="text-2xl font-bold mt-1">Rs. {stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Orders Roster</h2>
              <p className="text-sm text-slate-500">Showing {orders.length} orders</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium text-xs uppercase">Customer</th>
                    <th className="text-left px-5 py-3 font-medium text-xs uppercase">Order #</th>
                    <th className="text-left px-5 py-3 font-medium text-xs uppercase">Address</th>
                    <th className="text-left px-5 py-3 font-medium text-xs uppercase">Items</th>
                    <th className="text-left px-5 py-3 font-medium text-xs uppercase">Amount</th>
                    <th className="text-left px-5 py-3 font-medium text-xs uppercase">Status</th>
                    <th className="text-left px-5 py-3 font-medium text-xs uppercase">Rider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">{order.customerName}</p>
                        <p className="text-xs text-slate-500">{order.customerPhone}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-mono text-xs">{order.orderNumber}</td>
                      <td className="px-5 py-4 text-slate-600 text-sm">{order.address}</td>
                      <td className="px-5 py-4">
                        {order.items.map((i, idx) => (
                          <div key={idx} className="text-slate-700">{i.qty}x {i.name} ({i.size})</div>
                        ))}
                      </td>
                      <td className="px-5 py-4 font-semibold">Rs. {order.total}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {order.riderName || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-orange-50 text-orange-700 border-orange-100",
    OUT_FOR_DELIVERY: "bg-blue-50 text-blue-700 border-blue-100",
    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    CONFIRMED: "bg-purple-50 text-purple-700 border-purple-100",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status] || "bg-slate-100"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status.replace(/_/g, " ")}
    </span>
  );
}
