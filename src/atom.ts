import { Feed } from 'feed'
import axios, { AxiosResponse } from 'axios'
import Koa from 'koa'

import Comment from './types/comment'
import Notification from './types/notification'
import Pull from './types/pull'

import { dateSort, getToken, sleep, createTagUri, sha1sum } from './utils'

async function atom(ctx: Koa.Context) {
  let token: string
  try {
    token = getToken(ctx.request.headers['authorization'])
  } catch (error) {
    console.warn('Error in get token from Authorization header')
    ctx.throw(401, 'Authorization required')
  }

  let notifications: AxiosResponse<Notification[]>
  try {
    notifications = await axios.get<Notification[]>(
      'https://api.github.com/notifications',
      {
        headers: {
          Authorization: `token ${token}`
        }
      }
    )
  } catch (error) {
    console.warn('Error in get notifications from GitHub API')
    ctx.throw(500, error)
  }
  console.info(
    `Rate limit(${sha1sum(token).substring(0, 8)}): ${
      notifications.headers['x-ratelimit-remaining']
    }/${notifications.headers['x-ratelimit-limit']}`
  )

  // Get latest notification
  const updatedAt =
    0 < notifications.data.length
      ? new Date(
          notifications.data.sort((a, b) =>
            dateSort(a.updated_at, b.updated_at)
          )[0].updated_at
        )
      : new Date()

  const feed = new Feed({
    title: 'GitHub Notifications',
    description:
      'Depending on your notification settings, you’ll see updates here for your conversations in watched repositories.',
    id: 'https://ilmestys.now.sh/',
    link: 'https://github.com/notifications',
    image: 'https://github.githubassets.com/pinned-octocat.svg',
    favicon: 'https://github.githubassets.com/favicon.ico',
    copyright: 'GitHub, Inc.',
    updated: updatedAt,
    generator: 'ilmestys',
    author: {
      name: 'GitHub',
      link: 'https://github.com'
    }
  })

  for (const notification of notifications.data) {
    // wait 50 ms for Rate limit
    await sleep(50)

    let description: AxiosResponse<Comment | Pull>

    try {
      description = await axios.get<Comment | Pull>(
        notification.subject.latest_comment_url || notification.subject.url,
        {
          headers: {
            Authorization: `token ${token}`
          }
        }
      )
    } catch (error) {
      console.warn('Error in get description from GitHub API')
      ctx.throw(500, error)
    }
    console.info(
      `Rate limit(${sha1sum(token).substring(0, 8)}): ${
        description.headers['x-ratelimit-remaining']
      }/${description.headers['x-ratelimit-limit']}`
    )

    feed.addItem({
      title: notification.subject.title,
      id: createTagUri(notification.id),
      link: description.data.html_url,
      description: description.data.body,
      content: description.data.body,
      author: [
        {
          name: description.data.user.login,
          link: description.data.user.html_url
        }
      ],
      date: new Date(notification.updated_at),
      image: description.data.user.avatar_url
    })
  }

  ctx.type = 'application/atom+xml; charset=utf-8'
  ctx.body = feed.atom1()
}

export default atom
