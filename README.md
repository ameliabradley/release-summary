# release-summary
Gathers a summary of releases and their associated tickets

# Setup

Checkout the repo
```
git clone https://github.com/leebradley/release-summary
```

Install node modules
```
npm install
```

Copy `dev.env` to `.env`
```
cp dev.env .env
```

Update `.env` with the info about your GitHub account.

You can generate yourself a `GITHUB_OATH_TOKEN` through this url: https://github.com/settings/tokens

# Usage

## Fetch tickets related to latest releases

Just fire away
`node find-tickets.js`

The output displays the 5 latest releases and their associated tickets.

Any commits that don't reference a ticket are displayed with the full name.

Example:

```
Fetching Pull Requests
Pull Requests Fetched!

Release:  refs JACK-1414 added filter for mulberries
When:  a day ago
Tickets:  JACK-900

Release:  release/v6.44.0
When:  a day ago
Tickets:  JACK-401, JACK-1419, JACK-1410
Ticketless Commits:

  1) Merge branch 'master' v6.43.4 into hotfix-merge-v6.43.4

  2) Merge pull request #3445 from supafighta/hotfix-merge-v6.43.4
  |
  | hotfix merge v6.43.4

  3) Merge branch 'master' (v6.43.5) into merge-master-v6.43.5 (develop)

  4) Merge pull request #3452 from supafighta/merge-master-v6.43.5
  |
  | merge in master v6.43.5

  5) Merge branch 'develop' into release/v6.44.0 (master)

Release:  hotfix/v6.43.5
When:  3 days ago
Tickets:  (none)
Ticketless Commits:

  1) 6.43.5

Release:  refs JACK-1190 updated readme
When:  3 days ago
Tickets:  JACK-1189

Release:  hotfix/v6.43.4
When:  4 days ago
Tickets:  (none)
Ticketless Commits:

  1) 6.43.4
```

## Fetch tickets associated with specific pull request

Get the ID from the end of the target pull request. For example:
```
https://github.com/pigletwarlockfightas/mulberryjaminception.com/pull/3190
```

Run with the `--pr=` option:
`node find-tickets.js --pr=3190`
