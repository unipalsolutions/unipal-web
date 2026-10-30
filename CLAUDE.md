# unipal-web

Web front ends of UniPal Group. Turborepo + pnpm, Next.js 16 (App Router), React 19, Tailwind 4.
The UI is Arabic first: `<html lang="ar" dir="rtl">`, so use logical utilities (`ms-`, `pe-`, `start-`, `border-s`)
and never `left`/`right` for layout.

## Layout

- `apps/sites` - the four public sites from one app. The request host picks the brand (`lib/brand.ts`):
  `unipal.group` -> group, `tax.` / `advisors.` / `solutions.` -> that company, `staging-*` the same.
  Locally: `localhost:3000`, `tax.localhost:3000`, ...
- `apps/hub` - internal dashboard (`hub.unipal.group`, port 3001). Modules mirror the Laravel modules in
  `unipal-api`; the list lives in `apps/hub/lib/modules.ts`.
- `packages/ui` - shared components (`Button`, `Card`, `Logo`, ...). Source only, transpiled by the apps.
- `packages/api-client` - fetch client for `api.unipal.group/v1`.
- `packages/config` - shared tsconfig.

## Rules

- Colors, type and the logo come from `@unipal/brand`, pinned to a commit or tag in each app's package.json.
  Never write a hex value or a font name in this repo; use the semantic Tailwind colors
  (`bg-background`, `text-foreground-muted`, `bg-accent`, `text-accent-text`, ...).
  `data-brand="tax"` on any element switches the accent for that subtree.
- Logo files are copied from the brand package into `public/brand/` by `scripts/copy-brand-assets.mjs`
  (runs before dev and build; the folder is git-ignored).
- `apps/hub/lib/demo.ts` is sample data. Replace it with API calls module by module; do not grow it.
- Auth belongs to the API (Sanctum). The hub stores the API token in an httpOnly cookie; the cookie's user
  is only for display, and every data request must go to the API with the token.
  With no `UNIPAL_API_URL`, `next dev` signs in any email (demo). Production never does.

## Commands

- `pnpm dev` / `pnpm dev:sites` / `pnpm dev:hub`
- `pnpm check` - typecheck + build everything (what CI runs)

## Branches and deploy

`main` = production, `develop` = staging. Feature branch -> PR into `develop`.
After CI passes on a push to `main`/`develop`, `.github/workflows/deploy.yml` calls the Forge deploy hooks
(secrets `FORGE_DEPLOY_HOOK_SITES`, `FORGE_DEPLOY_HOOK_HUB` in the `production` and `staging` environments).
The server side is in `deploy/forge-deploy.sh`.
