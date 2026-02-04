import puppeteer from 'puppeteer'
// import { config } from '@/src/lib/conf'
// import { config } from '../../../lib/conf'
import Conf from 'conf'
import argon2 from 'argon2'
import type { CookieData } from 'puppeteer-core'

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCookies(cookies: any[]): CookieData[] {
  return cookies
    .filter((c) => c?.name && c?.value)
    .map((c) => {
      let sameSite: CookieData['sameSite']

      if (c.sameSite === 'strict') sameSite = 'Strict'
      else if (c.sameSite === 'none') sameSite = 'None'
      else if (c.sameSite === 'lax') sameSite = 'Lax'

      return {
        name: String(c.name),
        value: String(c.value),
        domain: c.domain,
        path: c.path ?? '/',
        secure: !!c.secure,
        httpOnly: !!c.httpOnly,
        ...(sameSite ? { sameSite } : {}),
        ...(typeof c.expires === 'number' ? { expires: Math.floor(c.expires / 1000) } : {})
      }
    })
}

const start = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: './user_data',
    args: ['--disk-cache-dir=./cache']
  })

  const sites = config.get('sites')

  await Promise.all(
    sites
      .map((site) => {
        if (!site.cookie) return

        return browser.setCookie(...normalizeCookies(JSON.parse(site.cookie)))
      })
      .filter((item) => item)
  )

  await Promise.all(
    sites
      .map(async (site) => {
        if (!site.storage) return

        const page = await browser.newPage()

        await page.evaluateOnNewDocument(
          (storage) => {
            for (const [key, value] of Object.entries(storage)) {
              localStorage.setItem(key, value)
            }
          },
          JSON.parse(site.storage) as object
        )

        return page.goto(site.url)
      })
      .filter((item) => item)
  )
}

start()
