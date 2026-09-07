# janux-portal

## Overview

A full-stack demo/seed application for identity management. Vue.js frontend
with an Express backend. Demonstrates janux-people and janux-authorize in
action.

## Tech Stack

### Client (janux-vuejs-demo)
- **Framework**: Vue.js 2.7.16 + Vuex 3.6 + Vue Router 3.6
- **UI**: Vue-Material 1.0.0-beta-16 + Bootstrap 3.4.1
- **Build**: Vite 7.3.6 (`@vitejs/plugin-vue2`) — replaced gulp/webpack 3;
  see `doc/2026-09-07.vite-migration.md` for why and what changed
- **Templates**: Pug
- **Styles**: LESS
- **Test**: Vitest 5 + jsdom + @vue/test-utils
- **Lint**: ESLint 10, flat config (`eslint.config.js`)
- **Node**: >= 22.0.0

### Server (janux-auth-seed-server)
- **Framework**: Express 4.13.4
- **Database**: MongoDB (mongoose 4.4.14, mongodb 2.1.18)
- **Auth**: Passport + JWT (express-jwt, jsonwebtoken)
- **Test**: Mocha + Chai
- **API**: JSON-RPC

## Vendor Dependencies (must create symlinks)

Server expects these in `server/vendor/`, all three now siblings in `janux/`:
- janux-people.js → ../../../janux-people.js
- janux-authorize.js → ../../../janux-authorize.js
- janux-persist.js → ../../../janux-persist.js

Client references them from `../server/vendor/`.

The `server/vendor/` directory is not checked in and does not currently
exist — it has to be created before installing.

## Build & Run

```bash
# Create vendor symlinks first
mkdir -p server/vendor && cd server/vendor
ln -s ../../../janux-people.js .
ln -s ../../../janux-authorize.js .
ln -s ../../../janux-persist.js .

# Install and run
cd ../..
npm install          # installs server + client via postinstall
npm run build        # builds client (vite build)
npm run watch        # dev mode: server (node --watch) + client (vite), via concurrently

# Seed data
npm run generate-demo-users
npm run generate-demo-auth
```

## Notes

- Git branch: `dev`, remote: github.com/janux/janux-portal
- Database: MongoDB (configured in server/config/)
- Monorepo structure with client/ and server/ subdirectories
- This is a demo/seed application, not deployed in production, so it is the
  lowest-priority project in the janux group.
- The client build moved from gulp 3.9.1 + webpack 3 + karma/PhantomJS to
  Vite 7 + `@vitejs/plugin-vue2` + Vitest (branch `dev-vite-build`); see
  `doc/2026-09-07.vite-migration.md` for the reasoning and every
  compatibility fix that required. `eslint.config.js` (flat config, new
  with this move) also surfaces real pre-existing issues in the app code
  — see that doc's "Left as-is" section — not fixed as part of the build
  change.

## Next steps

- TypeScript 5 / Vue 3 is the natural follow-on target once this build
  lands, but is blocked on replacing Vue-Material (no Vue 3 release; all
  31 SFCs use `md-*` components) — a separate UI-library swap, not a
  build-tool change.
- `server/`'s own dependencies (Express 4.13.4, Mongoose 4.4.14, MongoDB
  driver 2.1.18) are untouched by the Vite migration and still reflect the
  original Node 6-era baseline; modernizing them is separate work.
- The five dead AngularJS specs under `client/test/common/security/` and
  the `vue/no-mutating-props` bugs the new lint config surfaced are both
  real, scoped follow-ups — see `doc/2026-09-07.vite-migration.md`.
