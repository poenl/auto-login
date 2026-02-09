import puppeteer, { CookieData } from 'puppeteer'
import { sitesTable } from '@/src/db/schema'
import { SiteState } from '@/src/db/schema'
import { updateSite } from '../services/site.service'

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

export const openPage = async (site: typeof sitesTable.$inferSelect) => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: './user_data'
  })

  const page = await browser.newPage()

  const runningScreenShot = await page.screenshot()
  await updateSite(site.id, {
    state: SiteState.Running,
    screenshot: Buffer.from(runningScreenShot)
  })

  // 异步执行
  const asyncFn = async () => {
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

    await page.goto(site.url, { waitUntil: 'networkidle2' })

    const screenshot = await page.screenshot()
    await updateSite(site.id, { state: SiteState.Checking, screenshot: Buffer.from(screenshot) })
    try {
      // 发生跳转，可能登录失败
      await page.waitForNavigation({ timeout: 5000 })
      const failedScreenshot = await page.screenshot()
      await updateSite(site.id, {
        state: SiteState.Failed,
        screenshot: Buffer.from(failedScreenshot)
      })
    } catch {}

    await updateSite(site.id, { state: SiteState.Success })

    const pages = await browser.pages()
    await Promise.all(pages.map((p) => p.close()))
    await browser.close()
  }

  try {
    asyncFn()
  } catch {
    updateSite(site.id, { state: SiteState.Failed })
  }

  return
}

export const refreshPage = async (site: typeof sitesTable.$inferSelect) => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: './user_data'
  })

  const page = await browser.newPage()

  await page.goto(site.url, { waitUntil: 'networkidle2' })

  const screenshot = await page.screenshot()
  await updateSite(site.id, { state: SiteState.Checking, screenshot: Buffer.from(screenshot) })

  try {
    await page.waitForNavigation({ timeout: 5000 })
    const failedScreenshot = await page.screenshot()
    await updateSite(site.id, {
      state: SiteState.Failed,
      screenshot: Buffer.from(failedScreenshot)
    })
  } catch {}

  await updateSite(site.id, { state: SiteState.Success })

  const pages = await browser.pages()
  await Promise.all(pages.map((p) => p.close()))
  await browser.close()
}
