import Conf from 'conf'
import argon2 from 'argon2'
import path from 'node:path'
import { generateSecret } from 'jose'
import { NotifyWhen } from '../dto/user.dto'
import crypto from 'node:crypto'
import { isMain } from './utils'

export interface User {
  name: string
  password: string
  avatar?: string
}
export interface Settings {
  site: {
    loginTimeout: number
    checkTimeout: number
  }
  notify: {
    telegram: {
      botToken?: string
      chatId?: string
      notifyWhen?: NotifyWhen[] // 什么时候发送通知，为空则不发送
      enable: boolean
    }
  }
}
interface Config {
  user?: User
  sites: {
    id: string
    url: string
    storage?: string
    cookie?: string
  }[]
  sessionKey?: string
  settings: Settings
}

export const config = new Conf<Config>({
  fileExtension: 'json',
  cwd: path.join(process.cwd(), 'config')
})
// 生成随机密码
function generateSecurePassword(length: number) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = crypto.randomBytes(length)
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset[bytes[i] % charset.length]
  }
  return password
}

export const createAdmin = async () => {
  if (config.get('user')) return

  const securePassword = generateSecurePassword(8)
  const password = await argon2.hash(securePassword)
  const user = {
    name: 'admin',
    password
  }
  config.set('user', user)
  console.log(`管理员账号已创建，用户名：admin，密码：${securePassword}`)
}
// 重置密码
export const resetPassword = async () => {
  const user = config.get('user')
  if (!user) throw new Error('用户不存在')
  const securePassword = generateSecurePassword(8)
  const hashedPassword = await argon2.hash(securePassword)
  user.password = hashedPassword
  config.set('user', user)
  console.log(`密码已重置，新密码为：${securePassword}`)
}
if (isMain(import.meta.url)) resetPassword()

// 创建会话密钥
export const createSessionKey = async () => {
  const key = config.get('sessionKey')
  if (key) return key

  const sessionKey = (await generateSecret('A128CBC-HS256')) as Uint8Array<ArrayBufferLike>
  const base64String = btoa(String.fromCharCode(...sessionKey))
  config.set('sessionKey', base64String)
}

export const initSettings = () => {
  const settings = config.get('settings')
  if (settings) return

  const defaultSettings = {
    site: {
      loginTimeout: 10,
      checkTimeout: 10
    },
    telegram: {
      enable: false
    }
  }
  config.set('settings', defaultSettings)
}
