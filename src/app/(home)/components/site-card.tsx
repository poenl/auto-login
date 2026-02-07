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
import { BadgeCheck } from 'lucide-react'
import { SiteState } from '@/src/db/schema'
import useSWR from 'swr'

// 状态中文
const stateMap: Record<SiteState, string> = {
  initializing: '初始化',
  running: '运行中',
  checking: '检查中',
  success: '成功',
  failed: '失败'
}

export function SiteCard(
  param: Pick<Site, 'state' | 'url' | 'screenshot' | 'id'> & { deleteSite: (id: number) => void }
) {
  const isPending = (state: SiteState) =>
    state === SiteState.Running || state === SiteState.Checking || state === SiteState.Initializing

  const { data } = useSWR(
    isPending(param.state) ? `/api/site/${param.id}` : null,
    async (url) => fetch(url).then<Site>((res) => res.json()),
    {
      refreshInterval: (data) => {
        if (!data) return 0
        return isPending(data.state) ? 1000 : 0
      }
    }
  )

  const site = data || param

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{site.url}</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
        <CardAction>
          <Badge variant="secondary" className="">
            {isPending(site.state) ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <BadgeCheck data-icon="inline-start" />
            )}
            {stateMap[site.state]}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Image src={site.screenshot} width={300} height={300} alt="" />
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="default">Login</Button>
        <Button variant="destructive" onClick={() => param.deleteSite(param.id)}>
          删除
        </Button>
      </CardFooter>
    </Card>
  )
}
