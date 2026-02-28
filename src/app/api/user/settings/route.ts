import { getUserSettings, updateUserSettings } from '@/src/services/user.service'
import { settingsDto } from '@/src/dto/user.dto'

export const GET = async () => Response.json(getUserSettings())

export const PUT = async (req: Request) => {
  const data = await req.json()
  const body = settingsDto.safeParse(data)

  if (!body.success) {
    return new Response(JSON.stringify(body.error), {
      status: 400
    })
  }
  const { key, ...bodyData } = body.data
  const result = updateUserSettings(key, bodyData)

  return Response.json(result)
}
