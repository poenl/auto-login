import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '添加站点',
  description: '添加站点'
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
