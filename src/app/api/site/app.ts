import puppeteer, { CookieData } from 'puppeteer'
// import { config, Site } from '@/src/lib/conf'
// import Conf from 'conf'
// import argon2 from 'argon2'
// import type { CookieData } from 'puppeteer-core'
import { addSiteDto } from '@/src/dto/site'
import z from 'zod'

// export interface Site {
//   id: string
//   url: string
//   storage?: string
//   cookie?: string
// }

// interface Config {
//   user?: {
//     name: string
//     password: string
//   }
//   sites: Site[]
// }

// export const config = new Conf<Config>({ fileExtension: 'json', cwd: process.cwd() })

// export const createAdmin = async () => {
//   if (config.get('user')) return

//   const password = await argon2.hash('123456')
//   const user = {
//     name: 'admin',
//     password
//   }
//   config.set('user', user)
// }

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

// const start = async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     userDataDir: './user_data',
//     args: ['--disk-cache-dir=./cache']
//   })

//   const sites = config.get('sites')

//   // const cookies = await browser.cookies()
//   // const cookiesMap = new Map(cookies.map((c) => [`${c.name}${c.domain}${c.path}`, c]))

//   // await Promise.all(sites.map((site) => {}).filter((item) => item))

//   // console.log(await browser.cookies())

//   await Promise.all(
//     sites.map(async (site) => {
//       const page = await browser.newPage()
//       if (site.storage) {
//         await page.evaluateOnNewDocument(
//           (storage) => {
//             for (const [key, value] of Object.entries(storage)) {
//               localStorage.setItem(key, value)
//             }
//           },
//           JSON.parse(site.storage) as object
//         )
//       }

//       if (site.cookie) {
//         if (!site.cookie) return

//         const cookies = normalizeCookies(JSON.parse(site.cookie))
//         // const cookiesToSet = cookies.filter((c) => !cookiesMap.has(`${c.name}${c.domain}${c.path}`))

//         await browser.setCookie(...cookies)
//       }

//       await page.goto(site.url)

//       await page.waitForNetworkIdle()

//       await page.screenshot({ path: `./screenshots/${site.id}.png` })

//       try {
//         // 发生跳转，可能登录失败
//         await page.waitForNavigation()
//         await page.screenshot({ path: `./screenshots/${site.id}.png` })
//       } catch {}

//       return page.close()
//     })
//   )

//   await browser.close()
// }

// start()

export const openPage = async (site: z.infer<typeof addSiteDto> & { id: string }) => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: './user_data',
    args: ['--disk-cache-dir=./cache']
  })

  const page = await browser.newPage()

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
    // const cookiesToSet = cookies.filter((c) => !cookiesMap.has(`${c.name}${c.domain}${c.path}`))

    await browser.setCookie(...cookies)
  }

  await page.goto(site.url)

  await page.waitForNetworkIdle()

  await page.screenshot({ path: `./src/app/api/site/screenshots/${site.id}.png` })

  try {
    // 发生跳转，可能登录失败
    await page.waitForNavigation()
    await page.screenshot({ path: `./src/app/api/site/screenshots/${site.id}.png` })
  } catch {}

  await page.close()

  await browser.close()
}
