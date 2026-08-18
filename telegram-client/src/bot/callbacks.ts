import { Bot } from 'grammy';

/**
 * Registers inline keyboard callback query handlers.
 * Extended in Phase 9.
 */
export function registerCallbacks(bot: Bot): void {
  bot.callbackQuery(/.*/, async (ctx) => {
    await ctx.answerCallbackQuery({ text: 'Feature coming in Phase 9!' });
  });
}
