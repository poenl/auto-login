import { sitesTable } from '../db/schema'
import db from '../lib/db'

export const getSites = async (pagenum: number = 1, pagesize: number = 10) => {
  const sites = await db
    .select({
      id: sitesTable.id,
      url: sitesTable.url,
      screenshot: sitesTable.screenshot,
      state: sitesTable.state
    })
    .from(sitesTable)
    .limit(pagesize)
    .offset((pagenum - 1) * pagesize)

  return sites.map((site) => ({
    id: site.id,
    url: site.url,
    screenshot: `data:image/png;base64,${site.screenshot?.toString('base64')}`,
    state: site.state
  }))
}
// 函数返回值类型
export type Site = Awaited<ReturnType<typeof getSites>>[number]
