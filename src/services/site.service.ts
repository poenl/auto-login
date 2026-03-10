import { eq, getTableColumns, desc } from 'drizzle-orm'
import { RecordSchema, recordsTable, SiteSchema, sitesTable } from '../db/schema'
import db from '../lib/db'
import { sendMessage, shouldSendMessage } from '../lib/telegram-bot'
import { SiteState, stateMap } from '@/src/lib/common'

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
export const updateSite = async (
  id: number,
  siteData: { state: SiteState; screenshot?: Buffer }
) => {
  const [result] = await db
    .update(sitesTable)
    .set({ ...siteData, updatedAt: Date.now() })
    .where(eq(sitesTable.id, id))
    .returning()

  const state = siteData.state
  if (state === SiteState.Failed || state === SiteState.Success || state === SiteState.Timeout) {
    if (shouldSendMessage(state)) sendMessage(`${result.name}：${stateMap[state]}`)
  }
  return result
}

export const getSite = async (id: number) => {
  const [site] = await db
    .select({
      id: sitesTable.id,
      url: sitesTable.url,
      screenshot: sitesTable.screenshot,
      state: sitesTable.state,
      updatedAt: sitesTable.updatedAt,
      interval: sitesTable.interval,
      name: sitesTable.name
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

// 添加记录
export const addRecord = async (siteData: Omit<RecordSchema, 'id' | 'createdAt'>) => {
  return db.insert(recordsTable).values(siteData).returning()
}

export const getRecords = async (id: number) => {
  const records = await db
    .select()
    .from(recordsTable)
    .where(eq(recordsTable.siteId, id))
    .orderBy(desc(recordsTable.id))
  return records.map((record) => ({
    ...record,
    screenshot: `data:image/png;base64,${record.screenshot.toString('base64')}`
  }))
}
export type GetRecords = Awaited<ReturnType<typeof getRecords>>
