import Conf from 'conf'
import argon2 from 'argon2'
import path from 'node:path'
import { generateSecret } from 'jose'

export interface User {
  name: string
  password: string
  avatar?: string
}
export interface Settings {
  loginTimeout: number
  checkTimeout: number
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

export const createAdmin = async () => {
  if (config.get('user')) return

  const password = await argon2.hash('123456')
  const user = {
    name: 'admin',
    password
  }
  config.set('user', user)
}

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
    loginTimeout: 10,
    checkTimeout: 10
  }
  config.set('settings', defaultSettings)
}
