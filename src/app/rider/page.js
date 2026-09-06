"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

export default function RiderTerminal() {
  const { orders, riders, completeDelivery } = useApp();
  const [step, setStep] = useState("ready");
  const [selectedRiderId, setSelectedRiderId] = useState("r1"); // Default Haris

  const currentRider = riders.find((r) => r.id === selectedRiderId) || riders[0];
  const activeOrder = orders.find(
    (o) => o.id === currentRider?.currentOrderId && o.status === "OUT_FOR_DELIVERY"
  );

  // When rider gets an order, auto switch to assigned
  useEffect(() => {
    if (activeOrder && step === "ready") {
      setStep("assigned");
    }
    if (!activeOrder && step !== "ready" && step !== "completed") {
      setStep("ready");
    }
  }, [activeOrder, step]);

  const handleComplete = () => {
    if (activeOrder && currentRider) {
      completeDelivery(activeOrder.id, currentRider.id, activeOrder.total);
      setStep("completed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                {currentRider?.name?.split(" ").map(n => n[0]).join("") || "HS"}
              </div>
              <div>
                <p className="font-semibold">{currentRider?.name || "Haris Sohail"}</p>
                <p className="text-xs text-slate-400">Rider Terminal • Multan</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-live"></span>
              <span className="text-xs font-medium text-emerald-300">Online</span>
            </div>
          </div>
          {/* Rider switcher for testing */}
          <select
            value={selectedRiderId}
            onChange={(e) => {
              setSelectedRiderId(e.target.value);
              setStep("ready");
            }}
            className="w-full bg-slate-700 text-white text-xs rounded-lg px-2 py-1.5 border-none"
          >
            {riders.map((r) => (
              <option key={r.id} value={r.id}>
                Switch to: {r.name} ({r.status})
              </option>
            ))}
          </select>
        </div>

        {(step === "ready" || !activeOrder) && step !== "completed" && (
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">
              📦
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No Active Deliveries</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              You are online and ready. Go to <strong>Dispatch</strong> page and assign an order to this rider. It will appear here automatically.
            </p>
            <a
              href="/dispatch"
              className="inline-block w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold shadow-lg shadow-orange-200 text-center"
            >
              Go to Dispatch →
            </a>
          </div>
        )}

        {activeOrder && step !== "ready" && step !== "completed" && (
          <div className="p-5 space-y-4">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-3.5 text-center">
              <p className="text-[10px] text-orange-600 font-semibold uppercase tracking-wider">Promised Delivery</p>
              <p className="text-2xl font-bold text-orange-700 mt-0.5">15 MIN LEFT</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider mb-1">Delivery Destination</p>
              <p className="font-semibold text-slate-900 leading-snug">{activeOrder.address}</p>
              <p className="text-sm text-slate-500 mt-1.5">2.4 km • ~7 min</p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-sm">
                🧭 Navigate
              </button>
              <button className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
                Copy Address
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Customer</p>
                <p className="font-semibold text-slate-900">{activeOrder.customerName}</p>
                <p className="text-sm text-slate-500">{activeOrder.customerPhone}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">📞 Call</button>
                <button className="px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">💬 WA</button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-emerald-600 uppercase font-semibold tracking-wider">COD To Collect</p>
              <p className="text-3xl font-bold text-emerald-700 mt-1">Rs. {activeOrder.total}</p>
              <p className="text-xs text-emerald-600 mt-0.5">Cash on Delivery</p>
            </div>

            <div className="text-sm text-slate-600">
              <span className="text-slate-400 text-xs uppercase font-semibold">Items • </span>
              {activeOrder.items.map((i) => `${i.qty}x ${i.name} (${i.size})`).join(", ")}
            </div>

            {/* Progress */}
            <div className="pt-1">
              <div className="flex gap-1 mb-3">
                {["assigned", "to_restaurant", "picked", "to_customer", "arrived"].map((s, i) => {
                  const order = ["assigned", "to_restaurant", "picked", "to_customer", "arrived"];
                  const idx = order.indexOf(step);
                  return (
                    <div
                      key={s}
                      className={`h-1.5 flex-1 rounded-full ${i <= idx ? "bg-orange-500" : "bg-slate-200"}`}
                    />
                  );
                })}
              </div>
            </div>

            {step === "assigned" && (
              <button onClick={() => setStep("to_restaurant")} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-200">
                Accept Order →
              </button>
            )}
            {step === "to_restaurant" && (
              <button onClick={() => setStep("picked")} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-200">
                Arrived at Restaurant →
              </button>
            )}
            {step === "picked" && (
              <button onClick={() => setStep("to_customer")} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-200">
                Picked Up - Verify Package →
              </button>
            )}
            {step === "to_customer" && (
              <button onClick={() => setStep("arrived")} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-200">
                I've Arrived at Customer →
              </button>
            )}
            {step === "arrived" && (
              <button onClick={handleComplete} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-semibold shadow-lg shadow-emerald-200">
                Complete Delivery & Collect Cash →
              </button>
            )}
          </div>
        )}

        {step === "completed" && (
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">
              ✅
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Delivery Completed!</h2>
            <p className="text-emerald-600 font-semibold mb-1">Cash collected successfully</p>
            <p className="text-slate-400 text-xs mb-8">Order marked as delivered</p>
            <button
              onClick={() => setStep("ready")}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold shadow-lg shadow-orange-200"
            >
              Back to Ready
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
