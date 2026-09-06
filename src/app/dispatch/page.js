"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";

export default function DispatchPage() {
  const { orders, riders, stats, assignOrder, autoDispatch } = useApp();
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedRider, setSelectedRider] = useState("");
  const [message, setMessage] = useState("");

  const pending = orders.filter((o) => o.status === "PENDING");
  const availableRiders = riders.filter((r) => r.status === "AVAILABLE");
  const onDelivery = riders.filter((r) => r.status === "ON_DELIVERY");

  const handleAssign = (orderId, riderId) => {
    if (!orderId || !riderId) {
      setMessage("⚠️ Select both order and rider");
      return;
    }
    assignOrder(orderId, riderId);
    setMessage(`✅ Order assigned successfully!`);
    setSelectedOrder("");
    setSelectedRider("");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAuto = () => {
    const ok = autoDispatch();
    setMessage(ok ? "✅ Auto-dispatched 1 order" : "⚠️ No pending orders or available riders");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Dispatch</h1>
              <p className="text-sm text-slate-500">Kitchen Queue → Rider Assignment</p>
            </div>
            <button
              onClick={handleAuto}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-md shadow-orange-200 hover:from-orange-600 hover:to-orange-700"
            >
              ⚡ Auto-Dispatch All (AI)
            </button>
          </div>
        </header>

        <div className="p-6">
          {message && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
              message.includes("✅") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}>
              {message}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-orange-700">{pending.length}</p>
              <p className="text-xs text-orange-600 uppercase mt-1 font-semibold">Unassigned Queue</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-emerald-700">{availableRiders.length}</p>
              <p className="text-xs text-emerald-600 uppercase mt-1 font-semibold">Ready Couriers</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-blue-700">{stats.outForDelivery}</p>
              <p className="text-xs text-blue-600 uppercase mt-1 font-semibold">In Transit</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-slate-800">{riders.length}</p>
              <p className="text-xs text-slate-500 uppercase mt-1 font-semibold">Fleet Total</p>
            </div>
          </div>

          {/* Quick Assign Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-3">Quick Order Dispatch</h2>
            <p className="text-sm text-slate-500 mb-4">Select an unassigned kitchen order and assign to any available driver in one click.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <option value="">Select Pending Order...</option>
                {pending.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} — {o.customerName} (Rs. {o.total})
                  </option>
                ))}
              </select>
              <select
                value={selectedRider}
                onChange={(e) => setSelectedRider(e.target.value)}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <option value="">Select Available Rider...</option>
                {availableRiders.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <button
                onClick={() => handleAssign(selectedOrder, selectedRider)}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold shadow-sm"
              >
                Dispatch Order to Rider
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kitchen Queue */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Kitchen Queue • {pending.length} Pending</h2>
              </div>
              {pending.length === 0 ? (
                <div className="p-10 text-center text-slate-400">
                  <p className="text-lg">✅ Queue empty</p>
                  <p className="text-sm mt-1">All orders have been dispatched</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pending.map((order) => (
                    <div key={order.id} className="p-5 hover:bg-slate-50/80 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{order.customerName}</p>
                          <p className="text-sm text-slate-500">{order.address}</p>
                          <p className="text-sm text-slate-600 mt-1">
                            {order.items.map((i) => `${i.qty}x ${i.name} (${i.size})`).join(", ")}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 font-mono">{order.orderNumber}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-lg text-slate-900">Rs. {order.total}</p>
                          <div className="mt-2 flex gap-2 justify-end">
                            <select
                              className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-white"
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) handleAssign(order.id, e.target.value);
                              }}
                            >
                              <option value="">Select Driver</option>
                              {availableRiders.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => {
                                if (availableRiders[0]) handleAssign(order.id, availableRiders[0].id);
                              }}
                              disabled={availableRiders.length === 0}
                              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white text-xs rounded-lg font-semibold"
                            >
                              Auto
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fleet Status */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Fleet ({riders.length})</h2>
              </div>
              <div className="p-4 space-y-3">
                {riders.map((rider) => (
                  <div
                    key={rider.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border ${
                      rider.status === "AVAILABLE"
                        ? "bg-emerald-50/50 border-emerald-100"
                        : "bg-orange-50/50 border-orange-100"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm text-slate-900">{rider.name}</p>
                      <p className="text-xs text-slate-500">{rider.phone}</p>
                      {rider.currentOrderId && (
                        <p className="text-[10px] text-orange-600 mt-0.5">On order</p>
                      )}
                    </div>
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                        rider.status === "AVAILABLE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {rider.status === "AVAILABLE" ? "Available" : "On Delivery"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
