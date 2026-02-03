import { config } from '@/src/lib/conf'

export async function DELETE(_: unknown, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const siteIndex = config.get('sites').findIndex((site) => site.id === id)
  if (siteIndex === -1) {
    return Response.json({ message: '未找到该站点' }, { status: 400 })
  }
  const newSites = config.get('sites').toSpliced(siteIndex, 1)
  config.set('sites', newSites)
  return Response.json({ message: '删除成功', date: newSites })
}
