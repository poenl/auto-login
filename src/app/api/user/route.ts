import { updateUserInfo } from '@/src/services/user.service'
import { updateUserDto } from '@/src/dto/auth.dto'
import { NextRequest } from 'next/server'
import { config } from '@/src/lib/conf'

export const GET = async () => {
  const user = config.get('user')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user!
  return Response.json(rest)
}
export const PUT = async (req: NextRequest) => {
  const formData = await req.formData()
  const data = Object.fromEntries(formData.entries())
  const body = updateUserDto.safeParse(data)

  if (!body.success) {
    return Response.json({ message: body.error.message }, { status: 400 })
  }
  const arrayBuffer = await body.data.avatar?.arrayBuffer()
  const avatar = arrayBuffer ? Buffer.from(arrayBuffer) : undefined
  const user = await updateUserInfo({ ...body.data, avatar })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user
  return Response.json(rest)
}
