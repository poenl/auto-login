'use client'

import { SiteSettings } from './components/site-settings'
import useSWR from 'swr'
import { GetUserSettings } from '@/src/services/user.service'
import { NotificationSettings } from './components/notification-settings'
import useSWRMutation from 'swr/mutation'
import { SettingsDto } from '@/src/dto/user.dto'

export default function Settings() {
  const { data: settings, mutate } = useSWR<GetUserSettings>('/api/user/settings')

  const { trigger } = useSWRMutation(
    '/api/user/settings',
    async (url, { arg }: { arg: SettingsDto }) =>
      fetch(url, {
        method: 'PUT',
        body: JSON.stringify(arg)
      })
  )

  const handleChange = (arg: SettingsDto) => {
    const { key, ...patch } = arg
    mutate(
      (prev) => {
        if (!prev) return
        const newData = { ...prev } as unknown as Record<string, unknown>
        const keys = key.split('.')
        const last = keys.pop()!
        const target = keys
          .slice(0, -1)
          .reduce<Record<string, unknown>>((acc: Record<string, unknown>, k: string) => {
            return acc[k] as Record<string, unknown>
          }, newData)
        target[last] = { ...(target[last] as Record<string, unknown>), ...patch }
        return newData as unknown as GetUserSettings
      },
      { revalidate: false }
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* 站点设置 */}
        <SiteSettings settings={settings?.site} onUpdate={trigger} onChange={handleChange} />
        {/* 通知设置 */}
        <NotificationSettings settings={settings?.notify.telegram} onUpdate={trigger} />
      </div>
    </div>
  )
}
