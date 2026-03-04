import { AppSidebar } from '@/src/app/(home)/components/app-sidebar'
import { AppBreadcrumb } from './components/app-breadcrumb'
import { Separator } from '@/src/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/src/components/ui/sidebar'
import { ModeToggle } from './components/mode-toggle'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '站点管理',
  description: '站点管理'
}

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <AppBreadcrumb />
          <ModeToggle className="ml-auto" />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
