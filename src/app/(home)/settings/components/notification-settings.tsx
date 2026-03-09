import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/src/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { Switch } from '@/src/components/ui/switch'
import { NotifyWhen, settingsDto, SettingsDto } from '@/src/dto/user.dto'
import { GetUserSettings } from '@/src/services/user.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bell, Send } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor
} from '@/src/components/ui/combobox'
import { SiteState, stateMap } from '@/src/lib/common'

const notify: NotifyWhen[] = [NotifyWhen.failed, NotifyWhen.success]

export const NotificationSettings = ({
  settings,
  onUpdate
}: {
  settings?: GetUserSettings['notify']['telegram']
  onUpdate: (arg: SettingsDto) => void
}) => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(settingsDto),
    defaultValues: {
      key: 'notify.telegram'
    }
  })

  const anchor = useComboboxAnchor()
  return (
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
            <Send className="h-4 w-4 text-muted-foreground" />
            Telegram
          </div>
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">配置</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Telegram 配置</DialogTitle>
                  <DialogDescription>请输入您的 Telegram 机器人令牌和用户 ID。</DialogDescription>
                  <form onSubmit={handleSubmit((data) => onUpdate(data))}>
                    <FieldGroup>
                      <FieldSet>
                        <Controller
                          control={control}
                          name="notifyWhen"
                          defaultValue={settings?.notifyWhen || []}
                          render={({ field }) => (
                            <Field orientation="horizontal">
                              <FieldLabel className="w-30" htmlFor={field.name}>
                                类型
                              </FieldLabel>
                              <Combobox
                                multiple
                                autoHighlight
                                items={notify}
                                id={field.name}
                                value={field.value}
                                onValueChange={(values) => {
                                  field.onChange(values)
                                }}
                              >
                                <ComboboxChips ref={anchor} className="w-full ">
                                  <ComboboxValue>
                                    {(values: SiteState[]) => (
                                      <>
                                        {values.map((value) => (
                                          <ComboboxChip key={value}>{stateMap[value]}</ComboboxChip>
                                        ))}
                                        <ComboboxChipsInput
                                          placeholder={values.length ? '' : '在什么时候发送通知'}
                                        />
                                      </>
                                    )}
                                  </ComboboxValue>
                                </ComboboxChips>
                                <ComboboxContent anchor={anchor}>
                                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                                  <ComboboxList className="pointer-events-auto">
                                    {(item: SiteState) => (
                                      <ComboboxItem key={item} value={item}>
                                        {stateMap[item]}
                                      </ComboboxItem>
                                    )}
                                  </ComboboxList>
                                </ComboboxContent>
                              </Combobox>
                            </Field>
                          )}
                        />
                        <Controller
                          control={control}
                          name="botToken"
                          defaultValue={settings?.botToken || ''}
                          render={({ field, fieldState }) => (
                            <Field orientation="horizontal">
                              <FieldLabel className="w-30" htmlFor={field.name}>
                                机器人令牌
                              </FieldLabel>
                              <Input
                                {...field}
                                id={field.name}
                                placeholder={fieldState.error?.message || '123456789:ABCDEF'}
                                aria-invalid={fieldState.invalid}
                              />
                            </Field>
                          )}
                        />
                        <Controller
                          control={control}
                          name="chatId"
                          defaultValue={settings?.chatId || ''}
                          render={({ field, fieldState }) => (
                            <Field orientation="horizontal">
                              <FieldLabel className="w-30" htmlFor={field.name}>
                                用户 ID
                              </FieldLabel>
                              <Input
                                {...field}
                                id={field.name}
                                placeholder={fieldState.error?.message || '123456789'}
                                aria-invalid={fieldState.invalid}
                              />
                            </Field>
                          )}
                        />
                      </FieldSet>

                      <FieldSet>
                        <DialogClose asChild className="self-start w-auto">
                          <Field orientation="horizontal">
                            <Button type="submit">保存</Button>
                            <Button type="button" variant="outline">
                              取消
                            </Button>
                          </Field>
                        </DialogClose>
                      </FieldSet>
                    </FieldGroup>
                  </form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Switch
              checked={settings?.enable}
              onCheckedChange={(checked) => onUpdate({ enable: checked, key: 'notify.telegram' })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
