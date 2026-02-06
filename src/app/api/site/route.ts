import { NextRequest } from 'next/server'
import { addSiteDto } from '@/src/dto/site'
import { config } from '@/src/lib/conf'
import { v4 as uuidv4 } from 'uuid'
import { openPage } from './app'

export async function POST(request: NextRequest) {
  const body = addSiteDto.safeParse(await request.json())
  if (!body.success) {
    return new Response(JSON.stringify(body.error), { status: 400 })
  }

  const sites = config.get('sites')
  if (sites.some((site) => site.url === body.data.url)) {
    return new Response(JSON.stringify({ message: '站点已存在' }), { status: 400 })
  }

  const newSite = { ...body.data, id: uuidv4() }
  config.appendToArray('sites', newSite)

  openPage(newSite)

  return Response.json({ message: '添加成功' })
}

export async function GET() {
  const sites = config.get('sites')
  return Response.json({ data: sites })
}
