import next from 'next'
import { createServer } from 'http'

import './src/lib/init-config'

const app = next({ dev: false })
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(3000)

  console.log('> Ready on http://localhost:3000')
})
