import db from '@/src/lib/db'
import { sitesTable } from '@/src/db/schema'
import { eq } from 'drizzle-orm'
import { getSite } from '@/src/services/site.service'

export async function DELETE(_: unknown, { params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const [site] = await db.delete(sitesTable).where(eq(sitesTable.id, id)).returning()
  return Response.json({ message: '删除成功', date: site })
}

export async function GET(_: unknown, { params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const site = await getSite(id)

  return Response.json(site)
}
