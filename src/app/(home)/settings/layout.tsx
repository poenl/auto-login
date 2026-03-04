import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '系统设置',
  description: '系统设置'
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
