import { NextRequest } from 'next/server'
import argon2 from 'argon2'
import { createSession } from '@/src/lib/session'
import { config } from '@/src/lib/conf'
import { signupDto } from '@/src/dto/auth.dto'

export async function POST(req: NextRequest) {
  const body = signupDto.safeParse(await req.json())
  if (!body.success) {
    return Response.json({ message: body.error.message }, { status: 400 })
  }

  const { name, password } = body.data
  const user = config.get('user')

  if (!(user?.name === name) || !(await argon2.verify(user?.password, password))) {
    return Response.json({ message: '用户名或密码错误' }, { status: 401 })
  }

  await createSession(name)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userInfo } = user
  return Response.json(userInfo)
}
