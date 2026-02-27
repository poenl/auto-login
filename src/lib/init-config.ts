import { createAdmin, createSessionKey, initSettings } from '@/src/lib/conf'
import { setCron } from '@/src/lib/croner'

initSettings()
await Promise.all([createAdmin(), createSessionKey(), setCron()])

console.log('init config done')
