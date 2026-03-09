import { getUserInfo, updateUserInfo } from '@/src/services/user.service'
import { updateUserDto } from '@/src/dto/auth.dto'
import { NextRequest } from 'next/server'

export const GET = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = getUserInfo()
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
