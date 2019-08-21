import { Base64 } from 'js-base64'
import { Feed } from 'feed'
import axios from 'axios'
import Koa from 'koa'
import Router from 'koa-router'

import Comment from './types/comment';
import Notification from './types/notification';
import Pull from './types/pull';

const app = new Koa()
const router = new Router()

const getToken = (header: string) => {
  const body = header.split(' ')[1]
  const base64 = Base64.decode(body)
  const authorization = base64.toString().split(':')

  return authorization[1]
}

const dateSort = (a:string, b:string) => {
  const aDate = new Date(a)
  const bDate = new Date(b)

  return aDate == bDate ? 0 : aDate < bDate ? 1 : -1
}

router.get("/atom", async ctx => {
  let token = ''
  try {
    token = getToken(ctx.request.headers['authorization'])
  } catch (error) {
    ctx.throw(401, 'Authorization required');
  }

  const notifications = await axios.get<Notification[]>('https://api.github.com/notifications', {
    headers: {
      "Authorization": `token ${token}`,
    },
  })

  const updatedAt = 0 < notifications.data.length
    ? new Date(notifications.data.sort((a,b) => dateSort(a.updated_at, b.updated_at))[0].updated_at)
    : new Date()

  const feed = new Feed({
    title: "GitHub Notifications",
    description: "Depending on your notification settings, you’ll see updates here for your conversations in watched repositories.",
    id: "https://ilmestys.now.sh",
    link: "https://github.com/notifications",
    image: "https://github.githubassets.com/pinned-octocat.svg",
    favicon: "https://github.githubassets.com/favicon.ico",
    copyright: "GitHub, Inc.",
    updated: updatedAt,
    generator: "ilmestys",
    author: {
      name: "GitHub",
      link: "https://github.com"
    },
  });

  await Promise.all(notifications.data.map(async notification => {
    const description = await axios.get<Comment|Pull>(
      notification.subject.latest_comment_url || notification.subject.url
    )

    feed.addItem({
      title: notification.subject.title,
      id: `tag:${notification.id}`,
      link: notification.subject.url,
      description: description.data.html_url,
      content: description.data.body,
      author: [
        {
          name: description.data.user.login,
          link: description.data.user.html_url,
        },
      ],
      date: new Date(notification.updated_at),
      image: description.data.user.avatar_url,
    })
  }))

  ctx.type = "application/atom+xml; charset=utf-8"
  ctx.body = feed.atom1()
})

app.use(router.routes())

if (!process.env.IS_NOW) {
  const port = process.env.PORT || 5000
  app.listen(port)
  console.log(`Application has booted on http://localhost:${port}`)
}

export default app.callback()
