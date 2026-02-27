import { config } from '../lib/conf'
import argon2 from 'argon2'
import fs from 'fs'
import { User, Settings } from '../lib/conf'

// 更新用户信息
export const updateUserInfo = async (
  userInfo: Omit<Partial<User>, 'avatar'> & { avatar?: Buffer }
) => {
  if (userInfo.name) config.set('user.name', userInfo.name)
  if (userInfo.avatar) {
    fs.writeFileSync('public/avatar.png', userInfo.avatar)
    config.set('user.avatar', '/avatar.png')
  }
  if (userInfo.password) {
    const hash = await argon2.hash(userInfo.password)
    config.set('user.password', hash)
  }

  return config.get('user')!
}

// 获取用户设置
export const getUserSettings = () => config.get('settings')

export type GetUserSettings = ReturnType<typeof getUserSettings>

// 更新用户设置
export const updateUserSettings = (setting: Partial<Settings>) => {
  const oldSettings = config.get('settings')
  const newSettings = {
    ...oldSettings,
    ...setting
  }
  config.set('settings', newSettings)
  return newSettings
}
