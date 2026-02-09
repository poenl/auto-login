import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'dayjs/locale/zh-cn' // 导入中文语言包

// 设置全局语言为中文
dayjs.locale('zh-cn')

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.updateLocale('zh-cn', {
  relativeTime: {
    future: 'in %s',
    past: '%s 前',
    // s: 'a few seconds',
    // m: 'a minute',
    // mm: '%d 分',
    // h: 'an hour',
    // hh: '%d hours',
    // d: 'a day',
    // dd: '%d days',
    // M: 'a month',
    // MM: '%d months',
    // y: 'a year',
    // yy: '%d years'
    s: '刚刚',
    m: '1 分钟前',
    mm: '%d 分钟前',
    h: '1 小时前',
    hh: '%d 小时前',
    d: '1 天前',
    dd: '%d 天前',
    M: '1 个月前',
    MM: '%d 个月前',
    y: '1 年前',
    yy: '%d 年前'
  }
})
export const date = dayjs
