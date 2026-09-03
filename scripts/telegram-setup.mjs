import { readFileSync, existsSync } from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("Add TELEGRAM_BOT_TOKEN to .env.local first.");
  console.error("1. Open Telegram and search @BotFather");
  console.error("2. Send /newbot and copy the token");
  console.error("3. Put it in .env.local as TELEGRAM_BOT_TOKEN=...");
  process.exit(1);
}

const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
const me = await res.json();
if (!me.ok) {
  console.error("Invalid bot token:", me.description);
  process.exit(1);
}

console.log(`Bot @${me.result.username} is ready.`);
console.log(`Open https://t.me/${me.result.username} on the phone 7010651052 and tap Start.`);
console.log("Then run this script again.\n");

const updates = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
const data = await updates.json();
const chats = (data.result || [])
  .map((u) => u.message?.chat)
  .filter(Boolean);

if (!chats.length) {
  console.error("No messages yet. Open the bot, tap Start, then rerun: npm run telegram:setup");
  process.exit(1);
}

const latest = chats.at(-1);
const chatId = String(latest.id);
const out = path.join(process.cwd(), ".telegram-chat-id");
await import("fs").then((fs) => fs.writeFileSync(out, chatId));

const envLocal = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
if (!envLocal.includes("TELEGRAM_CHAT_ID=")) {
  const { appendFileSync } = await import("fs");
  appendFileSync(envPath, `\nTELEGRAM_CHAT_ID=${chatId}\n`);
}

console.log(`Saved chat id ${chatId} (${latest.first_name || "user"}). Quotes will now arrive in Telegram automatically.`);
