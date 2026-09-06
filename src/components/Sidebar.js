"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/", icon: "📊" },
  { name: "Orders", href: "/orders", icon: "📦" },
  { name: "Customers", href: "/customers", icon: "👥" },
  { name: "Riders & Fleet", href: "/riders", icon: "🛵" },
  { name: "Dispatch", href: "/dispatch", icon: "🚀" },
  { name: "WhatsApp Bot", href: "/whatsapp", icon: "💬" },
  { name: "AI Voice Agent", href: "/voice", icon: "🎙️" },
  { name: "Rider Terminal", href: "/rider", icon: "📱" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col shadow-sm">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md shadow-orange-200">
            🍕
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 tracking-tight">Pizza Lab</h1>
            <p className="text-[11px] text-slate-500 font-medium">Multan Kitchen & Fleet</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3 px-3 pt-2">
          Main Navigation
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-orange-50 text-orange-600 shadow-sm shadow-orange-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="text-base w-6 text-center">{item.icon}</span>
              <span>{item.name}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3.5 border border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse-live"></div>
            </div>
            <span className="text-xs font-semibold text-emerald-700">AI Agent Online</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-1.5 pl-5">Voice + WhatsApp Ready</p>
        </div>
      </div>
    </aside>
  );
}
