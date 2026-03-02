import { Bot } from 'grammy'
import { config } from './conf'
import { SiteState } from './common'
import { NotifyWhen } from '../dto/user.dto'

// bot.on('message:text', (ctx) => ctx.reply('Echo:' + ctx.message.text))
// bot.start()

export const sendMessage = async (text: string) => {
  const botConfig = config.get('settings').notify.telegram
  if (!botConfig.botToken || !botConfig.chatId) return

  const bot = new Bot(botConfig.botToken)
  await bot.api.sendMessage(botConfig.chatId, text)
}
// 判断是否发送消息
export const shouldSendMessage = (state: SiteState) => {
  const { notifyWhen, enable } = config.get('settings').notify.telegram
  if (!enable) return false
  if (state === SiteState.Success && notifyWhen?.includes(NotifyWhen.success)) return true
  if (
    (state === SiteState.Failed || state === SiteState.Timeout) &&
    notifyWhen?.includes(NotifyWhen.failed)
  )
    return true

  return false
}
