import { createAdmin, createSessionKey, initSettings } from '@/src/lib/conf'
import { initCronAll } from '@/src/lib/croner'

initSettings()
await Promise.all([createAdmin(), createSessionKey(), initCronAll()])

console.log('init config done')
