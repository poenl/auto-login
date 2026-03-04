import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './config-provider'
import { Noto_Sans_SC } from 'next/font/google'

export const metadata: Metadata = {
  title: 'auto-login',
  description: '站点定时自动登录'
}

const oswald = Noto_Sans_SC({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial']
})

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cn" suppressHydrationWarning className={oswald.className}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
