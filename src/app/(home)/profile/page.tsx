'use client'

import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { User, LogOut } from 'lucide-react'
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
import { useLogout } from '@/src/hooks/use-logout'

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

  const logout = useLogout()
  return (
    <div className="flex-1 space-y-6 p-4">
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
            <Button variant="outline" className="w-full" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
