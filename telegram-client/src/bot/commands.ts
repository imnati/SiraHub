import { Bot } from 'grammy';

/**
 * Registers bot slash commands.
 * Extended in Phase 9 with full job search, apply, status commands.
 */
export function registerCommands(bot: Bot): void {
  bot.command('start', async (ctx) => {
    await ctx.reply(
      `👋 Welcome to *SiraHub* — The Ethiopian Job Marketplace!

I can help you:
• 🔍 Search for jobs
• 📋 Track your applications
• 🔔 Get notified about new opportunities

*Commands:*
/jobs — Browse latest jobs
/apply — Apply for a job
/status — Check application status
/help — Show this help

_Full features coming soon. Stay tuned!_`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(
      `*SiraHub Bot — Help*

/start — Welcome message
/jobs — Browse latest jobs (Phase 9)
/apply — Apply for a job (Phase 9)
/status — Check your application status (Phase 9)

For the full experience, visit our web platform.`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.command('jobs', async (ctx) => {
    await ctx.reply(
      '🚧 Job browsing via Telegram will be available in Phase 9. Visit the web platform for now!'
    );
  });

  bot.command('status', async (ctx) => {
    await ctx.reply(
      '🚧 Application status tracking via Telegram will be available in Phase 9.'
    );
  });
}
