import { deleteSession } from '@/src/lib/session'

export const POST = async () => {
  await deleteSession()

  return new Response('退出登录成功', { status: 200 })
}
