import Koa from 'koa'
import Router from '@koa/router'
import { createReadStream } from 'fs'

import { generate } from './feed.js'
import { getToken } from './utils.js'

const router = new Router()

router.get('/', (ctx) => {
  ctx.body = createReadStream('index.html')
  ctx.type = 'text/html; charset=utf-8'
})

router.get('/feed', async (ctx) => {
  let token: string
  try {
    token = getToken(ctx.request.headers['authorization'])
  } catch {
    console.warn('Error in get token from Authorization header')

    ctx.body = 'Error in get token from Authorization header'
    ctx.status = 401
    return
  }

  let feed: string
  try {
    feed = await generate(token)
  } catch (e) {
    if (e instanceof Error && e.message === 'Invalid token') {
      console.warn(e.message)

      ctx.body = e.message
      ctx.status = 401
      return
    }

    throw e
  }

  ctx.body = feed
  ctx.type = 'application/atom+xml; charset=utf-8'
})

const app = new Koa()
app.use(async (ctx, next) => {
  const start = performance.now()
  try {
    await next()
  } catch (e) {
    console.error(e)
    ctx.body = 'Internal Server Error'
    ctx.status = 500
  }
  const end = performance.now()

  console.log(
    ctx.ip,
    new Date(),
    ctx.method,
    ctx.path,
    `HTTP/${ctx.req.httpVersion}`,
    ctx.status,
    `${Math.round(end - start)}ms`,
  )
})
app.use(router.routes())
app.use(router.allowedMethods())

const port = process.env.APP_PORT ?? 3000
app.listen(port)
console.log(`Listening in http://localhost:${port}`)
