'use client'

import { SiteCard } from './components/site-card'
import useSWR from 'swr'
import { Site } from '@/src/services/site.service'
import { toast } from 'sonner'

export default function Home() {
  const { data, mutate } = useSWR('/api/site', (url) =>
    fetch(url).then<Site[]>((res) => res.json())
  )
  const sites = data || []

  // 删除站点
  const deleteSite = async (id: number) => {
    const res = await fetch(`/api/site/${id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      toast.success('删除成功')
      mutate((prev) => prev?.filter((site) => site.id !== id))
    } else toast.error((await res.json()).message)
  }
  return (
    <div className="p-4 h-full grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 auto-rows-min">
      {sites.map((site) => (
        <SiteCard {...site} key={site.id} deleteSite={deleteSite} />
      ))}
    </div>
  )
}
