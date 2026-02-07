import puppeteer, { CookieData } from 'puppeteer'
import { sitesTable } from '@/src/db/schema'
import { SiteState } from '@/src/db/schema'
import db from '@/src/lib/db'
import { eq } from 'drizzle-orm'

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

// 更新状态和截图
const updateSite = (id: number, state: SiteState, screenshot: Buffer) => {
  return db.update(sitesTable).set({ state, screenshot }).where(eq(sitesTable.id, id))
}

export const openPage = async (site: typeof sitesTable.$inferSelect) => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: './user_data',
    args: ['--disk-cache-dir=./cache']
  })

  const page = await browser.newPage()

  const runningScreenShot = await page.screenshot()
  await updateSite(site.id, SiteState.Running, Buffer.from(runningScreenShot))

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

    await page.goto(site.url)

    await page.waitForNetworkIdle()

    const screenshot = await page.screenshot()
    await updateSite(site.id, SiteState.Checking, Buffer.from(screenshot))
    try {
      // 发生跳转，可能登录失败
      await page.waitForNavigation()
      await updateSite(site.id, SiteState.Failed, Buffer.from(screenshot))
    } catch {}

    await updateSite(site.id, SiteState.Success, Buffer.from(screenshot))

    await page.close()
    await browser.close()
  }
  asyncFn()

  return
}
