import { getSiteInfo } from '@/src/services/site.service'

export const GET = async (_: unknown, { params }: { params: { id: number } }) => {
  const siteInfo = await getSiteInfo(params.id)
  return Response.json(siteInfo)
}
