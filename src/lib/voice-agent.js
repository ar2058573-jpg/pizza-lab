// AI Voice Agent Logic - matching Pizza Lab video flows (Urdu + English)

import { MENU } from "./whatsapp-bot";

export const VOICE_MENU = MENU;

export function getVoiceWelcome() {
  return "Assalam o Alaikum! Pizza Lab mein khush amdeed. Main aapka AI assistant hoon. Aap order place karna chahte hain? Menu sunna hai to 'menu' kahiye, ya seedha order batayein.";
}

export function getVoiceMenu() {
  let text = "Yeh raha hamara menu. ";
  VOICE_MENU.slice(0, 8).forEach((item, i) => {
    text += `${i + 1}. ${item.name}, Large ${item.large} rupay. `;
  });
  text += "Order ke liye item ka naam aur size batayein. Jaise Chicken Tikka Large.";
  return text;
}

export function parseVoiceInput(text) {
  const lower = (text || "").toLowerCase().trim();

  if (!lower) return { intent: "EMPTY" };

  // Greetings
  if (["salam", "hello", "hi", "assalam", "aoa"].some((g) => lower.includes(g))) {
    return { intent: "GREETING" };
  }

  // Menu
  if (lower.includes("menu") || lower.includes("menue") || lower.includes("list")) {
    return { intent: "MENU" };
  }

  // Size
  const sizeMap = { large: "Large", l: "Large", regular: "Regular", r: "Regular", small: "Small", s: "Small" };
  const sizeMatch = lower.match(/\b(large|regular|small|l|r|s)\b/);
  const size = sizeMatch ? sizeMap[sizeMatch[1]] : null;

  // Number based: "8 large"
  const numMatch = lower.match(/(\d+)\s*(large|regular|small|l|r|s)?/);
  if (numMatch) {
    const idx = parseInt(numMatch[1], 10) - 1;
    if (idx >= 0 && idx < VOICE_MENU.length) {
      return {
        intent: "ORDER",
        item: VOICE_MENU[idx],
        size: numMatch[2] ? sizeMap[numMatch[2]] : "Large",
        qty: 1,
      };
    }
  }

  // Best menu match (prefer full name)
  let matchedItem = null;
  let bestScore = 0;
  for (const item of VOICE_MENU) {
    const nameLower = item.name.toLowerCase();
    let score = 0;
    if (lower.includes(nameLower)) {
      score = 100 + nameLower.length;
    } else {
      const words = nameLower.split(/[\s.]+/).filter((w) => w.length > 1);
      const matched = words.filter((w) => lower.includes(w));
      if (matched.length === words.length && words.length > 0) {
        score = 80 + matched.join("").length;
      } else if (matched.length >= 2) {
        score = 50 + matched.join("").length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      matchedItem = item;
    }
  }
  if (bestScore < 20) matchedItem = null;

  if (matchedItem && size) {
    return { intent: "ORDER", item: matchedItem, size, qty: 1 };
  }

  if (matchedItem) {
    return { intent: "NEED_SIZE", item: matchedItem };
  }

  // Yes / confirm
  if (["haan", "han", "yes", "ji", "theek", "ok", "okay", "confirm"].some((w) => lower.includes(w))) {
    return { intent: "CONFIRM" };
  }

  // No
  if (["nahi", "no", "cancel", "mat"].some((w) => lower.includes(w))) {
    return { intent: "CANCEL" };
  }

  return { intent: "UNKNOWN", text: lower };
}

export function createVoiceOrder({ item, size, qty = 1, customerName, customerPhone, address }) {
  const priceKey = size.toLowerCase();
  const price = item[priceKey] || item.large;
  const orderNumber = `#PL${Date.now().toString().slice(-10)}`;

  return {
    id: `voice-${Date.now()}`,
    orderNumber,
    customerName: customerName || "Voice Customer",
    customerPhone: customerPhone || "923000000000",
    address: address || "Address pending",
    items: [{ name: item.name, size, qty, price }],
    total: price * qty,
    status: "PENDING",
    source: "VOICE",
    createdAt: new Date().toISOString(),
    shipping: 0,
  };
}

export function getVoiceResponses() {
  return {
    askSize: (item) =>
      `${item.name} ke liye size batayein. Large ${item.large} rupay, Regular ${item.regular} rupay, ya Small ${item.small} rupay.`,
    askName: "Apna naam batayein please.",
    askPhone: "Apna phone number batayein.",
    askAddress: "Delivery address batayein. Colony, area, ya house number.",
    confirmOrder: (order) =>
      `Aapka order hai: ${order.items[0].qty} ${order.items[0].name} ${order.items[0].size}, kul ${order.total} rupay. Address: ${order.address}. Confirm karne ke liye haan kahiye.`,
    orderPlaced: (order) =>
      `Shukriya! Aapka order ${order.orderNumber} confirm ho gaya hai. Kul ${order.total} rupay, cash on delivery. Kitchen mein chala gaya hai. Allah hafiz!`,
    notUnderstood: "Maaf kijiye, samajh nahi aya. Menu ke liye menu kahiye, ya item ka naam aur size batayein.",
    goodbye: "Allah hafiz! Pizza Lab choose karne ka shukriya.",
  };
}
