import * as z from 'zod'

export const signupDto = z.object({
  name: z.string().min(2, { error: '长度必须大于2' }).trim(),
  password: z.string().min(6, { error: '长度必须大于6' }).trim()
})

export const updateUserDto = z.object({
  name: z
    .string()
    .trim()
    .transform((v) => (v === '' ? undefined : v))
    .pipe(z.string().min(2, { error: '长度必须大于2' }).optional()),
  password: z
    .string()
    .trim()
    .transform((v) => (v === '' ? undefined : v))
    .pipe(z.string().min(2, { error: '长度必须大于6' }).optional()),
  avatar: z.file().optional()
})
