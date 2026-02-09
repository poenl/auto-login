import { eq } from 'drizzle-orm'
import { sitesTable, SiteState } from '../db/schema'
import db from '../lib/db'

export const getSites = async (pagenum: number = 1, pagesize: number = 10) => {
  const sites = await db
    .select({
      id: sitesTable.id,
      name: sitesTable.name,
      url: sitesTable.url,
      screenshot: sitesTable.screenshot,
      state: sitesTable.state,
      updatedAt: sitesTable.updatedAt
    })
    .from(sitesTable)
    .limit(pagesize)
    .offset((pagenum - 1) * pagesize)

  return sites.map((site) => ({
    ...site,
    screenshot: `data:image/png;base64,${site.screenshot?.toString('base64')}`
  }))
}
// 函数返回值类型
export type Site = Awaited<ReturnType<typeof getSites>>[number]

// 更新状态和截图
export const updateSite = (id: number, siteData: { state: SiteState; screenshot?: Buffer }) => {
  return db
    .update(sitesTable)
    .set({ ...siteData, updatedAt: Date.now() })
    .where(eq(sitesTable.id, id))
}

export const getSite = async (id: number) => {
  const [site] = await db.select().from(sitesTable).where(eq(sitesTable.id, id))
  return site
}
