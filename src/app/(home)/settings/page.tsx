'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Label } from '@/src/components/ui/label'
import { Separator } from '@/src/components/ui/separator'
import { Switch } from '@/src/components/ui/switch'
import { Bell, Shield, Mail, Smartphone } from 'lucide-react'
import { SiteSettings } from './components/site-settings'
import useSWR from 'swr'
import { GetUserSettings } from '@/src/services/user.service'

export default function Settings() {
  const { data: settings, mutate } = useSWR('/api/user/settings', (url) =>
    fetch(url).then((res) => res.json() as Promise<GetUserSettings>)
  )

  return (
    <div className="flex-1 space-y-6 p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <SiteSettings settings={settings} mutate={mutate} />
        {/* 通知设置 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>通知</CardTitle>
            </div>
            <CardDescription>选择您想要接收的通知类型</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label>邮件通知</Label>
                  <p className="text-sm text-muted-foreground">接收重要更新的邮件通知</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label>推送通知</Label>
                  <p className="text-sm text-muted-foreground">在浏览器中接收推送通知</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label>安全警报</Label>
                  <p className="text-sm text-muted-foreground">当检测到可疑活动时接收警报</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>营销邮件</Label>
                <p className="text-sm text-muted-foreground">接收产品更新和促销信息</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
