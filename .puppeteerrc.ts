import { join } from 'path'

const config = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: join('.cache', 'puppeteer')
}

export default config
