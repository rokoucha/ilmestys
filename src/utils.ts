import { Base64 } from 'js-base64'
import { createHash } from 'crypto'

function getToken(header: string) {
  const body = header.split(' ')[1]
  const base64 = Base64.decode(body)
  const authorization = base64.toString().split(':')

  return authorization[1]
}

function dateSort(a: string, b: string) {
  const aDate = new Date(a)
  const bDate = new Date(b)

  return aDate == bDate ? 0 : aDate < bDate ? 1 : -1
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// based on rfc4151
function createTagUri(specific: string) {
  const authorityName = 'ilmestys.now.sh'
  const date = '2019-08-22'
  const taggingEntity = `${authorityName},${date}`

  return `tag:${taggingEntity}:${specific}`
}

function sha1sum(text: string) {
  const sha1 = createHash('sha1')
  sha1.update(text)
  return sha1.digest('hex')
}

export { dateSort, getToken, sleep, createTagUri, sha1sum }
