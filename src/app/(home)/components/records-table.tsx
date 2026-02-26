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
import { stateMap, stateStyleMap } from './site-card'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/src/components/ui/hover-card'
import Image from 'next/image'

export const RecordsTable = ({ siteId }: { siteId: number }) => {
  const { data } = useSWR(`/api/site/records/${siteId}`, (url) =>
    fetch(url).then((res) => res.json() as ReturnType<typeof getRecords>)
  )
  const records = data || []
  return (
    <ScrollArea className="h-72 rounded-md ">
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
              <TableCell className={`${stateStyleMap[record.state]} flex items-center`}>
                {stateMap[record.state]}
              </TableCell>
              <TableCell>
                <HoverCard openDelay={10} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <Eye className="text-neutral-500 cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-400" />
                  </HoverCardTrigger>
                  <HoverCardContent className="h-[50vh] max-h-200 aspect-4/3 w-auto">
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
    </ScrollArea>
  )
}
