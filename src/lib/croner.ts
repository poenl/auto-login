import { Cron } from 'croner'
import { getSites } from '../services/site.service'
import { refreshPage } from './puppeteer'

// 设置定时任务
export const setCron = async () => {
  const sites = await getSites()
  sites.forEach((site) => {
    new Cron(site.interval, () => refreshPage(site))
  })
}
