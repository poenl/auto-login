import * as z from 'zod'
import cronstrue from 'cronstrue'

export const addSiteDto = z
  .object({
    name: z.string().nonempty('请输入站点名称'),
    url: z.url('请输入合法的 URL'),
    storage: z.string().optional(),
    cookie: z.string().optional(),
    interval: z.string().nonempty('请输入 cron 表达式')
  })
  .superRefine((data, ctx) => {
    if (!data.storage && !data.cookie) {
      ctx.addIssue({
        code: 'custom',
        message: '存储或cookie至少填写一个',
        path: ['storage']
      })
      ctx.addIssue({
        code: 'custom',
        message: '存储或cookie至少填写一个',
        path: ['cookie']
      })
    }

    try {
      cronstrue.toString(data.interval)
    } catch {
      ctx.addIssue({
        code: 'custom',
        message: '请输入正确的 cron 表达式',
        path: ['cron']
      })
    }
  })
