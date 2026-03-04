'use client'

import { LogIn } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { useForm, Controller, SubmitHandler, FieldValues } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupDto } from '@/src/dto/auth.dto'
import { useUserStore } from '@/src/store/user'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/src/components/ui/hover-card'

export default function LoginPage() {
  const router = useRouter()
  const setUserInfo = useUserStore((state) => state.setUserInfo)

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(signupDto),
    defaultValues: {
      name: '',
      password: ''
    }
  })
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify(data)
    })

    if (res.ok) {
      toast.success('登录成功')
      router.push('/')
      const user = await res.json()
      setUserInfo(user)
    } else {
      const error = await res.json()
      toast.error(error.message)
    }
  }

  const resetPassword = 'sh reset_password.sh'

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">登录账号</CardTitle>
        <CardDescription>登录账号以访问所有功能</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="name">用户名</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="admin"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">密码</FieldLabel>
                    {/* 忘记密码 */}
                    <HoverCard openDelay={10} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <Button type="button" variant="link" className="ml-auto text-neutral-500">
                          忘记密码？
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        进入容器内执行以下命令重置密码：
                        <code className="bg-[#eee]">{resetPassword}</code>
                        <Button
                          type="button"
                          className="w-full"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(resetPassword)
                          }}
                        >
                          复制
                        </Button>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <Input
                    id={field.name}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Field>
              <Button type="submit">
                <LogIn />
                登录
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
