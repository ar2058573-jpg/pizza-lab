"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  mockOrders as initialOrders,
  mockRiders as initialRiders,
  mockCustomers,
  dashboardStats as initialStats,
} from "@/lib/mock-data";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [orders, setOrders] = useState(initialOrders);
  const [riders, setRiders] = useState(initialRiders);
  const [customers, setCustomers] = useState(mockCustomers);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [dbConnected, setDbConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load from DB on mount
  useEffect(() => {
    async function loadFromDb() {
      try {
        const [ordersRes, ridersRes, customersRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/riders"),
          fetch("/api/customers"),
        ]);

        if (ordersRes.ok && ridersRes.ok) {
          const dbOrders = await ordersRes.json();
          const dbRiders = await ridersRes.json();
          const dbCustomers = customersRes.ok ? await customersRes.json() : [];

          if (Array.isArray(dbOrders)) {
            // Merge: if DB has orders use them, else keep mock
            if (dbOrders.length > 0) {
              setOrders(dbOrders);
            }
            setDbConnected(true);
          }
          if (Array.isArray(dbRiders) && dbRiders.length > 0) {
            // Attach currentOrderId from active orders
            const withOrders = dbRiders.map((r) => {
              const active = (dbOrders || []).find(
                (o) => o.riderId === r.id && o.status === "OUT_FOR_DELIVERY"
              );
              return {
                ...r,
                currentOrderId: active?.id || null,
                status: active ? "ON_DELIVERY" : r.status,
              };
            });
            setRiders(withOrders);
          }
          if (Array.isArray(dbCustomers) && dbCustomers.length > 0) {
            setCustomers(dbCustomers);
          }
        }
      } catch (err) {
        console.warn("DB not available, using mock data:", err.message);
        setDbConnected(false);
      } finally {
        setLoading(false);
        setLastUpdate(new Date().toISOString());
      }
    }
    loadFromDb();
  }, []);

  const addOrder = useCallback(async (newOrder) => {
    // Optimistic UI update
    setOrders((prev) => [newOrder, ...prev]);
    setLastUpdate(new Date().toISOString());

    // Persist to DB
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        const saved = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === newOrder.id ? { ...saved } : o))
        );
        setDbConnected(true);
        return saved;
      }
    } catch (err) {
      console.warn("Failed to save order to DB:", err.message);
    }
    return newOrder;
  }, []);

  const assignOrder = useCallback(
    async (orderId, riderId) => {
      const riderName = riders.find((r) => r.id === riderId)?.name || "Unknown";

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "OUT_FOR_DELIVERY",
                riderId,
                riderName,
                dispatchedAt: new Date().toISOString(),
              }
            : o
        )
      );

      setRiders((prev) =>
        prev.map((r) =>
          r.id === riderId
            ? { ...r, status: "ON_DELIVERY", currentOrderId: orderId }
            : r
        )
      );
      setLastUpdate(new Date().toISOString());

      try {
        await Promise.all([
          fetch(`/api/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "OUT_FOR_DELIVERY", riderId }),
          }),
          fetch("/api/riders", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: riderId, status: "ON_DELIVERY" }),
          }),
        ]);
      } catch (err) {
        console.warn("Failed to persist assign:", err.message);
      }
    },
    [riders]
  );

  const completeDelivery = useCallback(async (orderId, riderId, cashAmount) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "DELIVERED", deliveredAt: new Date().toISOString() }
          : o
      )
    );

    setRiders((prev) =>
      prev.map((r) =>
        r.id === riderId
          ? {
              ...r,
              status: "AVAILABLE",
              currentOrderId: null,
              cashInHand: (r.cashInHand || 0) + (cashAmount || 0),
            }
          : r
      )
    );
    setLastUpdate(new Date().toISOString());

    try {
      const rider = riders.find((r) => r.id === riderId);
      await Promise.all([
        fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "DELIVERED" }),
        }),
        fetch("/api/riders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: riderId,
            status: "AVAILABLE",
            cashInHand: (rider?.cashInHand || 0) + (cashAmount || 0),
          }),
        }),
      ]);
    } catch (err) {
      console.warn("Failed to persist complete:", err.message);
    }
  }, [riders]);

  const autoDispatch = useCallback(() => {
    const pending = orders.find((o) => o.status === "PENDING");
    const available = riders.find((r) => r.status === "AVAILABLE");
    if (pending && available) {
      assignOrder(pending.id, available.id);
      return true;
    }
    return false;
  }, [orders, riders, assignOrder]);

  const stats = {
    totalRevenue: orders
      .filter((o) => o.status === "DELIVERED")
      .reduce((s, o) => s + (o.total || 0), 0),
    pendingOrders: orders.filter((o) => o.status === "PENDING").length,
    needsAttention: orders.filter((o) => o.status === "PENDING").length > 0 ? 1 : 0,
    activeDeliveries: orders.filter((o) => o.status === "OUT_FOR_DELIVERY").length,
    riderUtilization: Math.round(
      (riders.filter((r) => r.status === "ON_DELIVERY").length / Math.max(riders.length, 1)) * 100
    ),
    totalOrders: orders.length,
    kitchenQueue: orders.filter((o) => o.status === "PENDING").length,
    outForDelivery: orders.filter((o) => o.status === "OUT_FOR_DELIVERY").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    totalRevenueToday: initialStats.totalRevenueToday,
  };

  return (
    <AppContext.Provider
      value={{
        orders,
        riders,
        customers,
        stats,
        lastUpdate,
        dbConnected,
        loading,
        addOrder,
        assignOrder,
        completeDelivery,
        autoDispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
