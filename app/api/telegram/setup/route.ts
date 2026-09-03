import { NextResponse } from "next/server";
import { discoverChatIdFromUpdates, isTelegramConfigured } from "@/lib/telegram";

export async function GET() {
  if (isTelegramConfigured()) {
    return NextResponse.json({ configured: true });
  }
  try {
    const chat = await discoverChatIdFromUpdates();
    if (!chat) {
      return NextResponse.json({
        configured: false,
        hint: "Open your bot in Telegram from 7010651052, tap Start, then refresh.",
      });
    }
    return NextResponse.json({ configured: true, chatId: chat.id, name: chat.first_name });
  } catch (err) {
    return NextResponse.json(
      { configured: false, error: err instanceof Error ? err.message : "Setup failed" },
      { status: 500 },
    );
  }
}
