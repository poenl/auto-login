import db from '@/src/lib/db'
import { SiteSchema, sitesTable } from '@/src/db/schema'
import { eq } from 'drizzle-orm'
import { getSite, GetSiteInfo, getSiteInfo, updateSiteInfo } from '@/src/services/site.service'
import { NextRequest } from 'next/server'
import { addSiteDto } from '@/src/dto/site.dto'
import { openPage } from '@/src/lib/puppeteer'
import { clearCron, updateCron } from '@/src/lib/croner'
import { SiteState } from '@/src/lib/common'

export async function DELETE(_: unknown, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [site] = await db.delete(sitesTable).where(eq(sitesTable.id, +id)).returning()
  clearCron(+id) // 清除定时任务
  return Response.json({ message: '删除成功', date: site })
}

export async function GET(_: unknown, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const site = await getSite(+id)

  return Response.json(site)
}

const getIsUpdateSite = async (newSite: Partial<SiteSchema>, oldSite: GetSiteInfo) => {
  if (
    oldSite.url !== newSite.url ||
    oldSite.cookie !== newSite.cookie ||
    oldSite.storage !== newSite.storage
  ) {
    return true
  } else {
    return false
  }
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string | undefined }> }
) => {
  const [{ id }, site] = await Promise.all([params, request.json()])
  const body = addSiteDto.safeParse(site)

  if (!id || !body.success) return Response.json({ message: '参数错误' })

  const oldSite = await getSiteInfo(+id)
  const isUpdateSite = await getIsUpdateSite(body.data, oldSite)
  // 站点关键配置修改,重置状态
  const newSite = isUpdateSite ? { ...body.data, state: SiteState.Initializing } : body.data
  const [newSiteInfo] = await updateSiteInfo(+id, newSite)

  if (oldSite.interval !== newSite.interval) updateCron(newSiteInfo) // 更新定时任务
  if (isUpdateSite) openPage(newSiteInfo) // 刷新页面

  return Response.json({ message: '更新成功', data: newSiteInfo })
}
