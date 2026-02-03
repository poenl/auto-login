import Conf from 'conf'
import argon2 from 'argon2'

interface Config {
  user?: {
    name: string
    password: string
  }
  sites: {
    id: string
    url: string
    storage?: string
    cookie?: string
  }[]
}

export const config = new Conf<Config>({ fileExtension: 'json', cwd: process.cwd() })

export const createAdmin = async () => {
  if (config.get('user')) return

  const password = await argon2.hash('123456')
  const user = {
    name: 'admin',
    password
  }
  config.set('user', user)
}

createAdmin()
