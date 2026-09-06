// WhatsApp Cloud API Webhook
// Ready for real Meta credentials

import { NextResponse } from "next/server";

// GET = Webhook verification (Meta sends this)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "pizza_lab_verify_token";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// POST = Incoming messages from WhatsApp
export async function POST(request) {
  try {
    const body = await request.json();

    // Meta webhook structure
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (messages && messages.length > 0) {
      const msg = messages[0];
      const from = msg.from; // customer phone
      const text = msg.text?.body || "";
      const name = value?.contacts?.[0]?.profile?.name || "";

      console.log("WhatsApp message:", { from, name, text });

      // TODO: When real API is connected:
      // 1. Parse message with whatsapp-bot.js
      // 2. Reply using Meta Graph API
      // 3. Create order in database
      // 4. Push to dashboard via socket/realtime

      // For now just acknowledge
      return NextResponse.json({ status: "received" });
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
