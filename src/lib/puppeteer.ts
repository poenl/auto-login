export const dynamic = 'force-dynamic'

import puppeteer, { CookieData, Page } from 'puppeteer'
import { sitesTable } from '@/src/db/schema'
import { SiteState } from '@/src/db/schema'
import { updateSite, GetSites, addRecord } from '../services/site.service'
import { config } from './conf'

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

const settings = config.get('settings')
const open = async (page: Page, site: { id: number; url: string }) => {
  try {
    await page.goto(site.url, { timeout: settings.loginTimeout * 1000, waitUntil: 'networkidle2' })

    // 提前发生跳转
    if (page.url() !== site.url) {
      const failedScreenshot = await page.screenshot()
      await updateSite(site.id, {
        state: SiteState.Failed,
        screenshot: Buffer.from(failedScreenshot)
      })
      return
    }

    const updateCheckSite = async () => {
      const checkScreenshot = await page.screenshot()
      await updateSite(site.id, {
        state: SiteState.Checking,
        screenshot: Buffer.from(checkScreenshot)
      })
    }

    try {
      await Promise.all([
        updateCheckSite(),
        page.waitForNavigation({ timeout: settings.checkTimeout * 1000 })
      ])

      const failedScreenshot = await page.screenshot()

      await Promise.all([
        updateSite(site.id, {
          state: SiteState.Failed,
          screenshot: Buffer.from(failedScreenshot)
        }),
        addRecord({
          siteId: site.id,
          state: SiteState.Failed,
          screenshot: Buffer.from(failedScreenshot)
        })
      ])
    } catch {
      const successScreenshot = await page.screenshot()
      await Promise.all([
        updateSite(site.id, { state: SiteState.Success }),
        addRecord({
          siteId: site.id,
          state: SiteState.Success,
          screenshot: Buffer.from(successScreenshot)
        })
      ])
    }
  } catch {
    // 页面打开超时
    const timeoutScreenshot = await page.screenshot()
    await Promise.all([
      updateSite(site.id, { state: SiteState.Timeout, screenshot: Buffer.from(timeoutScreenshot) }),
      addRecord({
        siteId: site.id,
        state: SiteState.Timeout,
        screenshot: Buffer.from(timeoutScreenshot)
      })
    ])
  }
}

const createBrowser = async () => {
  return puppeteer.launch({
    headless: false,
    userDataDir: './config/user_data'
  })
}
// 打开页面
export const openPage = async (site: typeof sitesTable.$inferSelect) => {
  const browser = await createBrowser()

  const page = await browser.newPage()

  const runningScreenShot = await page.screenshot()
  await updateSite(site.id, {
    state: SiteState.Running,
    screenshot: Buffer.from(runningScreenShot)
  })

  if (site.storage) {
    await page.evaluateOnNewDocument(
      (storage) => {
        for (const [key, value] of Object.entries(storage)) {
          localStorage.setItem(key, value)
        }
      },
      JSON.parse(site.storage) as object
    )
  }

  if (site.cookie) {
    const cookies = normalizeCookies(JSON.parse(site.cookie))
    await browser.setCookie(...cookies)
  }

  await open(page, site)

  const pages = await browser.pages()
  await Promise.all(pages.map((p) => p.close()))
  await browser.close()
}
// 刷新页面
export const refreshPage = async (site: { id: number; url: string }) => {
  const browser = await createBrowser()

  const page = await browser.newPage()

  await open(page, site)

  const pages = await browser.pages()
  await Promise.all(pages.map((p) => p.close()))
  await browser.close()
}
// 打开所有页面
export const openPageAll = async (sites: GetSites) => {
  const browser = await createBrowser()

  await Promise.all(
    sites.map(async (site) => {
      const page = await browser.newPage()
      await open(page, site)
    })
  )

  const pages = await browser.pages()
  await Promise.all(pages.map((p) => p.close()))
  await browser.close()
}
