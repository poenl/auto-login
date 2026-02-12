import { getSiteInfo } from '@/src/services/site.service'

export const GET = async (_: unknown, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const siteInfo = await getSiteInfo(+id)
  return Response.json(siteInfo)
}
