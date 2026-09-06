"use client";

import Sidebar from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";

export default function RidersPage() {
  const { riders, orders, completeDelivery } = useApp();

  const available = riders.filter((r) => r.status === "AVAILABLE").length;
  const onDelivery = riders.filter((r) => r.status === "ON_DELIVERY").length;
  const totalCash = riders.reduce((s, r) => s + (r.cashInHand || 0), 0);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Riders & Fleet</h1>
              <p className="text-sm text-slate-500">{riders.length} Active Drivers</p>
            </div>
            <div className="flex gap-3">
              <a href="/rider" className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">
                Rider Portal Simulator
              </a>
              <button className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl">
                + Add Rider
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">TOTAL DRIVERS</p>
              <p className="text-2xl font-bold mt-1">{riders.length}</p>
              <p className="text-xs text-slate-400">Total registered fleet couriers</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] text-emerald-600 uppercase font-semibold">AVAILABLE STANDBY</p>
              <p className="text-2xl font-bold mt-1 text-emerald-700">{available}</p>
              <p className="text-xs text-emerald-500">Ready for instant assignment</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] text-orange-600 uppercase font-semibold">ON ACTIVE DELIVERY</p>
              <p className="text-2xl font-bold mt-1 text-orange-700">{onDelivery}</p>
              <p className="text-xs text-orange-500">Couriers currently en-route</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">COD IN TRANSIT</p>
              <p className="text-2xl font-bold mt-1">Rs. {totalCash.toLocaleString()}</p>
              <p className="text-xs text-slate-400">Pending cash collection</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riders.map((rider) => {
              const activeOrder = orders.find(
                (o) => o.id === rider.currentOrderId && o.status === "OUT_FOR_DELIVERY"
              );
              return (
                <div key={rider.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow ${
                        rider.status === "ON_DELIVERY" ? "bg-orange-500" : "bg-emerald-500"
                      }`}>
                        {rider.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{rider.name}</p>
                        <p className="text-sm text-slate-500">{rider.phone}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      rider.status === "ON_DELIVERY"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {rider.status === "ON_DELIVERY" ? "On Delivery" : "Available"}
                    </span>
                  </div>

                  <div className="text-sm text-slate-600 mb-4">
                    {activeOrder ? (
                      <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                        <p className="font-medium text-slate-900">{activeOrder.customerName}</p>
                        <p className="text-xs text-slate-500">{activeOrder.orderNumber} • Rs. {activeOrder.total}</p>
                      </div>
                    ) : (
                      <p className="text-slate-400">No active order</p>
                    )}
                    {(rider.cashInHand || 0) > 0 && (
                      <p className="mt-2 text-xs">Cash in hand: <span className="font-semibold">Rs. {rider.cashInHand}</span></p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 border border-slate-200 rounded-xl text-sm hover:bg-slate-50">Call</button>
                    <button className="flex-1 py-2 border border-slate-200 rounded-xl text-sm hover:bg-slate-50">WhatsApp</button>
                    {rider.status === "ON_DELIVERY" && activeOrder && (
                      <button
                        onClick={() => completeDelivery(activeOrder.id, rider.id, activeOrder.total)}
                        className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
