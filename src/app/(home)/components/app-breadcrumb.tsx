'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList
  // BreadcrumbPage,
  // BreadcrumbSeparator
} from '@/src/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'
import { data as routerData } from './app-sidebar'

export const AppBreadcrumb = () => {
  const pathname = usePathname()
  // 扁平化路由数据
  const routerList = routerData.navMain.flatMap((item) => item.items)
  const currentRoute = routerList.find((item) => item.url === pathname)
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">{currentRoute?.title || ''}</BreadcrumbLink>
        </BreadcrumbItem>
        {/* <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem> */}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
