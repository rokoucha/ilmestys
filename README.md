# Ilmestys

RSS feed generator for GitHub notifications

## How to use

### 1. Make Personal access token

Ilmestys required access token for get notifications, informations of private repository.
Open <https://github.com/settings/tokens/new?description=Ilmestys&scopes=repo,notifications,read:discussion> and make access token.

| scope | description | purpose |
|-------|-------------|---------|
| `repo` | Full control of private repositories | get informations of private repository |
| `notifications` | Access notifications | get notifications |
| `read:discussion` | Read team discussions | Access discussion in private repository |

### 2. Add Ilmestys to RSS Reader

Ilmestys use Basic authorization for receive access token.

Subscribe <https://ilmestys.now.sh/atom> and input authorization information.
You can use any username but enter the access token for the password.
