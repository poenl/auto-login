import * as z from 'zod'

export const signupFormSchema = z.object({
  name: z.string().min(2, { error: '长度必须大于2' }).trim(),
  password: z.string().min(6, { error: '长度必须大于6' }).trim()
})

export type FormState = z.infer<typeof signupFormSchema>
