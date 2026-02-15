import { Cron } from 'croner'
import { getSites } from '../services/site.service'
import { refreshPage } from './puppeteer'

// 存储定时任务
export const croners = new Map<number, Cron>()
// 清除定时任务
export const clearCron = (id: number) => {
  const job = croners.get(id)
  if (!job || !job.isRunning()) return

  job.stop()
  croners.delete(id)
}
// 更新定时任务
export const updateCron = async (site: { id: number; url: string; interval: string }) => {
  clearCron(site.id)
  const job = new Cron(site.interval, () => refreshPage(site))
  croners.set(site.id, job)
}

// 设置定时任务
export const setCron = async () => {
  const sites = await getSites()
  sites.forEach((site) => {
    const job = new Cron(site.interval, () => refreshPage(site))
    croners.set(site.id, job)
  })
}
