"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";
import {
  getWelcomeMessage,
  getMenuText,
  getOrderConfirmation,
  parseUserMessage,
  createOrderFromBot,
  MENU,
} from "@/lib/whatsapp-bot";

function getTime() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export default function WhatsAppBotPage() {
  const { addOrder } = useApp();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState({
    step: "idle",
    pendingItem: null,
    pendingSize: null,
    customerName: "",
    customerPhone: "",
    address: "",
  });
  const bottomRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: 1,
        from: "bot",
        text: getWelcomeMessage(),
        time: getTime(),
      },
    ]);
  }, []);

  useEffect(() => {
    if (mounted) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, mounted]);

  const addBotMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        from: "bot",
        text,
        time: getTime(),
      },
    ]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        from: "user",
        text,
        time: getTime(),
      },
    ]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    addUserMessage(userText);
    setInput("");
    setTimeout(() => processMessage(userText), 600);
  };

  const processMessage = (text) => {
    const lower = text.toLowerCase().trim();

    if (session.step === "waiting_size") {
      const sizeMap = { large: "Large", l: "Large", regular: "Regular", r: "Regular", small: "Small", s: "Small" };
      const sizeMatch = lower.match(/\b(large|regular|small|l|r|s)\b/);
      if (sizeMatch) {
        const size = sizeMap[sizeMatch[1]];
        setSession((s) => ({ ...s, pendingSize: size, step: "waiting_name" }));
        addBotMessage(`✅ *${session.pendingItem.name} (${size})* selected.\n\nApna *Name* batayein please:`);
      } else {
        addBotMessage("Size batayein: *Large*, *Regular* ya *Small*");
      }
      return;
    }

    if (session.step === "waiting_name") {
      setSession((s) => ({ ...s, customerName: text, step: "waiting_phone" }));
      addBotMessage(`Shukriya ${text}!\n\nApna *Phone Number* likhein (03XX...):`);
      return;
    }

    if (session.step === "waiting_phone") {
      setSession((s) => ({ ...s, customerPhone: text.replace(/\D/g, ""), step: "waiting_address" }));
      addBotMessage("Ab *Delivery Address* likhein (Colony / Area / House no.):");
      return;
    }

    if (session.step === "waiting_address") {
      const order = createOrderFromBot({
        item: session.pendingItem,
        size: session.pendingSize,
        qty: 1,
        customerName: session.customerName,
        customerPhone: session.customerPhone,
        address: text,
      });
      addOrder(order);
      addBotMessage(getOrderConfirmation(order));
      addBotMessage("Aapka order *Dashboard* pe aa gaya hai. Kitchen queue mein add ho gaya. 🍕");
      setSession({
        step: "idle",
        pendingItem: null,
        pendingSize: null,
        customerName: "",
        customerPhone: "",
        address: "",
      });
      return;
    }

    const parsed = parseUserMessage(text);

    if (parsed.intent === "GREETING") {
      addBotMessage(getWelcomeMessage());
      return;
    }

    if (parsed.intent === "MENU") {
      addBotMessage(getMenuText());
      return;
    }

    if (parsed.intent === "ORDER") {
      setSession({
        step: "waiting_name",
        pendingItem: parsed.item,
        pendingSize: parsed.size,
        customerName: "",
        customerPhone: "",
        address: "",
      });
      addBotMessage(
        `✅ *${parsed.item.name} (${parsed.size})* - Rs.${parsed.item[parsed.size.toLowerCase()]}\n\nApna *Name* batayein please:`
      );
      return;
    }

    if (parsed.intent === "NEED_SIZE") {
      setSession((s) => ({
        ...s,
        step: "waiting_size",
        pendingItem: parsed.item,
      }));
      addBotMessage(
        `*${parsed.item.name}* ke liye size choose karein:\n\n• Large - Rs.${parsed.item.large}\n• Regular - Rs.${parsed.item.regular}\n• Small - Rs.${parsed.item.small}\n\nReply: *Large* / *Regular* / *Small*`
      );
      return;
    }

    addBotMessage(
      "Samajh nahi aya 😅\n\n• *menu* likhein menu dekhne ke liye\n• Order ke liye: *Chicken Tikka Large* ya *8 Large*\n• Ya *hi* likhein"
    );
  };

  const quickReplies = ["menu", "Chicken Tikka Large", "Arabic Green Large", "B.B.Q Tikka Large", "hi"];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">WhatsApp Bot Simulator</h1>
            <p className="text-sm text-slate-500">Exact flow from videos • Orders go live to Dashboard</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-live"></span>
            <span className="text-emerald-600 font-medium">Bot Online</span>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-lg">
                🍕
              </div>
              <div>
                <p className="font-semibold">Pizza Lab</p>
                <p className="text-xs text-green-200">online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#ECE5DD]">
              {!mounted && (
                <div className="text-center text-slate-400 text-sm py-8">Loading chat...</div>
              )}
              {mounted &&
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 shadow-sm ${
                        msg.from === "user"
                          ? "bg-[#DCF8C6] rounded-br-none"
                          : "bg-white rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap text-slate-800">{msg.text}</p>
                      <p className="text-[10px] text-slate-400 text-right mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              <div ref={bottomRef} />
            </div>

            <div className="bg-white border-t border-slate-200 px-3 py-2 flex gap-2 overflow-x-auto">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    addUserMessage(q);
                    setTimeout(() => processMessage(q), 600);
                  }}
                  className="shrink-0 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-orange-50 text-slate-700 rounded-full border border-slate-200"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="bg-white border-t border-slate-200 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 border border-slate-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={handleSend}
                className="w-11 h-11 bg-[#075E54] hover:bg-[#064e46] text-white rounded-full flex items-center justify-center shadow"
              >
                ➤
              </button>
            </div>
          </div>

          <div className="hidden lg:block w-80 border-l border-slate-200 bg-white p-5 overflow-y-auto">
            <h3 className="font-semibold text-slate-900 mb-3">How to test</h3>
            <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
              <li>Type <strong>menu</strong> for full menu</li>
              <li>Type <strong>Chicken Tikka Large</strong> or <strong>8 Large</strong></li>
              <li>Bot will ask Name → Phone → Address</li>
              <li>Order automatically appears on Dashboard</li>
              <li>Go to Dispatch and assign a rider</li>
            </ol>

            <div className="mt-6 p-3 bg-orange-50 rounded-xl border border-orange-100">
              <p className="text-xs font-semibold text-orange-700 mb-1">Real WhatsApp API</p>
              <p className="text-xs text-orange-600">
                Jab Meta Cloud API credentials doge, yehi logic real WhatsApp pe chalega.
              </p>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Popular Items</p>
              <div className="space-y-1">
                {MENU.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const msg = `${item.name} Large`;
                      addUserMessage(msg);
                      setTimeout(() => processMessage(msg), 600);
                    }}
                    className="w-full text-left text-xs px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700"
                  >
                    {item.name} — Rs.{item.large}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
