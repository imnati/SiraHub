import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { Bot } from 'grammy';
import { registerCommands } from './bot/commands';
import { registerCallbacks } from './bot/callbacks';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set in environment variables.');
  process.exit(1);
}

const bot = new Bot(token);

// Register command and callback handlers
registerCommands(bot);
registerCallbacks(bot);

// Global error handler
bot.catch((err) => {
  console.error('Bot error:', err.error);
});

// Start the bot
bot.start({
  onStart: (info) => {
    console.log(`✅ SiraHub Telegram Bot started as @${info.username}`);
  },
});
