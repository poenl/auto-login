import { Cron } from 'croner'
import { getSites } from '../services/site.service'
import { refreshPage } from './puppeteer'

// 存储定时任务
export const croners = new Map<number, Cron>()
// 设置定时任务

export const setCron = (site: { id: number; url: string; interval: string }) => {
  const job = new Cron(site.interval, () => refreshPage(site))
  croners.set(site.id, job)
}

// 清除定时任务
export const clearCron = (id: number) => {
  const job = croners.get(id)
  if (!job || !job.isRunning()) return

  job.stop()
  croners.delete(id)
}

// 更新定时任务
export const updateCron = (site: { id: number; url: string; interval: string }) => {
  clearCron(site.id)
  setCron(site)
}

// 设置定时任务
export const initCronAll = async () => {
  if (process.env.NODE_ENV === 'development') return

  const sites = await getSites()
  sites.forEach((site) => {
    const job = new Cron(site.interval, () => refreshPage(site))
    croners.set(site.id, job)
  })
}
