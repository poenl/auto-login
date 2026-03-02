import { SiteState } from '@/src/lib/common'
import { refreshPage } from '@/src/lib/puppeteer'
import { getSiteInfo, updateSite } from '@/src/services/site.service'

export const GET = async (_: unknown, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const site = await getSiteInfo(+id)
  await updateSite(+id, { state: SiteState.Running })
  refreshPage(site)
  return Response.json({ message: '开始刷新' })
}
