import { config } from '../lib/conf'
import argon2 from 'argon2'
import fs from 'fs'

// 更新用户信息
export const updateUserInfo = async (userInfo: {
  name?: string
  avatar?: Buffer
  password?: string
}) => {
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
