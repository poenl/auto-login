import { getRecords } from '@/src/services/site.service'

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const res = await getRecords(+id)
  return Response.json(res)
}
