# Ilmestys

RSS feed generator for GitHub notifications

## How to use

### 1. Make Personal access token

Ilmestys will require an access token to get notifications and information on a private repository.
Open <https://github.com/settings/tokens/new?description=Ilmestys&scopes=repo,notifications,read:discussion> and make an access token.

| scope             | description                          | purpose                                 |
| ----------------- | ------------------------------------ | --------------------------------------- |
| `repo`            | Full control of private repositories | get informations of private repository  |
| `notifications`   | Access notifications                 | get notifications                       |
| `read:discussion` | Read team discussions                | Access discussion in private repository |

### 2. Add Ilmestys to RSS Reader

Ilmestys will use Basic authorisation to receive access tokens.

Subscribe <https://ilmestys.ggrel.net/feed> and input authorisation information.
You can use any username but enter the access token for the password.

## License

Copyright (c) 2022 Rokoucha

Released under the MIT license, see LICENSE.
