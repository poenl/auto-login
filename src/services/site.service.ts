import { eq, getTableColumns } from 'drizzle-orm'
import { SiteSchema, sitesTable, SiteState } from '../db/schema'
import db from '../lib/db'

const siteFields = {
  id: sitesTable.id,
  name: sitesTable.name,
  url: sitesTable.url,
  screenshot: sitesTable.screenshot,
  state: sitesTable.state,
  updatedAt: sitesTable.updatedAt,
  interval: sitesTable.interval
}

export const getSites = async (pagenum: number = 1, pagesize: number = 10) => {
  const sites = await db
    .select(siteFields)
    .from(sitesTable)
    .limit(pagesize)
    .offset((pagenum - 1) * pagesize)

  return sites.map((site) => ({
    ...site,
    screenshot: `data:image/png;base64,${site.screenshot?.toString('base64')}`
  }))
}
// getSites 函数返回值类型
export type GetSites = Awaited<ReturnType<typeof getSites>>

// 更新状态和截图
export const updateSite = (id: number, siteData: { state: SiteState; screenshot?: Buffer }) => {
  return db
    .update(sitesTable)
    .set({ ...siteData, updatedAt: Date.now() })
    .where(eq(sitesTable.id, id))
}

export const getSite = async (id: number) => {
  const [site] = await db
    .select({
      id: sitesTable.id,
      url: sitesTable.url,
      screenshot: sitesTable.screenshot,
      state: sitesTable.state,
      updatedAt: sitesTable.updatedAt,
      interval: sitesTable.interval
    })
    .from(sitesTable)
    .where(eq(sitesTable.id, id))
  const result = {
    ...site,
    screenshot: `data:image/png;base64,${site.screenshot!.toString('base64')}`
  }
  return result
}

// getSite 函数返回值类型
export type GetSite = Awaited<ReturnType<typeof getSite>>

export const getSiteInfo = async (id: number) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { screenshot, createdAt, updatedAt, ...rest } = getTableColumns(sitesTable)
  const [site] = await db.select(rest).from(sitesTable).where(eq(sitesTable.id, id))
  return site
}

export type GetSiteInfo = Awaited<ReturnType<typeof getSiteInfo>>

// 修改
export const updateSiteInfo = async (id: number, siteData: Partial<SiteSchema>) => {
  return db.update(sitesTable).set(siteData).where(eq(sitesTable.id, id)).returning()
}
