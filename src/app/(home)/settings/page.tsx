'use client'

import { SiteSettings } from './components/site-settings'
import useSWR from 'swr'
import { GetUserSettings } from '@/src/services/user.service'
import { NotificationSettings } from './components/notification-settings'
import useSWRMutation from 'swr/mutation'
import { SettingsDto } from '@/src/dto/user.dto'

export default function Settings() {
  const { data: settings, mutate } = useSWR('/api/user/settings', (url) =>
    fetch(url).then((res) => res.json() as Promise<GetUserSettings>)
  )

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
        return { ...prev, [key]: { ...prev[key], ...patch } }
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
        <NotificationSettings settings={settings?.telegram} onUpdate={trigger} />
      </div>
    </div>
  )
}
