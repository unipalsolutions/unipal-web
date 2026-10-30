# unipal-web

Public sites and internal dashboard of UniPal Group.

| App | Domains | Local |
| --- | --- | --- |
| `apps/sites` | unipal.group, advisors. / tax. / solutions.unipal.group | http://localhost:3000, http://tax.localhost:3000 |
| `apps/hub` | hub.unipal.group | http://localhost:3001 |

```sh
corepack enable
pnpm install
pnpm dev
```

Requires Node 22+. `@unipal/brand` installs from the `unipal-brand` GitHub repository.
See `CLAUDE.md` for structure, rules and deployment.
