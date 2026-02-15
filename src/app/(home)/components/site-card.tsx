'use client'

import { Button } from '@/src/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Spinner } from '@/src/components/ui/spinner'
import { GetSites, GetSite } from '@/src/services/site.service'
import Image from 'next/image'
import { BadgeCheck, RotateCcw, CircleX } from 'lucide-react'
import { SiteState } from '@/src/db/schema'
import useSWR from 'swr'
import { date } from '@/src/lib/dayjs'
import { useState, useEffect, useEffectEvent, useMemo, memo } from 'react'
import { useRouter } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip'
import { Cron } from 'croner'
import { useFocus } from '@/src/lib/hooks'

// 状态中文
const stateMap: Record<SiteState, string> = {
  initializing: '初始化',
  running: '运行中',
  checking: '检查中',
  success: '成功',
  failed: '失败',
  timeout: '超时'
}

const stateIconMap: Record<SiteState, React.ReactNode> = {
  initializing: <Spinner />,
  running: <Spinner />,
  checking: <Spinner />,
  success: <BadgeCheck />,
  failed: <CircleX />,
  timeout: <CircleX />
}

const stateStyleMap: Record<SiteState, string> = {
  initializing: 'text-gray-500',
  running: '',
  checking: 'text-yellow-500',
  success: 'text-green-500',
  failed: 'text-red-500',
  timeout: 'text-red-500'
}

export const SiteCard = memo(function SiteCard({
  deleteSite,
  ...param
}: GetSites[number] & {
  deleteSite: (id: number) => void
}) {
  const router = useRouter()
  const [site, setSite] = useState(param)
  const isPending =
    site.state === SiteState.Running ||
    site.state === SiteState.Checking ||
    site.state === SiteState.Initializing

  const { data } = useSWR(
    isPending ? `/api/site/${param.id}` : null,
    async (url) => fetch(url).then<GetSite>((res) => res.json()),
    {
      refreshInterval: (data) => {
        if (!data) return 0
        return isPending ? 1000 : 0
      }
    }
  )

  const changeSite = useEffectEvent((newSite: GetSite) => {
    setSite((site) => ({ ...site, ...newSite }))
  })

  useEffect(() => {
    if (!data) return
    changeSite(data)
  }, [data])

  const handleRefresh = async () => {
    await fetch(`/api/site/refresh/${param.id}`)
    setSite((site) => ({ ...site, state: SiteState.Running }))
  }
  // 修改
  const handleEdit = () => {
    router.push(`/site?id=${param.id}`)
  }

  // 下次刷新时间
  const nextRefreshTime = useMemo(() => {
    const cron = new Cron(site.interval || param.interval).nextRun()
    return date(cron).toNow()
  }, [site, param])
  // 上次刷新时间
  const [lastRefreshTime, updateLastRefreshTime] = useFocus(() => date(site.updatedAt).fromNow())
  useEffect(() => {
    if (isPending) return
    const timer = setTimeout(() => {
      updateLastRefreshTime()
    }, 0)
    return () => clearTimeout(timer)
  }, [site.updatedAt, isPending, updateLastRefreshTime])
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{site.name}</CardTitle>
        <CardDescription className="truncate">{site.url}</CardDescription>
        <CardAction>
          <Badge variant="secondary" className={stateStyleMap[site.state]}>
            {stateIconMap[site.state]}
            {stateMap[site.state]}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-4/3 relative">
          <Image src={site.screenshot} alt="" fill className="object-cover " />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="default" size="sm" onClick={handleEdit}>
          修改
        </Button>
        <Button variant="destructive" size="sm" onClick={() => deleteSite(param.id)}>
          删除
        </Button>
        <Tooltip>
          <TooltipTrigger asChild className="ml-auto">
            <Button variant="ghost" size="sm" disabled={isPending} onClick={handleRefresh}>
              {lastRefreshTime}
              {isPending ? <Spinner /> : <RotateCcw />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>下次更新：{nextRefreshTime}</p>
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  )
})
