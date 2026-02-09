import { SiteState } from '@/src/db/schema'
import { refreshPage } from '@/src/lib/puppeteer'
import { getSite, updateSite } from '@/src/services/site.service'

export const GET = async (_: unknown, { params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params
  const site = await getSite(id)
  await updateSite(id, { state: SiteState.Running })
  refreshPage(site)
  return Response.json({ message: '开始刷新' })
}
