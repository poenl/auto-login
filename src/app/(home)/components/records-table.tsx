import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/src/components/ui/table'
import { getRecords } from '@/src/services/site.service'
import useSWR from 'swr'
import { date } from '@/src/lib/dayjs'
import { Eye } from 'lucide-react'
import { stateStyleMap } from './site-card'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/src/components/ui/hover-card'
import Image from 'next/image'
import { Button } from '@/src/components/ui/button'
import { stateMap } from '@/src/lib/common'
import { Spinner } from '@/src/components/ui/spinner'

export const RecordsTable = ({ siteId }: { siteId: number }) => {
  const { data: records } = useSWR(`/api/site/records/${siteId}`, (url) =>
    fetch(url).then((res) => res.json() as ReturnType<typeof getRecords>)
  )
  return (
    <ScrollArea className="h-72 rounded-md ">
      {records ? (
        <Table>
          <TableHeader className="sticky top-0">
            <TableRow>
              <TableHead className="w-30">状态</TableHead>
              <TableHead>截图</TableHead>
              <TableHead className="text-right">时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className={`${stateStyleMap[record.state]}`}>
                  {stateMap[record.state]}
                </TableCell>
                <TableCell>
                  <HoverCard openDelay={10} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost">
                        <Eye className="text-neutral-500 cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-400 h-5! w-5!" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="h-[50vh] max-h-200 aspect-4/3 w-auto relative">
                      <Image src={record.screenshot} alt="" fill={true} />
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell className="text-right">
                  {date(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="w-full h-70 flex items-center justify-center">
          <Spinner className="size-8 text-neutral-500" />
        </div>
      )}
    </ScrollArea>
  )
}
