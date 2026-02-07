import { NextRequest } from 'next/server'
import { addSiteDto } from '@/src/dto/site'
import { openPage } from './app'
import db from '@/src/lib/db'
import { sitesTable, SiteState } from '@/src/db/schema'
import { getQueryParams } from '@/src/lib/utils'
import { getSites } from '@/src/services/site.service'

export async function POST(request: NextRequest) {
  const body = addSiteDto.safeParse(await request.json())
  if (!body.success) {
    return new Response(JSON.stringify(body.error), { status: 400 })
  }

  const [site] = await db
    .insert(sitesTable)
    .values({ ...body.data, state: SiteState.Initializing })
    .returning()

  await openPage(site)

  return Response.json({ message: '添加成功', data: site })
}

export async function GET(request: NextRequest) {
  const { pagenum = 1, pagesize = 10 } = getQueryParams<{ pagenum: number; pagesize: number }>(
    request
  )
  const sites = await getSites(pagenum, pagesize)
  return Response.json(sites)
}
