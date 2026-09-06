// WhatsApp Bot Logic - Pizza Lab

export const MENU = [
  { id: 1, name: "Chicken Fajita", large: 450, regular: 300, small: 200, aliases: ["chicken fajita", "fajita"] },
  { id: 2, name: "Malai Boti", large: 450, regular: 300, small: 200, aliases: ["malai boti", "malai"] },
  { id: 3, name: "Cheese Lover", large: 450, regular: 300, small: 200, aliases: ["cheese lover"] },
  { id: 4, name: "Green Shawarma Delight", large: 450, regular: 300, small: 200, aliases: ["green shawarma delight", "green shawarma", "shawarma delight"] },
  { id: 5, name: "Italian Lab", large: 450, regular: 300, small: 200, aliases: ["italian lab"] },
  { id: 6, name: "Fajita Sensation", large: 450, regular: 300, small: 200, aliases: ["fajita sensation"] },
  { id: 7, name: "Behari Tikka", large: 450, regular: 300, small: 200, aliases: ["behari tikka", "behari"] },
  { id: 8, name: "Chicken Tikka", large: 450, regular: 300, small: 200, aliases: ["chicken tikka"] },
  { id: 9, name: "Chicken Supreme", large: 550, regular: 350, small: 250, aliases: ["chicken supreme", "supreme"] },
  { id: 10, name: "Spicy Italian", large: 550, regular: 350, small: 250, aliases: ["spicy italian"] },
  { id: 11, name: "Arabic Green", large: 550, regular: 350, small: 250, aliases: ["arabic green", "arabic"] },
  { id: 12, name: "Yorgi Cheese", large: 550, regular: 350, small: 250, aliases: ["yorgi cheese", "yorgi"] },
  { id: 13, name: "Cheese Cream", large: 550, regular: 350, small: 250, aliases: ["cheese cream"] },
  { id: 14, name: "B.B.Q Tikka", large: 450, regular: 300, small: 200, aliases: ["bbq tikka", "b.b.q tikka", "bbq", "bar bq", "barbq"] },
];

export function getMenuText() {
  let text = "🍕 *Pizza Lab Menu*\n\n";
  MENU.forEach((item, i) => {
    text += `${i + 1}. *${item.name}*\n`;
    text += `   Large: Rs.${item.large} | Regular: Rs.${item.regular} | Small: Rs.${item.small}\n\n`;
  });
  text += "Order karne ke liye number + size likhein.\nExample: *8 Large* ya *Arabic Green Large*";
  return text;
}

export function getWelcomeMessage(name = "") {
  const greeting = name ? `Assalam o Alaikum ${name}!` : "Assalam o Alaikum!";
  return `${greeting} 👋\n\n*Pizza Lab* mein khush amdeed!\n\nMain aapka AI assistant hoon. Aap order place kar sakte hain.\n\n👉 Menu dekhne ke liye *menu* likhein\n👉 Seedha order ke liye item name + size likhein\n\nExample: *Chicken Tikka Large*`;
}

export function getOrderConfirmation(order) {
  const itemsText = order.items
    .map((i) => `• ${i.qty}x ${i.name} (${i.size}) - Rs.${i.price}`)
    .join("\n");

  return (
    `✅ *Order Confirmed!*\n\n` +
    `Order #: *${order.orderNumber}*\n` +
    `Customer: ${order.customerName}\n` +
    `Phone: ${order.customerPhone}\n\n` +
    `*Items:*\n${itemsText}\n\n` +
    `*Total: Rs. ${order.total}*\n` +
    `Payment: Cash on Delivery\n\n` +
    `📍 Address: ${order.address}\n\n` +
    `Aapka order kitchen mein chala gaya hai. Status updates yahin milengi. 🍕`
  );
}

export function getStatusUpdate(order, status) {
  const messages = {
    PREPARING: `👨‍🍳 *Update:* Aapka order *${order.orderNumber}* ab kitchen mein prepare ho raha hai.`,
    READY: `✅ *Update:* Order *${order.orderNumber}* ready hai! Rider assign ho raha hai.`,
    OUT_FOR_DELIVERY: `🛵 *Update:* Order *${order.orderNumber}* rider ke sath nikal gaya hai.\nRider: ${order.riderName || "Assigned"}\nThori der mein aapke paas hoga!`,
    DELIVERED: `🎉 *Delivered!*\nOrder *${order.orderNumber}* successfully deliver ho gaya.\nShukriya Pizza Lab choose karne ka! 🍕`,
  };
  return messages[status] || `Status update: ${status}`;
}

function findBestMenuItem(lower) {
  let best = null;
  let bestScore = 0;

  for (const item of MENU) {
    const aliases = item.aliases || [item.name.toLowerCase()];
    for (const alias of aliases) {
      if (lower.includes(alias)) {
        const score = 50 + alias.length; // longer alias = better match
        if (score > bestScore) {
          bestScore = score;
          best = item;
        }
      }
    }
  }

  return best;
}

export function parseUserMessage(text) {
  const lower = (text || "").toLowerCase().trim();
  if (!lower) return { intent: "UNKNOWN", text };

  // Menu
  if (lower === "menu" || lower === "menue" || lower === "menu dikhao" || lower === "menu bhejo") {
    return { intent: "MENU" };
  }

  // Greeting — ONLY exact short greetings
  const exactGreetings = ["hi", "hello", "salam", "assalam", "assalam o alaikum", "aoa", "hi!", "hello!"];
  if (exactGreetings.includes(lower)) {
    return { intent: "GREETING" };
  }

  const sizeMap = {
    large: "Large",
    l: "Large",
    regular: "Regular",
    r: "Regular",
    small: "Small",
    s: "Small",
  };

  // "8 large" or "8"
  const numMatch = lower.match(/^(\d+)\s*(large|regular|small|l|r|s)?$/);
  if (numMatch) {
    const idx = parseInt(numMatch[1], 10) - 1;
    if (idx >= 0 && idx < MENU.length) {
      const s = numMatch[2] ? sizeMap[numMatch[2]] : "Large";
      return { intent: "ORDER", item: MENU[idx], size: s, qty: 1 };
    }
  }

  const sizeMatch = lower.match(/\b(large|regular|small)\b/);
  const size = sizeMatch ? sizeMap[sizeMatch[1]] : null;

  const matchedItem = findBestMenuItem(lower);

  if (matchedItem && size) {
    return { intent: "ORDER", item: matchedItem, size, qty: 1 };
  }

  if (matchedItem) {
    return { intent: "NEED_SIZE", item: matchedItem };
  }

  return { intent: "UNKNOWN", text };
}

export function createOrderFromBot({ item, size, qty = 1, customerName, customerPhone, address }) {
  const price = item[size.toLowerCase()] || item.large;
  const orderNumber = `#PL${Date.now().toString().slice(-10)}`;

  return {
    id: `wa-${Date.now()}`,
    orderNumber,
    customerName: customerName || "WhatsApp Customer",
    customerPhone: customerPhone || "923000000000",
    address: address || "Address pending",
    items: [{ name: item.name, size, qty, price }],
    total: price * qty,
    status: "PENDING",
    source: "WHATSAPP",
    createdAt: new Date().toISOString(),
    shipping: 0,
  };
}
