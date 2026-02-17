'use client'

import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Label } from '@/src/components/ui/label'
import { Separator } from '@/src/components/ui/separator'
import { Switch } from '@/src/components/ui/switch'
import { Bell, Shield, Mail, Smartphone } from 'lucide-react'

export default function Settings() {
  return (
    <div className="flex-1 space-y-6 p-4">
      {/* 页面标题 */}
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">设置</h1>
            <p className="text-muted-foreground">管理您的账户设置和偏好</p>
          </div>
          <Button variant="outline">重置所有设置</Button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <Separator />
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
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
