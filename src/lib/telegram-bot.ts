import { Bot } from 'grammy'
import { config } from './conf'

// bot.on('message:text', (ctx) => ctx.reply('Echo:' + ctx.message.text))
// bot.start()

export const sendMessage = async (text: string) => {
  const botConfig = config.get('settings').telegram
  if (!botConfig.botToken || !botConfig.chatId || !botConfig.enable) return

  const bot = new Bot(botConfig.botToken)
  await bot.api.sendMessage(botConfig.chatId, text)
}
