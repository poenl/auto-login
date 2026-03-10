import next from 'next'
import { createServer } from 'http'
import chalk from 'chalk'

import './src/lib/init-config'

const app = next({ dev: false })
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(3000)

  console.log(chalk.green('> Ready on http://localhost:3000'))
})
