import User from './user'

export default interface Pull {
  url:                   string;
  id:                    number;
  node_id:               string;
  html_url:              string;
  diff_url:              string;
  patch_url:             string;
  issue_url:             string;
  number:                number;
  state:                 string;
  locked:                boolean;
  title:                 string;
  user:                  User;
  body:                  string;
  created_at:            string;
  updated_at:            string;
  closed_at:             null;
  merged_at:             null;
  merge_commit_sha:      string;
  assignee:              null;
  assignees:             any[];
  requested_reviewers:   any[];
  requested_teams:       any[];
  labels:                any[];
  milestone:             null;
  commits_url:           string;
  review_comments_url:   string;
  review_comment_url:    string;
  comments_url:          string;
  statuses_url:          string;
  head:                  Base;
  base:                  Base;
  _links:                Links;
  author_association:    string;
  merged:                boolean;
  mergeable:             boolean;
  rebaseable:            boolean;
  mergeable_state:       string;
  merged_by:             null;
  comments:              number;
  review_comments:       number;
  maintainer_can_modify: boolean;
  commits:               number;
  additions:             number;
  deletions:             number;
  changed_files:         number;
}

interface Links {
  self:            Comments;
  html:            Comments;
  issue:           Comments;
  comments:        Comments;
  review_comments: Comments;
  review_comment:  Comments;
  commits:         Comments;
  statuses:        Comments;
}

interface Comments {
  href: string;
}

interface Base {
  label: string;
  ref:   string;
  sha:   string;
  user:  User;
  repo:  Repo;
}

interface Repo {
  id:                number;
  node_id:           string;
  name:              string;
  full_name:         string;
  private:           boolean;
  owner:             User;
  html_url:          string;
  description:       string;
  fork:              boolean;
  url:               string;
  forks_url:         string;
  keys_url:          string;
  collaborators_url: string;
  teams_url:         string;
  hooks_url:         string;
  issue_events_url:  string;
  events_url:        string;
  assignees_url:     string;
  branches_url:      string;
  tags_url:          string;
  blobs_url:         string;
  git_tags_url:      string;
  git_refs_url:      string;
  trees_url:         string;
  statuses_url:      string;
  languages_url:     string;
  stargazers_url:    string;
  contributors_url:  string;
  subscribers_url:   string;
  subscription_url:  string;
  commits_url:       string;
  git_commits_url:   string;
  comments_url:      string;
  issue_comment_url: string;
  contents_url:      string;
  compare_url:       string;
  merges_url:        string;
  archive_url:       string;
  downloads_url:     string;
  issues_url:        string;
  pulls_url:         string;
  milestones_url:    string;
  notifications_url: string;
  labels_url:        string;
  releases_url:      string;
  deployments_url:   string;
  created_at:        string;
  updated_at:        string;
  pushed_at:         string;
  git_url:           string;
  ssh_url:           string;
  clone_url:         string;
  svn_url:           string;
  homepage:          string;
  size:              number;
  stargazers_count:  number;
  watchers_count:    number;
  language:          string;
  has_issues:        boolean;
  has_projects:      boolean;
  has_downloads:     boolean;
  has_wiki:          boolean;
  has_pages:         boolean;
  forks_count:       number;
  mirror_url:        null;
  archived:          boolean;
  disabled:          boolean;
  open_issues_count: number;
  license:           License;
  forks:             number;
  open_issues:       number;
  watchers:          number;
  default_branch:    string;
}

interface License {
  key:     string;
  name:    string;
  spdx_id: string;
  url:     string;
  node_id: string;
}
