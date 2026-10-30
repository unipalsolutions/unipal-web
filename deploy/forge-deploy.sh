# Forge deploy script for unipal-web (zero-downtime deployments).
# One Forge site per app: set APP=sites on unipal.group, APP=hub on hub.unipal.group.
#
# Site setup in Forge:
# - Node 22 or newer.
# - Environment: NEXT_PUBLIC_SITE_ENV=production (staging on staging sites), UNIPAL_API_URL=...
#   The file is linked into each release and loaded below, so the build sees it.
# - Daemon: `node apps/$APP/.next/standalone/apps/$APP/server.js`
#   directory /home/forge/<site>/current, env PORT=<port> HOSTNAME=127.0.0.1
#   Ports: sites 3000 (staging 3100), hub 3001 (staging 3101).
# - Nginx: proxy `location /` to http://127.0.0.1:<port> with `proxy_set_header Host $host;`
#   (the sites app picks the brand from the host).

$CREATE_RELEASE()

cd $FORGE_RELEASE_DIRECTORY
APP=sites

# pnpm via corepack, installed for the forge user (no sudo needed).
mkdir -p $HOME/.local/bin
export PATH="$HOME/.local/bin:$PATH" COREPACK_ENABLE_DOWNLOAD_PROMPT=0
corepack enable --install-directory $HOME/.local/bin

set -a; [ -f .env ] && . ./.env; set +a

pnpm install --frozen-lockfile
pnpm turbo run build --filter=$APP

# The standalone server does not include static files; copy them next to it.
cp -r apps/$APP/public apps/$APP/.next/standalone/apps/$APP/
cp -r apps/$APP/.next/static apps/$APP/.next/standalone/apps/$APP/.next/

$ACTIVATE_RELEASE()

# Replace with the daemon id Forge shows for this site.
sudo -S supervisorctl restart daemon-XXXXX:*
