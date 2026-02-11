'use client'

import { Button } from '@/src/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet
} from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { useForm, SubmitHandler, FieldValues, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addSiteDto } from '@/src/dto/site.dto'
import { useEffect, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner } from '@/src/components/ui/spinner'
import cronstrue from 'cronstrue'
import 'cronstrue/locales/zh_CN'
import useSWR from 'swr'
import { GetSiteInfo } from '@/src/services/site.service'

export default function Test() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { control, handleSubmit, trigger, setValue } = useForm({
    resolver: zodResolver(addSiteDto)
  })

  const siteId = searchParams.get('id')
  const { data } = useSWR(siteId ? `/api/site/info/${siteId}` : null, async (url) => {
    const res = await fetch(url)
    return res.json() as Promise<GetSiteInfo>
  })
  // 如果是编辑模式，则设置默认值
  useEffect(() => {
    if (!data) return
    setValue('name', data.name)
    setValue('url', data.url)
    if (data.storage) setValue('storage', data.storage)
    if (data.cookie) setValue('cookie', data.cookie)
    setValue('interval', data.interval)
  }, [data, setValue])
  // 提交
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!siteId) {
      setLoading(true)
      const res = await fetch('/api/site', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      setLoading(false)
      if (!res.ok) toast.error((await res.json()).message)
      else {
        toast.success('添加成功')
        router.push('/')
      }
    } else {
      setLoading(true)
      const res = await fetch(`/api/site/${siteId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      setLoading(false)
      if (!res.ok) toast.error((await res.json()).message)
      else {
        toast.success('修改成功')
        router.push('/')
      }
    }
  }
  // 同步storage和cookie状态
  const storage = useWatch({ control, name: 'storage' })
  const cookie = useWatch({ control, name: 'cookie' })

  useEffect(() => {
    if (!storage && !cookie) return

    trigger(['storage', 'cookie'])
  }, [storage, cookie, trigger])

  // 提交中
  const [loading, setLoading] = useState(false)

  // cron表达式描述
  const getCronDescription = (cron: string | undefined) => {
    try {
      if (!cron) return ''
      return cronstrue.toString(cron, { locale: 'zh_CN', use24HourTimeFormat: true })
    } catch {
      return ''
    }
  }
  return (
    <div className="p-4 bg-secondary h-full flex justify-center items-center">
      <Card className="max-w-200 flex-1">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Apple or Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet className="min-w-0">
                {/* 名称 */}
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="Name"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription>Enter your name</FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                {/* 网址 */}
                <Controller
                  name="url"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Card Number</FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="1234 5678 9012 3456"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription>Enter your 16-digit card number</FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                {/* cookie */}
                <Controller
                  name="cookie"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Comments</FieldLabel>
                      <FieldDescription>12</FieldDescription>
                      <Textarea
                        id={field.name}
                        placeholder="Add any additional comments"
                        className="resize-none max-h-30"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                {/* 存储 */}
                <Controller
                  name="storage"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Comments</FieldLabel>
                      <FieldDescription>12</FieldDescription>
                      <Textarea
                        id={field.name}
                        placeholder="Add any additional comments"
                        className="resize-none max-h-30"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                {/* cron */}
                <FieldGroup className="flex flex-row">
                  <Controller
                    name="interval"
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>自动登录周期</FieldLabel>
                        <FieldDescription className="space-x-4">
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => setValue('interval', '0 0 * * *')}
                          >
                            每天
                          </Button>
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => setValue('interval', '0 0 * * 1')}
                          >
                            每周
                          </Button>
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => setValue('interval', '0 0 1 * *')}
                          >
                            每月
                          </Button>
                        </FieldDescription>
                        <Input
                          id={field.name}
                          placeholder="输入Cron表达式"
                          aria-invalid={fieldState.invalid}
                          {...field}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>{getCronDescription(field.value)}</FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </FieldSet>

              <FieldSeparator />

              <Field orientation="horizontal">
                <Button type="submit" disabled={loading}>
                  {loading && <Spinner data-icon="inline-start" />}
                  {siteId ? '更新' : '提交'}
                </Button>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
