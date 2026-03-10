import { createAdmin, createSessionKey, initSettings } from '@/src/lib/conf'
import { initCronAll } from '@/src/lib/croner'
import chalk from 'chalk'

initSettings()
await Promise.all([createAdmin(), createSessionKey(), initCronAll()])

console.log(chalk.green('init config done'))
