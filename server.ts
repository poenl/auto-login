import { createAdmin, createSessionKey } from '@/src/lib/conf'
import { setCron } from '@/src/lib/croner'

import next from 'next'
import { createServer } from 'http'

const app = next({ dev: false })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createAdmin()
  createSessionKey()
  setCron()

  createServer((req, res) => {
    handle(req, res)
  }).listen(3000)

  console.log('> Ready on http://localhost:3000')
})
