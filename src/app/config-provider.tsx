'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Toaster } from '@/src/components/ui/sonner'
import { SWRConfig } from 'swr'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((res) => res.json()),
        revalidateOnFocus: false
      }}
    >
      <NextThemesProvider {...props}>
        {children}
        <Toaster position="top-center" />
      </NextThemesProvider>
    </SWRConfig>
  )
}
