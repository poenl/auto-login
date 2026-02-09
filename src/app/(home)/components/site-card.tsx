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
import { Site } from '@/src/services/site.service'
import Image from 'next/image'
import { BadgeCheck, RotateCcw, CircleX } from 'lucide-react'
import { SiteState } from '@/src/db/schema'
import useSWR from 'swr'
import { date } from '@/src/lib/dayjs'

// 状态中文
const stateMap: Record<SiteState, string> = {
  initializing: '初始化',
  running: '运行中',
  checking: '检查中',
  success: '成功',
  failed: '失败'
}

const stateIconMap: Record<SiteState, React.ReactNode> = {
  initializing: <Spinner />,
  running: <Spinner />,
  checking: <Spinner />,
  success: <BadgeCheck />,
  failed: <CircleX />
}

const stateStyleMap: Record<SiteState, string> = {
  initializing: 'text-gray-500',
  running: '',
  checking: 'text-yellow-500',
  success: 'text-green-500',
  failed: 'text-red-500'
}

export function SiteCard({
  deleteSite,
  ...param
}: Site & {
  deleteSite: (id: number) => void
}) {
  const getIsPending = (state: SiteState | undefined) => {
    return (
      state === SiteState.Running ||
      state === SiteState.Checking ||
      state === SiteState.Initializing
    )
  }

  const { data, mutate } = useSWR(
    `/api/site/${param.id}`,
    async (url) => fetch(url).then<Site>((res) => res.json()),
    {
      fallbackData: param,
      refreshInterval(data) {
        return getIsPending(data?.state) ? 1000 : 0
      }
    }
  )

  const isPending = getIsPending(data?.state)

  const handleRefresh = async () => {
    await fetch(`/api/site/refresh/${param.id}`)
    await mutate()
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{data.name}</CardTitle>
        <CardDescription>{data.url}</CardDescription>
        <CardAction>
          <Badge variant="secondary" className={stateStyleMap[data.state]}>
            {stateIconMap[data.state]}
            {stateMap[data.state]}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-4/3 relative">
          <Image src={data.screenshot} alt="" fill className="object-cover " />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="default" size="sm">
          Login
        </Button>
        <Button variant="destructive" size="sm" onClick={() => deleteSite(param.id)}>
          删除
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          disabled={isPending}
          onClick={handleRefresh}
        >
          {date(data.updatedAt).fromNow(true)}
          {isPending ? <Spinner /> : <RotateCcw />}
        </Button>
      </CardFooter>
    </Card>
  )
}
