import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
  headless: false,
  userDataDir: './user_data',
  args: ['--disk-cache-dir=./cache']
})
const page = await browser.newPage()

await page.goto('https://kp.m-team.cc/index')
