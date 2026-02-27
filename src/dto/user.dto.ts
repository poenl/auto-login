import * as z from 'zod'

export const settingsDto = z.object({
  loginTimeout: z.number().min(10).optional(),
  checkTimeout: z.number().min(10).optional()
})

export type SettingsDto = z.infer<typeof settingsDto>
