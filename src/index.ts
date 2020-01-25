import Koa from 'koa'
import logger from 'koa-logger'
import responseTime from 'koa-response-time'
import Router from 'koa-router'

import atom from './atom'

const router = new Router()
router.get('/atom', atom)

const app = new Koa()
app.use(logger())
app.use(responseTime())
app.use(router.routes())

if (!process.env.IS_NOW) {
  const port = process.env.PORT || 5000
  app.listen(port)
  console.log(`Application has booted on http://localhost:${port}`)
}

export default app.callback()
