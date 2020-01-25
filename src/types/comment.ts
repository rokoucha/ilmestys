import User from './user'

export default interface Comment {
  url: string
  html_url: string
  issue_url: string
  id: number
  node_id: string
  user: User
  created_at: string
  updated_at: string
  author_association: string
  body: string
}
