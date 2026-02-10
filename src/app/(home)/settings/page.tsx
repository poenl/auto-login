'use client'

import { Button } from '@/src/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Separator } from '@/src/components/ui/separator'
import { Switch } from '@/src/components/ui/switch'
import { Badge } from '@/src/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import {
  Bell,
  Lock,
  User,
  Shield,
  Trash2,
  Mail,
  Smartphone,
  LogOut,
  Key,
  Palette,
  Clock
} from 'lucide-react'

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
        {/* 个人资料 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>个人资料</CardTitle>
            </div>
            <CardDescription>更新您的个人信息和头像</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://github.com/shadcn.png" alt="用户头像" />
                <AvatarFallback>用户</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  更换头像
                </Button>
                <p className="text-xs text-muted-foreground">支持 JPG、PNG 格式，最大 2MB</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input id="username" placeholder="输入用户名" defaultValue="username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">显示名称</Label>
                <Input id="displayName" placeholder="输入显示名称" defaultValue="显示名称" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">邮箱地址</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="输入邮箱"
                  defaultValue="user@example.com"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">个人简介</Label>
                <Input id="bio" placeholder="介绍一下自己..." />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">取消</Button>
            <Button>保存更改</Button>
          </CardFooter>
        </Card>

        {/* 外观设置 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>外观</CardTitle>
            </div>
            <CardDescription>自定义应用的外观和主题</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>深色模式</Label>
                <p className="text-sm text-muted-foreground">在浅色和深色主题之间切换</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>主题颜色</Label>
              <div className="flex gap-3">
                {[
                  'bg-blue-500',
                  'bg-green-500',
                  'bg-purple-500',
                  'bg-orange-500',
                  'bg-pink-500'
                ].map((color) => (
                  <button
                    key={color}
                    className={`h-8 w-8 rounded-full ${color} ring-2 ring-offset-2 ring-transparent hover:ring-primary transition-all`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 自动执行间隔 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>自动执行间隔</CardTitle>
            </div>
            <CardDescription>设置自动任务的执行频率</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="interval-type">执行频率</Label>
                <select 
                  id="interval-type"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="daily">每天</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                  <option value="custom">自定义 (Cron)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interval-cron">Cron 表达式</Label>
                <Input 
                  id="interval-cron" 
                  placeholder="0 0 * * *" 
                  disabled
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              选择预设频率或自定义 Cron 表达式 (分 时 日 月 周)
            </p>
          </CardContent>
        </Card>

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

        {/* 安全设置 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>安全</CardTitle>
            </div>
            <CardDescription>管理您的账户安全设置</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    <Label>密码</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">上次更改: 3个月前</p>
                </div>
                <Button variant="outline" size="sm">
                  更改密码
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <Label>双因素认证</Label>
                    <Badge variant="secondary">已启用</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">使用身份验证器应用保护您的账户</p>
                </div>
                <Button variant="outline" size="sm">
                  配置
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>登录会话</Label>
                  <p className="text-sm text-muted-foreground">管理您当前的登录设备</p>
                </div>
                <Button variant="outline" size="sm">
                  查看会话
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 退出登录 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-primary" />
              <CardTitle>会话</CardTitle>
            </div>
            <CardDescription>管理您的登录会话</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              退出所有设备
            </Button>
          </CardContent>
        </Card>

        {/* 危险区域 */}
        <Card className="border-destructive/50">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              <CardTitle className="text-destructive">危险区域</CardTitle>
            </div>
            <CardDescription>这些操作不可撤销，请谨慎操作</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-destructive/20 p-4">
              <div className="space-y-1">
                <p className="font-medium text-destructive">删除账户</p>
                <p className="text-sm text-muted-foreground">永久删除您的账户和所有相关数据</p>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                删除账户
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
