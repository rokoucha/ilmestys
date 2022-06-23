import { Feed } from 'feed'
import { z } from 'zod'
import { sleep, createTagUri, sha1sum } from './utils.js'

export async function generate(token: string): Promise<string> {
  const userHash = sha1sum(token).substring(0, 8)

  const res = await fetch('https://api.github.com/notifications', {
    headers: {
      Authorization: `token ${token}`,
    },
  })

  console.info(
    `Rate limit(${userHash}): ${res.headers.get(
      'x-ratelimit-remaining',
    )}/${res.headers.get('x-ratelimit-limit')}`,
  )

  const notifications = z
    .union([
      z.array(
        z.object({
          id: z.string(),
          reason: z.string(),
          repository: z.object({ full_name: z.string() }),
          subject: z.object({
            latest_comment_url: z.nullable(z.string()),
            title: z.string(),
            url: z.string(),
          }),
          updated_at: z.string().transform((v) => new Date(v)),
        }),
      ),
      z.object({
        documentation_url: z.string(),
        message: z.string(),
      }),
    ])
    .parse(await res.json())

  if ('message' in notifications) {
    throw new Error('Invalid token')
  }

  const latestAt =
    notifications
      .sort((a, b) =>
        a.updated_at == b.updated_at ? 0 : a.updated_at < b.updated_at ? 1 : -1,
      )
      .at(0)?.updated_at ?? new Date()

  const feed = new Feed({
    author: { name: 'GitHub', link: 'https://github.com' },
    copyright: 'GitHub, Inc.',
    description:
      'Depending on your notification settings, you’ll see updates here for your conversations in watched repositories.',
    favicon: 'https://github.githubassets.com/favicon.ico',
    generator: 'ilmestys',
    id: 'https://ilmestys.now.sh/',
    image: 'https://github.githubassets.com/pinned-octocat.svg',
    link: 'https://github.com/notifications',
    title: 'GitHub Notifications',
    updated: latestAt,
  })

  for (const notification of notifications) {
    // wait 50 ms for Rate limit
    await sleep(50)

    const res = await fetch(
      notification.subject.latest_comment_url ?? notification.subject.url,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      },
    )

    console.info(
      `Rate limit(${userHash}): ${res.headers.get(
        'x-ratelimit-remaining',
      )}/${res.headers.get('x-ratelimit-limit')}`,
    )

    const description = z
      .object({
        body: z.nullable(z.string()),
        html_url: z.string(),
        number: z.nullable(z.number()),
        user: z.object({
          avatar_url: z.string(),
          html_url: z.string(),
          login: z.string(),
        }),
      })
      .parse(await res.json())

    feed.addItem({
      author: [
        { name: description.user.login, link: description.user.html_url },
      ],
      content: description.body ?? '',
      date: notification.updated_at,
      description: notification.subject.title,
      id: createTagUri(notification.id),
      image: description.user.avatar_url,
      link: description.html_url,
      title: `${notification.repository.full_name} #${description.number} ${notification.subject.title} (${notification.reason})`,
    })
  }

  return feed.atom1()
}
