import * as z from 'zod'

export const settingsDto = z.xor([
  z.object({
    key: z.literal('site'),
    loginTimeout: z.number().min(10).optional(),
    checkTimeout: z.number().min(10).optional()
  }),
  z.object({
    key: z.literal('telegram'),
    botToken: z.string().nonempty('token 不能为空'),
    chatId: z.string().nonempty('chat-id 不能为空')
  }),
  z.object({
    key: z.literal('telegram'),
    enable: z.boolean().optional()
  })
])

export type SettingsDto = z.infer<typeof settingsDto>
