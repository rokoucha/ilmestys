import { createHash } from 'crypto'

export function getToken(header: string) {
  const body = header.split(' ')[1]
  const base64 = Buffer.from(body, 'base64').toString()
  const authorization = base64.toString().split(':')

  return authorization[1]
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// based on rfc4151
export function createTagUri(specific: string) {
  const authorityName = 'ilmestys.ggrel.net'
  const date = '2022-06-21'
  const taggingEntity = `${authorityName},${date}`

  return `tag:${taggingEntity}:${specific}`
}

export function sha1sum(text: string) {
  const sha1 = createHash('sha1')
  sha1.update(text)
  return sha1.digest('hex')
}
