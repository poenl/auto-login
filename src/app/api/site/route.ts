import { NextRequest } from 'next/server'
import { addSiteDto } from '@/src/dto/site'
import { config } from '@/src/lib/conf'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  const body = addSiteDto.safeParse(await request.json())
  if (!body.success) {
    return new Response(JSON.stringify(body.error), { status: 400 })
  }
  const sites = config.get('sites')
  if (sites.some((site) => site.url === body.data.url)) {
    return new Response(JSON.stringify({ message: '站点已存在' }), { status: 400 })
  }
  config.appendToArray('sites', { ...body.data, id: uuidv4() })
  return Response.json({ message: '添加成功' })
}
