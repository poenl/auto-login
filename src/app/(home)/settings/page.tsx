'use client'

import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Separator } from '@/src/components/ui/separator'
import { Switch } from '@/src/components/ui/switch'
import { Badge } from '@/src/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Bell, Lock, User, Shield, Trash2, Mail, Smartphone, LogOut, Key } from 'lucide-react'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet
} from '@/src/components/ui/field'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { updateUserDto } from '@/src/dto/auth.dto'
import { zodResolver } from '@hookform/resolvers/zod'
import useSWR from 'swr'
import { useUserStore } from '@/src/store/user'
import { UserInfo } from '@/src/store/user'
import { useState } from 'react'
import z from 'zod'

export default function Settings() {
  const { control, handleSubmit } = useForm({ resolver: zodResolver(updateUserDto) })
  const userInfo = useUserStore((state) => state.userInfo)
  const setUserInfo = useUserStore((state) => state.setUserInfo)
  const [avatar, setAvatar] = useState(userInfo.avatar)

  const { data, mutate } = useSWR(
    '/api/user',
    async () => {
      const res = await fetch('/api/user')
      return res.json() as Promise<UserInfo>
    },
    {
      fallbackData: userInfo,
      revalidateOnMount: false,
      revalidateOnFocus: false
    }
  )

  const onSubmit: SubmitHandler<z.infer<typeof updateUserDto>> = async (fields) => {
    const formData = new FormData()
    if (fields.name) formData.append('name', fields.name)
    if (fields.password) formData.append('password', fields.password)
    if (fields.avatar) formData.append('avatar', fields.avatar)

    const result = await mutate(
      () =>
        fetch('/api/user', {
          method: 'PUT',
          body: formData
        }).then((res) => res.json()),
      {
        optimisticData: {
          name: fields.name || data.name,
          avatar: avatar || data.avatar
        }
      }
    )
    if (result) setUserInfo(result)
  }

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
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldSet>
                <Controller
                  name="avatar"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={avatar || userInfo.avatar} alt="用户头像" />
                          <AvatarFallback>用户</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <input
                            type="file"
                            hidden
                            id={field.name}
                            ref={field.ref}
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) setAvatar(URL.createObjectURL(file))
                              field.onChange(file)
                            }}
                          />
                          <FieldLabel htmlFor={field.name}>
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              className="pointer-events-none"
                            >
                              更换头像
                            </Button>
                          </FieldLabel>
                          <FieldDescription> 支持 JPG、PNG 格式，最大 2MB</FieldDescription>
                        </div>
                      </div>
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="name"
                  defaultValue={data.name}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>用户名</FieldLabel>
                      <Input id="name" type="name" placeholder="输入您的用户名" {...field} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="password">密码</FieldLabel>
                      <Input id="password" type="password" placeholder="输入您的密码" {...field} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Field orientation="horizontal">
                  <Button>保存更改</Button>
                </Field>
              </FieldSet>
            </form>
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
