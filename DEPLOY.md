# Deploy

Production for sergionavarro.me is the static export of the `main` branch, served as plain files by Caddy on a VPS. This repository is public, so do not use GitHub Actions self-hosted runners.

## Requirements

- Node.js 18.17 or newer (Node.js 20 or 22 LTS is a good fit). Next.js 14.2.13 declares `node: ">=18.17.0"`.
- npm 10, which ships with those Node.js releases.

## Build

```bash
npm ci && npm run build
```

`npm run build` writes the site to `out/`: HTML pages, `rss.xml` (generated at build time), and static assets. Publish `out/` only. The export does not include source maps.

`next start` is not used in production. Caddy serves the files.

## Server

Clone https://github.com/navarrillo/sergionavarro.me-nextjs to `/opt/src/sergionavarro-nextjs` once. A pull-based script on the VPS then checks `origin/main` about every 2 minutes. When `main` moves, it runs `npm ci && npm run build` and atomically publishes `out/` to `/srv/sites/sergionavarro.me`.

Keep the release directories on the same filesystem as `/srv/sites` so the final `mv` is an atomic rename. `/srv/sites/sergionavarro.me` is a symlink to the current release.

```bash
#!/bin/bash
set -euo pipefail

REPO=/opt/src/sergionavarro-nextjs
BRANCH=main
SITE_LINK=/srv/sites/sergionavarro.me
RELEASES=/srv/sites/sergionavarro.me.releases

cd "$REPO"
git fetch --quiet origin "$BRANCH"
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")
if [[ "$LOCAL" == "$REMOTE" ]]; then
  exit 0
fi

git checkout --quiet "$BRANCH"
git reset --quiet --hard "origin/$BRANCH"
npm ci
npm run build

STAMP=$(date +%Y%m%d%H%M%S)
DEST="$RELEASES/$STAMP"
mkdir -p "$DEST"
cp -a out/. "$DEST/"
ln -sfn "$DEST" "${SITE_LINK}.new"
mv -Tf "${SITE_LINK}.new" "$SITE_LINK"
```

Cron, every 2 minutes:

```
*/2 * * * * /usr/local/bin/deploy-sergionavarro.sh >> /var/log/deploy-sergionavarro.log 2>&1
```

## Caddy

`www` redirects to the apex. Caddy serves the exported directory. No Node process sits in front of the site.

```
www.sergionavarro.me {
	redir https://sergionavarro.me{uri} permanent
}

sergionavarro.me {
	root * /srv/sites/sergionavarro.me
	file_server
	encode gzip
}
```
