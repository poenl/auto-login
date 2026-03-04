'use client'

import { SiteCard } from './components/site-card'
import useSWR from 'swr'
import { GetSites } from '@/src/services/site.service'
import { toast } from 'sonner'
import { useCallback } from 'react'
import { Button } from '@/src/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/src/components/ui/empty'
import { FolderDot } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const { data: sites, mutate } = useSWR<GetSites>('/api/site', {
    revalidateOnFocus: true
  })

  // 删除站点
  const deleteSite = useCallback(
    async (id: number) => {
      const res = await fetch(`/api/site/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('删除成功')
        mutate((prev) => prev?.filter((site) => site.id !== id))
      } else toast.error((await res.json()).message)
    },
    [mutate]
  )

  const handleRefresh = () => {
    mutate()
  }

  const handleAddSite = () => {
    router.push('/site')
  }

  if (!sites) return null

  return (
    <div className="p-4 h-full">
      {sites.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {sites.map((site) => (
            <SiteCard {...site} key={site.id + site.state} deleteSite={deleteSite} />
          ))}
        </div>
      ) : (
        <Empty className="h-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderDot />
            </EmptyMedia>
            <EmptyTitle>没有站点</EmptyTitle>
            <EmptyDescription>
              你还没有添加任何站点。点击下方按钮开始添加你的第一个站点。
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <Button onClick={handleAddSite}>添加站点</Button>
            <Button variant="outline" onClick={handleRefresh}>
              刷新列表
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
