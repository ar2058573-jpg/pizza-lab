"use client";

import Sidebar from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";

export default function CustomersPage() {
  const { customers } = useApp();
  const totalSpend = customers.reduce((sum, c) => sum + c.lifetimeSpend, 0);
  const avgSpend = Math.round(totalSpend / customers.length) || 0;
  const vipCount = customers.filter((c) => c.isVip).length;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Customers</h1>
              <p className="text-sm text-slate-500">Customer lifetime value & order history</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl">
              Export CSV
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">TOTAL CUSTOMERS</p>
              <p className="text-2xl font-bold mt-1">{customers.length}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] text-orange-600 uppercase font-semibold">VIP SPENDERS</p>
              <p className="text-2xl font-bold mt-1 text-orange-700">{vipCount}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] text-emerald-600 uppercase font-semibold">LIFETIME SPEND</p>
              <p className="text-2xl font-bold mt-1 text-emerald-700">Rs. {totalSpend.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">AVERAGE SPEND</p>
              <p className="text-2xl font-bold mt-1">Rs. {avgSpend.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Customer Roster</h2>
              <p className="text-sm text-slate-500">Showing {customers.length} registered customers</p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-xs uppercase">Customer</th>
                  <th className="text-left px-5 py-3 font-medium text-xs uppercase">Phone</th>
                  <th className="text-left px-5 py-3 font-medium text-xs uppercase">Orders</th>
                  <th className="text-left px-5 py-3 font-medium text-xs uppercase">Favourite</th>
                  <th className="text-left px-5 py-3 font-medium text-xs uppercase">Lifetime Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                          {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{c.name}</p>
                          {c.isVip && <span className="text-xs text-orange-600 font-semibold">VIP</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{c.phone}</td>
                    <td className="px-5 py-4">{c.totalOrders} Order{c.totalOrders > 1 ? "s" : ""}</td>
                    <td className="px-5 py-4 text-slate-600">Fav: {c.favourite}</td>
                    <td className="px-5 py-4 font-semibold text-orange-600">Rs. {c.lifetimeSpend.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
