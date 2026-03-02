import * as z from 'zod'

export enum NotifyWhen {
  success = 'success',
  failed = 'failed'
}

export const settingsDto = z.union([
  z.object({
    key: z.literal('site'),
    loginTimeout: z.number().min(10).optional(),
    checkTimeout: z.number().min(10).optional()
  }),
  z.object({
    key: z.literal('notify.telegram'),
    botToken: z.string().nonempty('token 不能为空'),
    chatId: z.string().nonempty('chat-id 不能为空'),
    notifyWhen: z.array(z.enum(NotifyWhen)).optional()
  }),
  z.object({
    key: z.literal('notify.telegram'),
    enable: z.boolean().optional()
  })
])

export type SettingsDto = z.infer<typeof settingsDto>
