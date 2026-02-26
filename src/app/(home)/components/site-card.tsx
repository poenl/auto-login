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
import { BadgeCheck, RotateCcw, CircleX, Trash2, Edit } from 'lucide-react'
import { SiteState } from '@/src/db/schema'
import useSWR from 'swr'
import { date } from '@/src/lib/dayjs'
import { useState, memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip'
import { Cron } from 'croner'
import { useFocus } from '@/src/hooks/use-focus'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/src/components/ui/dialog'
import { RecordsTable } from './records-table'

// 状态中文
export const stateMap: Record<SiteState, string> = {
  initializing: '初始化',
  running: '运行中',
  checking: '检查中',
  success: '成功',
  failed: '失败',
  timeout: '超时'
}

export const stateIconMap: Record<SiteState, React.ReactNode> = {
  initializing: <Spinner />,
  running: <Spinner />,
  checking: <Spinner />,
  success: <BadgeCheck />,
  failed: <CircleX />,
  timeout: <CircleX />
}

export const stateStyleMap: Record<SiteState, string> = {
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
  const [isLoading, setIsLoading] = useState(false)

  const isPending = useCallback(
    (state: SiteState) =>
      state === SiteState.Running ||
      state === SiteState.Checking ||
      state === SiteState.Initializing,
    []
  )

  const { data: site, mutate } = useSWR(
    `/api/site/${param.id}`,
    (url) => fetch(url).then<GetSite>((res) => res.json()),
    {
      refreshInterval: (data) => {
        if (!data) return 0

        if (!isPending(data.state)) {
          updateLastRefreshTime()
          updateNextRefreshTime()
        }

        return isPending(data.state) ? 1000 : 0
      },
      fallbackData: param,
      revalidateOnMount: isPending(param.state)
    }
  )

  const handleRefresh = async () => {
    setIsLoading(true)
    await fetch(`/api/site/refresh/${param.id}`)
    setIsLoading(false)
    mutate()
  }
  // 修改
  const handleEdit = () => {
    router.push(`/site?id=${param.id}`)
  }

  // 下次刷新时间
  const [nextRefreshTime, updateNextRefreshTime] = useFocus(() => {
    const cron = new Cron(site.interval).nextRun()
    return date(new Date()).to(cron)
  })
  // 上次刷新时间
  const [lastRefreshTime, updateLastRefreshTime] = useFocus(() => date(site.updatedAt).fromNow())

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{site.name}</CardTitle>
        <CardDescription className="truncate">{site.url}</CardDescription>
        <CardAction>
          <Tooltip>
            {/* 历史记录弹窗 */}
            <Dialog>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Badge
                    variant="secondary"
                    className={`${stateStyleMap[site.state]} cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700`}
                  >
                    {stateIconMap[site.state]}
                    {stateMap[site.state]}
                  </Badge>
                </DialogTrigger>
              </TooltipTrigger>
              <DialogContent className="w-md">
                <DialogHeader>
                  <DialogTitle>历史记录</DialogTitle>
                </DialogHeader>
                <RecordsTable siteId={site.id} />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">关闭</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <TooltipContent>查看历史记录</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-4/3 relative">
          <Image src={site.screenshot} alt="" fill className="object-cover " />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="default" size="sm" onClick={handleEdit}>
          <Edit />
          修改
        </Button>
        <Button variant="destructive" size="sm" onClick={() => deleteSite(param.id)}>
          <Trash2 />
          删除
        </Button>
        <Tooltip>
          <TooltipTrigger asChild className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              disabled={isPending(site.state) || isLoading}
              onClick={handleRefresh}
            >
              {lastRefreshTime}
              {isPending(site.state) || isLoading ? <Spinner /> : <RotateCcw />}
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
