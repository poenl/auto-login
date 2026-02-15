'use client'

import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/src/components/ui/sidebar'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { NavUser } from './nav-user'

export const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: '站点管理',
      url: '',
      items: [
        {
          title: '站点列表',
          url: '/'
        },
        {
          title: '添加站点',
          url: '/site'
        }
      ]
    },
    {
      title: '系统设置',
      url: '#',
      items: [
        {
          title: '设置',
          url: '/settings'
        }
      ]
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // 当前激活菜单项
  const [activeItem, setActiveItem] = useState(usePathname())

  const handleMenuClick = (item: string) => {
    setActiveItem(item)
  }
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title} onClick={() => handleMenuClick(item.url)}>
                    <SidebarMenuButton asChild isActive={activeItem === item.url}>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
