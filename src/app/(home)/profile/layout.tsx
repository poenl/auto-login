import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '账户设置',
  description: '账户设置'
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
