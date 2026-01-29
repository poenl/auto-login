import * as React from 'react'

import { SearchForm } from '@/src/app/(home)/components/search-form'
import { VersionSwitcher } from '@/src/app/(home)/components/version-switcher'
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

// This is sample data.
const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Getting Started',
      url: '',
      items: [
        {
          title: 'Installation',
          url: '/'
        },
        {
          title: 'Project Structure',
          url: '/test'
        }
      ]
    },
    {
      title: 'Building Your Application',
      url: '#',
      items: [
        {
          title: 'Routing',
          url: '#'
        },
        {
          title: 'Data Fetching',
          url: '#',
          isActive: true
        },
        {
          title: 'Rendering',
          url: '#'
        },
        {
          title: 'Caching',
          url: '#'
        },
        {
          title: 'Styling',
          url: '#'
        },
        {
          title: 'Optimizing',
          url: '#'
        }
      ]
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
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
