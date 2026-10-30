# Forge deploy script for unipal-web. Paste into each site's "Deploy Script" and set APP to sites or hub.
# The site runs as a Forge daemon: `node apps/$APP/.next/standalone/apps/$APP/server.js` with PORT set
# (sites 3000 / staging 3100, hub 3001 / staging 3101) and Nginx proxying the domain to that port.
APP=sites

cd $FORGE_SITE_PATH
git pull origin $FORGE_SITE_BRANCH

corepack enable
pnpm install --frozen-lockfile
pnpm turbo run build --filter=$APP

# The standalone server does not include static files; copy them next to it.
cp -r apps/$APP/public apps/$APP/.next/standalone/apps/$APP/
cp -r apps/$APP/.next/static apps/$APP/.next/standalone/apps/$APP/.next/

# Restart the daemon (replace with the daemon id Forge shows for this site).
sudo -S supervisorctl restart daemon-XXXXXX:*
