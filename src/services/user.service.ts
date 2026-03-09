import { config } from '../lib/conf'
import argon2 from 'argon2'
import fs from 'node:fs/promises'
import { User, Settings } from '../lib/conf'
import { DeepPropType, Paths } from '../lib/types'
import path from 'node:path'

// 更新用户信息
export const updateUserInfo = async (
  userInfo: Omit<Partial<User>, 'avatar'> & { avatar?: Buffer }
) => {
  if (userInfo.name) config.set('user.name', userInfo.name)
  if (userInfo.avatar) {
    try {
      await fs.writeFile(path.join(process.cwd(), 'config/assets/avatar.png'), userInfo.avatar)
    } catch {
      await fs.mkdir(path.join(process.cwd(), 'config/assets'))
      await fs.writeFile(path.join(process.cwd(), 'config/assets/avatar.png'), userInfo.avatar)
    }
    config.set('user.avatar', '/assets/avatar.png')
  }
  if (userInfo.password) {
    const hash = await argon2.hash(userInfo.password)
    config.set('user.password', hash)
  }

  return config.get('user')!
}
// 获取用户信息
export const getUserInfo = () => config.get('user')!

// 获取用户设置
export const getUserSettings = () => config.get('settings')

export type GetUserSettings = ReturnType<typeof getUserSettings>

// 更新用户设置
export const updateUserSettings = (
  key: Paths<Settings>,
  setting: Partial<DeepPropType<Settings, Paths<Settings>>>
) => {
  const oldSettings = config.get(`settings.${key}`) as DeepPropType<Settings, Paths<Settings>>
  const newSettings = {
    ...oldSettings,
    ...setting
  }
  config.set(`settings.${key}`, newSettings)
  return newSettings
}
