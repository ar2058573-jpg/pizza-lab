"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";
import {
  getVoiceWelcome,
  getVoiceMenu,
  parseVoiceInput,
  createVoiceOrder,
  getVoiceResponses,
} from "@/lib/voice-agent";

export default function VoiceAgentPage() {
  const { addOrder } = useApp();
  const [status, setStatus] = useState("idle"); // idle | listening | speaking | processing
  const [transcript, setTranscript] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [session, setSession] = useState({
    step: "idle",
    pendingItem: null,
    pendingSize: null,
    customerName: "",
    customerPhone: "",
    address: "",
  });
  const [inputText, setInputText] = useState("");
  const [mounted, setMounted] = useState(false);
  const bottomRef = useRef(null);
  const responses = getVoiceResponses();

  useEffect(() => {
    setMounted(true);
    setSessionId(`VS-${Date.now().toString().slice(-8)}`);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const speak = (text) => {
    setStatus("speaking");
    setTranscript((prev) => [
      ...prev,
      { id: Date.now(), role: "agent", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);

    // Browser TTS if available
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; // Urdu support limited in most browsers
      utterance.rate = 0.9;
      utterance.onend = () => setStatus("idle");
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const startCall = () => {
    setTranscript([]);
    setSession({
      step: "greeting",
      pendingItem: null,
      pendingSize: null,
      customerName: "",
      customerPhone: "",
      address: "",
    });
    setStatus("speaking");
    setTimeout(() => {
      speak(getVoiceWelcome());
    }, 400);
  };

  const endCall = () => {
    setStatus("idle");
    setSession({
      step: "idle",
      pendingItem: null,
      pendingSize: null,
      customerName: "",
      customerPhone: "",
      address: "",
    });
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const processUserSpeech = (text) => {
    if (!text.trim()) return;

    setTranscript((prev) => [
      ...prev,
      { id: Date.now() + 1, role: "user", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setStatus("processing");

    setTimeout(() => {
      handleIntent(text);
    }, 500);
  };

  const handleIntent = (text) => {
    const lower = text.toLowerCase().trim();

    // Multi-step flow
    if (session.step === "waiting_size") {
      const parsed = parseVoiceInput(text);
      if (parsed.intent === "ORDER" || lower.match(/\b(large|regular|small|l|r|s)\b/)) {
        const sizeMap = { large: "Large", l: "Large", regular: "Regular", r: "Regular", small: "Small", s: "Small" };
        const sizeMatch = lower.match(/\b(large|regular|small|l|r|s)\b/);
        const size = sizeMatch ? sizeMap[sizeMatch[1]] : "Large";
        setSession((s) => ({ ...s, pendingSize: size, step: "waiting_name" }));
        speak(`Theek hai, ${session.pendingItem.name} ${size}. ${responses.askName}`);
      } else {
        speak(responses.askSize(session.pendingItem));
      }
      return;
    }

    if (session.step === "waiting_name") {
      setSession((s) => ({ ...s, customerName: text, step: "waiting_phone" }));
      speak(`Shukriya ${text}. ${responses.askPhone}`);
      return;
    }

    if (session.step === "waiting_phone") {
      setSession((s) => ({ ...s, customerPhone: text.replace(/\D/g, "") || text, step: "waiting_address" }));
      speak(responses.askAddress);
      return;
    }

    if (session.step === "waiting_address") {
      const order = createVoiceOrder({
        item: session.pendingItem,
        size: session.pendingSize,
        qty: 1,
        customerName: session.customerName,
        customerPhone: session.customerPhone,
        address: text,
      });
      setSession((s) => ({ ...s, address: text, step: "confirming", pendingOrder: order }));
      speak(responses.confirmOrder(order));
      return;
    }

    if (session.step === "confirming") {
      const parsed = parseVoiceInput(text);
      if (parsed.intent === "CONFIRM" || lower.includes("haan") || lower.includes("yes")) {
        const order = session.pendingOrder;
        addOrder(order);
        speak(responses.orderPlaced(order));
        setTimeout(() => {
          setSession({
            step: "idle",
            pendingItem: null,
            pendingSize: null,
            customerName: "",
            customerPhone: "",
            address: "",
          });
        }, 3000);
      } else if (parsed.intent === "CANCEL") {
        speak("Order cancel kar diya. Kuch aur order karna hai?");
        setSession({
          step: "greeting",
          pendingItem: null,
          pendingSize: null,
          customerName: "",
          customerPhone: "",
          address: "",
        });
      } else {
        speak("Confirm karne ke liye haan kahiye, ya cancel ke liye nahi.");
      }
      return;
    }

    // Normal intents
    const parsed = parseVoiceInput(text);

    if (parsed.intent === "GREETING") {
      speak(getVoiceWelcome());
      return;
    }

    if (parsed.intent === "MENU") {
      speak(getVoiceMenu());
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
      speak(`${parsed.item.name} ${parsed.size}, ${parsed.item[parsed.size.toLowerCase()]} rupay. ${responses.askName}`);
      return;
    }

    if (parsed.intent === "NEED_SIZE") {
      setSession((s) => ({ ...s, step: "waiting_size", pendingItem: parsed.item }));
      speak(responses.askSize(parsed.item));
      return;
    }

    speak(responses.notUnderstood);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || status === "speaking") return;
    const text = inputText.trim();
    setInputText("");
    processUserSpeech(text);
  };

  // Simulate microphone listening
  const startListening = () => {
    if (status === "speaking") return;
    setStatus("listening");
    // In real version: Web Speech API or Vapi/Retell
    // For now user types or uses quick buttons
  };

  const isCallActive = session.step !== "idle" || transcript.length > 0;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI Voice Agent</h1>
              <p className="text-sm text-slate-500">Urdu + English • Order taking simulation</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${status !== "idle" ? "bg-emerald-500 animate-pulse-live" : "bg-slate-300"}`}></span>
              <span className="text-slate-600 font-medium capitalize">{status}</span>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          {/* Voice Control Panel - matching video style */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-2xl">
                  🎙️
                </div>
                <div>
                  <p className="font-semibold">Pizza Lab AI Agent</p>
                  <p className="text-xs text-slate-400">Session: {sessionId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {status === "listening" && (
                  <span className="px-3 py-1 bg-red-500/20 text-red-300 text-xs font-medium rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse-live"></span>
                    Listening
                  </span>
                )}
                {status === "speaking" && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-live"></span>
                    Speaking
                  </span>
                )}
                {status === "processing" && (
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-medium rounded-full">
                    Processing...
                  </span>
                )}
              </div>
            </div>

            {/* Waveform / Status area */}
            <div className="h-32 bg-slate-50 flex items-center justify-center relative">
              {status === "idle" && !isCallActive && (
                <p className="text-slate-400 text-sm">Call start karein order lene ke liye</p>
              )}
              {(status === "listening" || status === "speaking") && (
                <div className="flex items-end gap-1 h-16">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full ${
                        status === "speaking" ? "bg-orange-500" : "bg-emerald-500"
                      }`}
                      style={{
                        height: `${20 + Math.sin(Date.now() / 200 + i) * 30 + Math.random() * 20}%`,
                        animation: "pulse 0.5s ease-in-out infinite",
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>
              )}
              {status === "processing" && (
                <div className="text-slate-500 text-sm animate-pulse">Samajh raha hoon...</div>
              )}
            </div>

            {/* Controls */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-center gap-4">
              {!isCallActive ? (
                <button
                  onClick={startCall}
                  className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold shadow-lg shadow-orange-200 hover:from-orange-600 hover:to-orange-700 flex items-center gap-2"
                >
                  📞 Start Call
                </button>
              ) : (
                <>
                  <button
                    onClick={startListening}
                    disabled={status === "speaking"}
                    className={`px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 ${
                      status === "listening"
                        ? "bg-red-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    🎤 {status === "listening" ? "Listening..." : "Push to Talk"}
                  </button>
                  <button
                    onClick={endCall}
                    className="px-6 py-3 bg-slate-800 text-white rounded-2xl font-semibold hover:bg-slate-900"
                  >
                    📵 End Call
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Transcript */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Live Transcript</h2>
              <span className="text-xs text-slate-400">{transcript.length} messages</span>
            </div>
            <div className="h-72 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {transcript.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-10">Call start karein — conversation yahan dikhegi</p>
              )}
              {transcript.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-orange-500 text-white rounded-br-md"
                        : "bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.role === "user" ? "text-orange-100" : "text-slate-400"}`}>
                      {msg.role === "agent" ? "🤖 Agent" : "👤 You"} • {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Text input (for simulation without mic) */}
            {isCallActive && (
              <form onSubmit={handleTextSubmit} className="p-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type what you would say... (e.g. menu, Chicken Tikka Large)"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  disabled={status === "speaking"}
                />
                <button
                  type="submit"
                  disabled={status === "speaking" || !inputText.trim()}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white rounded-xl text-sm font-semibold"
                >
                  Send
                </button>
              </form>
            )}
          </div>

          {/* Quick phrases */}
          {isCallActive && (
            <div className="flex flex-wrap gap-2">
              {["menu", "Chicken Tikka Large", "Arabic Green Large", "B.B.Q Tikka Large", "haan", "nahi"].map((q) => (
                <button
                  key={q}
                  onClick={() => processUserSpeech(q)}
                  disabled={status === "speaking"}
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 hover:bg-orange-50 hover:border-orange-200 rounded-full text-slate-700 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
            <p className="font-semibold mb-1">How to test</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>Start Call dabao</li>
              <li>Type or click: <strong>menu</strong> ya <strong>Chicken Tikka Large</strong></li>
              <li>Name → Phone → Address batao</li>
              <li><strong>haan</strong> se confirm karo</li>
              <li>Order Dashboard pe aa jayega (source: VOICE)</li>
            </ol>
            <p className="mt-2 text-xs text-blue-600">
              Real voice ke liye baad mein Vapi.ai / Retell / Twilio connect hoga. Abhi browser TTS + text simulation hai.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
