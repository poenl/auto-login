import Conf from 'conf'
import argon2 from 'argon2'
import path from 'node:path'
import { generateSecret } from 'jose'

interface Config {
  user?: {
    name: string
    password: string
    avatar?: string
  }
  sites: {
    id: string
    url: string
    storage?: string
    cookie?: string
  }[]
  sessionKey?: string
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
