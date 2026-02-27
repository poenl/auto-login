import { Slider } from '@/src/components/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Mail, Globe } from 'lucide-react'
import { Label } from '@/src/components/ui/label'
import useSWRMutation from 'swr/mutation'
import { SettingsDto } from '@/src/dto/user.dto'
import { KeyedMutator } from 'swr'
import { Settings } from '@/src/lib/conf'
import { GetUserSettings } from '@/src/services/user.service'

export const SiteSettings = ({
  settings,
  mutate
}: {
  settings?: GetUserSettings
  mutate: KeyedMutator<Settings>
}) => {
  const changeSetting = (patch: Partial<SettingsDto>) => {
    if (!settings) return
    mutate({ ...settings, ...patch }, { revalidate: false })
  }

  const { trigger } = useSWRMutation(
    '/api/user/settings',
    async (url, { arg }: { arg: SettingsDto }) =>
      fetch(url, {
        method: 'PUT',
        body: JSON.stringify(arg)
      })
  )
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <CardTitle>站点登录设置</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label>登录超时时间</Label>
              <p className="text-sm text-muted-foreground">站点自动登录的超时时间，单位为秒</p>
            </div>
          </div>
          <Slider
            value={[settings?.loginTimeout || 0]}
            max={100}
            minValue={10}
            step={10}
            onValueChange={([value]) => changeSetting({ loginTimeout: value })}
            onValueCommit={([value]) => trigger({ loginTimeout: value })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label>检查超时时间</Label>
              <p className="text-sm text-muted-foreground">登录成功后检查的超时时间，单位为秒</p>
            </div>
          </div>
          <Slider
            value={[settings?.checkTimeout || 0]}
            max={100}
            minValue={10}
            step={10}
            onValueChange={([value]) => changeSetting({ checkTimeout: value })}
            onValueCommit={([value]) => trigger({ checkTimeout: value })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
